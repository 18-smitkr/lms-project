import uuid

import razorpay
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Course, Enrollment
from .models import Payment
from .serializers import PaymentSerializer


def _client_or_none():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return None
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


def _is_student(user):
    return user.role == 'student'


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    payments = Payment.objects.filter(student=request.user).select_related('course')
    return Response(PaymentSerializer(payments, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request, course_id):
    if not _is_student(request.user):
        return Response(
            {"error": "Only students can purchase courses."},
            status=status.HTTP_403_FORBIDDEN,
        )

    course = get_object_or_404(Course, id=course_id)
    if course.price <= 0:
        return Response(
            {"error": "Free courses do not require payment."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if Enrollment.objects.filter(student=request.user, course=course).exists():
        return Response(
            {"error": "You are already enrolled in this course."},
            status=status.HTTP_409_CONFLICT,
        )

    previous_order = Payment.objects.filter(
        student=request.user,
        course=course,
        status=Payment.PENDING,
        gateway_order_id__isnull=False,
    ).order_by('-created_at').first()
    if previous_order:
        return Response({
            "key_id": settings.RAZORPAY_KEY_ID,
            "order_id": previous_order.gateway_order_id,
            "amount": int(previous_order.amount * 100),
            "currency": "INR",
        })

    client = _client_or_none()
    if client is None:
        return Response(
            {"error": "Razorpay is not configured on this server."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    receipt = f"learnova-{request.user.pk}-{course.pk}-{uuid.uuid4().hex[:12]}"
    try:
        order = client.order.create(data={
            "amount": int(course.price * 100),
            "currency": "INR",
            "payment_capture": 1,
            "receipt": receipt,
            "notes": {
                "student_id": str(request.user.pk),
                "course_id": str(course.pk),
            },
        })
    except (razorpay.errors.BadRequestError, razorpay.errors.GatewayError, razorpay.errors.ServerError):
        return Response(
            {"error": "Razorpay could not create the payment order."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    Payment.objects.create(
        student=request.user,
        course=course,
        amount=course.price,
        status=Payment.PENDING,
        gateway_order_id=order['id'],
    )
    return Response({
        "key_id": settings.RAZORPAY_KEY_ID,
        "order_id": order['id'],
        "amount": order['amount'],
        "currency": order['currency'],
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    if not _is_student(request.user):
        return Response(
            {"error": "Only students can complete course purchases."},
            status=status.HTTP_403_FORBIDDEN,
        )

    order_id = request.data.get('razorpay_order_id')
    payment_id = request.data.get('razorpay_payment_id')
    signature = request.data.get('razorpay_signature')
    course_id = request.data.get('course_id')
    if not all(isinstance(value, str) and value.strip() for value in (order_id, payment_id, signature)):
        return Response(
            {"error": "Payment order, payment ID, and signature are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        course_id = int(course_id)
    except (TypeError, ValueError):
        return Response({"error": "A valid course ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    client = _client_or_none()
    if client is None:
        return Response(
            {"error": "Razorpay is not configured on this server."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    try:
        payment = Payment.objects.select_related('course').get(
            gateway_order_id=order_id,
            student=request.user,
            course_id=course_id,
        )
    except Payment.DoesNotExist:
        return Response(
            {"error": "Payment order does not belong to this student and course."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if payment.status == Payment.SUCCESS:
        if payment.transaction_id == payment_id:
            return Response({
                "message": "Payment already verified.",
                "payment": PaymentSerializer(payment).data,
            })
        return Response(
            {"error": "This payment order has already been completed."},
            status=status.HTTP_409_CONFLICT,
        )
    if payment.status != Payment.PENDING:
        return Response(
            {"error": "This payment order is no longer pending."},
            status=status.HTTP_409_CONFLICT,
        )

    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
        gateway_payment = client.payment.fetch(payment_id)
    except razorpay.errors.SignatureVerificationError:
        return Response(
            {"error": "Payment signature verification failed."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except (razorpay.errors.BadRequestError, razorpay.errors.GatewayError, razorpay.errors.ServerError):
        return Response(
            {"error": "Unable to verify payment with Razorpay right now."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if (
        gateway_payment.get('order_id') != order_id
        or gateway_payment.get('status') != 'captured'
        or gateway_payment.get('amount') != int(payment.amount * 100)
        or gateway_payment.get('currency') != 'INR'
    ):
        return Response(
            {"error": "Razorpay has not confirmed a captured payment for this order."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        payment = Payment.objects.select_for_update().get(pk=payment.pk)
        if payment.status == Payment.SUCCESS:
            if payment.transaction_id == payment_id:
                return Response({
                    "message": "Payment already verified.",
                    "payment": PaymentSerializer(payment).data,
                })
            return Response(
                {"error": "This payment order has already been completed."},
                status=status.HTTP_409_CONFLICT,
            )
        payment.transaction_id = payment_id
        payment.status = Payment.SUCCESS
        payment.save(update_fields=['transaction_id', 'status', 'updated_at'])
        Enrollment.objects.get_or_create(student=request.user, course=payment.course)

    return Response({
        "message": "Payment verified.",
        "payment": PaymentSerializer(payment).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment_failed(request):
    order_id = request.data.get('razorpay_order_id')
    payment_id = request.data.get('razorpay_payment_id')
    if not all(isinstance(value, str) and value.strip() for value in (order_id, payment_id)):
        return Response(
            {"error": "A valid Razorpay order ID and payment ID are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    client = _client_or_none()
    if client is None:
        return Response(
            {"error": "Razorpay is not configured on this server."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    payment = get_object_or_404(
        Payment,
        gateway_order_id=order_id,
        student=request.user,
        status=Payment.PENDING,
    )
    try:
        gateway_payment = client.payment.fetch(payment_id)
    except (razorpay.errors.BadRequestError, razorpay.errors.GatewayError, razorpay.errors.ServerError):
        return Response(
            {"error": "Unable to verify the failed payment with Razorpay."},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    if gateway_payment.get('order_id') != order_id or gateway_payment.get('status') != 'failed':
        return Response(
            {"error": "Razorpay has not confirmed that this payment failed."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    payment.status = Payment.FAILED
    payment.save(update_fields=['status', 'updated_at'])
    return Response({"message": "Payment marked as failed."})

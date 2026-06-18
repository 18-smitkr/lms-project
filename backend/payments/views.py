from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from courses.models import Course, Enrollment

# Payment processing view for buying a course. This view is protected by authentication, ensuring that only logged-in users can make purchases. It retrieves the specified course, creates a payment record, enrolls the user in the course, and returns the payment details in the response.
@api_view(['POST'])
# Using the IsAuthenticated permission class to ensure that only authenticated users can access this view, which is crucial for security when handling payments and enrollments
@permission_classes([IsAuthenticated])
def buy_course(request, course_id):
    # Retrieving the course object based on the provided course_id. This will raise a 404 error if the course does not exist, which is handled by Django's default behavior when using get() without try-except.
    course = Course.objects.get(id=course_id)
    # Creating a new Payment object with the current user as the student, the specified course, the course price as the amount, and a default status of 'success'. In a real application, you would typically integrate with a payment gateway and set the status based on the payment outcome.
    payment = Payment.objects.create(
        student=request.user,
        # Linking the payment to the course being purchased, which allows for easy tracking of which courses have been paid for by which students
        course=course,
        # Setting the payment amount to the price of the course, which ensures that the correct amount is charged for each course based on its defined price in the Course model
        amount=course.price,
        # Setting the payment status to 'success' for demonstration purposes. In a production application, you would typically determine this status based on the response from the payment gateway after processing the payment.
        status='success'
    )
    # Using get_or_create to enroll the user in the course. This ensures that if the user is already enrolled, it won't create a duplicate enrollment record. The related_name 'enrollments' allows for easy reverse lookup from the User and Course models.
    Enrollment.objects.get_or_create(
        student=request.user,
        course=course
    )
    # Serializing the payment object to return its details in the response. This allows the frontend to receive information about the payment, such as the amount, status, and associated course. The PaymentSerializer converts the Payment model instance into a JSON-friendly format that can be easily consumed by the
    serializer = PaymentSerializer(payment)

    return Response(serializer.data)

# View to retrieve the payment history for the authenticated user. This view filters the Payment objects to only include those made by the current user, serializes the results, and returns them in the response. This allows users to see a history of their payments and associated courses.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    payments = Payment.objects.filter(
        student=request.user
    )

    serializer = PaymentSerializer(
        payments,
        many=True
    )

    return Response(serializer.data)



import razorpay
from django.conf import settings
from django.shortcuts import get_object_or_404

# Create Razorpay Order
# Purpose:
# - Generates order_id
# - Frontend uses it to open Razorpay Checkout

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(
    request,
    course_id
):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    client = razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        )
    )

    order_data = {
        "amount": int(
            course.price * 100
        ),
        "currency": "INR",
        "payment_capture": 1
    }

    order = client.order.create(
        data=order_data
    )

    return Response({
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"]
    })



# Verify Payment
# Purpose:
# - Verifies payment signature sent by Razorpay
# - If valid, creates Payment record and enrolls student in course
# - If invalid, returns error response
from django.conf import settings
import razorpay

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    razorpay_order_id = request.data.get(
        "razorpay_order_id"
    )
    razorpay_payment_id = request.data.get(
        "razorpay_payment_id"
    )
    razorpay_signature = request.data.get(
        "razorpay_signature"
    )

    course_id = request.data.get(
        "course_id"
    )

    client = razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        )
    )

    try:

        client.utility.verify_payment_signature({
            "razorpay_order_id":
                razorpay_order_id,
            "razorpay_payment_id":
                razorpay_payment_id,
            "razorpay_signature":
                razorpay_signature
        })

        course = Course.objects.get(
            id=course_id
        )

        payment = Payment.objects.create(
            student=request.user,
            course=course,
            amount=course.price,
            status="success"
        )

        Enrollment.objects.get_or_create(
            student=request.user,
            course=course
        )

        serializer = PaymentSerializer(
            payment
        )

        return Response({
            "message":
                "Payment Verified",
            "payment":
                serializer.data
        })

    except:

        return Response({
            "message":
                "Payment Verification Failed"
        }, status=400)

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Enrollment
from progress.models import Progress
from payments.models import Payment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_dashboard(request):

    total_courses = Enrollment.objects.filter(
        student=request.user
    ).count()

    completed_lessons = Progress.objects.filter(
        student=request.user,
        completed=True
    ).count()

    total_payments = Payment.objects.filter(
        student=request.user,
        status='success'
    ).count()

    return Response({
        "total_courses": total_courses,
        "completed_lessons": completed_lessons,
        "total_payments": total_payments
    })
    
from courses.models import Course
from courses.models import Module
from courses.models import Lesson
from payments.models import Payment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_dashboard(request):

    courses = Course.objects.filter(
        instructor=request.user
    )

    total_courses = courses.count()

    total_modules = Module.objects.filter(
        course__in=courses
    ).count()

    total_lessons = Lesson.objects.filter(
        module__course__in=courses
    ).count()

    total_students = Payment.objects.filter(
        course__in=courses,
        status='success'
    ).count()

    total_revenue = sum(
        payment.amount
        for payment in Payment.objects.filter(
            course__in=courses,
            status='success'
        )
    )

    return Response({
        "total_courses": total_courses,
        "total_modules": total_modules,
        "total_lessons": total_lessons,
        "total_students": total_students,
        "total_revenue": total_revenue
    })    
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
    
        # Total money spent by student
    total_amount_spent = sum(
        payment.amount
        for payment in Payment.objects.filter(
            student=request.user,
            status='success'
        )
    )

    return Response({
        "total_courses": total_courses,
        "completed_lessons": completed_lessons,
        "total_payments": total_payments,
        "total_amount_spent": total_amount_spent
    })
    
from courses.models import Course
from courses.models import Module
from courses.models import Lesson
from payments.models import Payment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_dashboard(request):

    # Security Check
    # Only instructors can access this dashboard
    if request.user.role != 'instructor':
        return Response(
            {
                "error": "Only instructors can access this dashboard"
            },
            status=403
        )

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
    ).values(
        'student'
    ).distinct().count()

    total_revenue = sum(
        payment.amount
        for payment in Payment.objects.filter(
            course__in=courses,
            status='success'
        )
    )
    
        # Average revenue generated per student
    average_revenue = 0

    if total_students > 0:
        average_revenue = (
            total_revenue / total_students
        )

    # Latest 5 courses created by instructor
    recent_courses = Course.objects.filter(
        instructor=request.user
    ).order_by(
        '-created_at'
    )[:5]

    return Response({
    "total_courses": total_courses,
    "total_modules": total_modules,
    "total_lessons": total_lessons,
    "total_students": total_students,
    "total_revenue": total_revenue,

    "average_revenue": round(
        average_revenue,
        2
    ),

    "recent_courses": [
        course.title
        for course in recent_courses
    ]
})
from django.db.models import Avg, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Course, Module, Lesson, Enrollment
from payments.models import Payment
from progress.models import Progress
from reviews.models import Review


# ==========================================================
# STUDENT DASHBOARD
# ==========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard(request):
    if request.user.role != "student":
        return Response(
            {"error": "Only students can access the student dashboard."},
            status=403,
        )

    user = request.user

    # Total enrolled courses
    total_courses = Enrollment.objects.filter(
        student=user
    ).count()

    # Completed lessons
    completed_lessons = Progress.objects.filter(
        student=user,
        completed=True
    ).count()

    # Successful payments
    successful_payments = Payment.objects.filter(
        student=user,
        status="success"
    )

    total_payments = successful_payments.count()

    total_amount_spent = (
        successful_payments.aggregate(
            total=Sum("amount")
        )["total"] or 0
    )

    return Response({

        "total_courses": total_courses,

        "completed_lessons": completed_lessons,

        "total_payments": total_payments,

        "total_amount_spent": total_amount_spent,

    })

# ==========================================================
# INSTRUCTOR DASHBOARD
# ==========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def instructor_dashboard(request):

    # Only instructors can access
    if request.user.role != "instructor":
        return Response(
            {
                "error": "Only instructors can access this dashboard."
            },
            status=403,
        )

    user = request.user

    # Instructor's courses
    courses = Course.objects.filter(
        instructor=user
    )

    total_courses = courses.count()

    # Total modules
    total_modules = Module.objects.filter(
        course__in=courses
    ).count()

    # Total lessons
    total_lessons = Lesson.objects.filter(
        module__course__in=courses
    ).count()

    # Successful payments
    successful_payments = Payment.objects.filter(
        course__in=courses,
        status="success"
    )

    # Unique students
    total_students = Enrollment.objects.filter(
        course__in=courses
    ).values("student").distinct().count()

    # Total revenue
    total_revenue = (
        successful_payments.aggregate(
            total=Sum("amount")
        )["total"] or 0
    )

    # Average revenue per student
    average_revenue = 0

    if total_students > 0:
        average_revenue = round(
            total_revenue / total_students,
            2
        )

    # Latest 5 courses
    recent_courses = (
        courses
        .order_by("-created_at")[:5]
    )

    return Response({

        "total_courses": total_courses,

        "total_modules": total_modules,

        "total_lessons": total_lessons,

        "total_students": total_students,

        "total_revenue": total_revenue,

        "average_revenue": average_revenue,

        "recent_courses": [
            {
                "id": course.id,
                "title": course.title,
            }
            for course in recent_courses
        ],

    })

# ==========================================================
# SIDEBAR DATA
# ==========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sidebar_data(request):
    if request.user.role != "student":
        return Response(
            {"error": "Only students can access student sidebar data."},
            status=403,
        )

    user = request.user

    # Total enrolled courses
    total_courses = Enrollment.objects.filter(
        student=user
    ).count()

    from courses.models import Wishlist
    from notification.models import Notification

    wishlist_count = Wishlist.objects.filter(student=user).count()
    notification_count = Notification.objects.filter(user=user, is_read=False).count()

    return Response({

        "courses": total_courses,

        "wishlist": wishlist_count,

        "notifications": notification_count,

    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_analytics(request, course_id):
    if request.user.role != "instructor":
        return Response({"error": "Only instructors can access course analytics."}, status=403)
    course = Course.objects.filter(id=course_id, instructor=request.user).first()
    if course is None:
        return Response({"error": "Course not found."}, status=404)

    lessons = Lesson.objects.filter(module__course=course)
    total_lessons = lessons.count()
    completed_progress = Progress.objects.filter(
        lesson__in=lessons,
        completed=True,
    )
    students = Enrollment.objects.filter(course=course).values_list('student_id', flat=True)
    completed_courses = sum(
        Progress.objects.filter(
            student_id=student_id,
            lesson__in=lessons,
            completed=True,
        ).count() == total_lessons
        for student_id in students
    ) if total_lessons else 0
    successful_payments = Payment.objects.filter(course=course, status="success")
    return Response({
        "course_id": course.id,
        "course_title": course.title,
        "enrolled_students": Enrollment.objects.filter(course=course).count(),
        "total_lessons": total_lessons,
        "completed_lessons": completed_progress.count(),
        "course_completions": completed_courses,
        "average_rating": Review.objects.filter(course=course).aggregate(value=Avg("rating"))["value"] or 0,
        "review_count": Review.objects.filter(course=course).count(),
        "revenue": successful_payments.aggregate(value=Sum("amount"))["value"] or 0,
    })
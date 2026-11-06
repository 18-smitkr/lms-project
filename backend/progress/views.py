from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Certificate, Progress
from courses.models import Course, Lesson
from .serializers import ProgressSerializer
from courses.models import Enrollment
from notification.models import Notification


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_lesson(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    if request.user.role != 'student' or not Enrollment.objects.filter(
        student=request.user,
        course=lesson.module.course,
    ).exists():
        return Response(
            {'error': 'You must be enrolled in this course to save lesson progress.'},
            status=403,
        )

    progress, created = Progress.objects.get_or_create(
        student=request.user,
        lesson=lesson,
    )
    was_completed = progress.completed
    progress.completed = True
    progress.save(update_fields=['completed', 'completed_at'])
    if not was_completed:
        Notification.objects.create(
            user=request.user,
            title="Lesson completed",
            message=f"You completed {lesson.title} in {lesson.module.course.title}.",
        )

    course = lesson.module.course
    course_lessons = Lesson.objects.filter(module__course=course)
    total_lessons = course_lessons.count()
    completed_lessons = Progress.objects.filter(
        student=request.user,
        lesson__in=course_lessons,
        completed=True,
    ).count()
    if total_lessons and completed_lessons == total_lessons:
        certificate, certificate_created = Certificate.objects.get_or_create(
            student=request.user,
            course=course,
        )
        if certificate_created:
            Notification.objects.create(
                user=request.user,
                title="Course certificate earned",
                message=f"You completed {course.title} and earned a certificate.",
            )

    return Response({
        'message': 'Lesson marked completed',
        'progress': ProgressSerializer(progress).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):
    if request.user.role != 'student':
        return Response(
            {'error': 'Only students can access learning progress.'},
            status=403,
        )

    progress_records = Progress.objects.filter(
        student=request.user,
        completed=True,
    ).select_related('lesson__module__course').order_by('-completed_at')
    return Response([
        {
            **ProgressSerializer(record).data,
            "course_id": record.lesson.module.course_id,
            "course_title": record.lesson.module.course.title,
            "lesson_title": record.lesson.title,
        }
        for record in progress_records
    ])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_certificates(request):
    if request.user.role != 'student':
        return Response(
            {'error': 'Only students can access certificates.'},
            status=403,
        )

    certificates = Certificate.objects.filter(
        student=request.user,
    ).select_related('course').order_by('-issued_at')
    return Response([
        {
            "certificate_id": certificate.certificate_id,
            "course_id": certificate.course_id,
            "course_title": certificate.course.title,
            "issued_at": certificate.issued_at,
        }
        for certificate in certificates
    ])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_progress(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    if request.user.role != 'student' or not Enrollment.objects.filter(
        student=request.user,
        course=course,
    ).exists():
        return Response(
            {'error': 'You must be enrolled in this course to view its progress.'},
            status=403,
        )
    lessons = Lesson.objects.filter(module__course=course)
    total_lessons = lessons.count()

    completed_lessons = Progress.objects.filter(
        student=request.user,
        lesson__in=lessons,
        completed=True,
    ).count()

    percentage = 0
    if total_lessons > 0:
        percentage = (completed_lessons / total_lessons) * 100

    return Response({
        'course_title': course.title,
        'total_lessons': total_lessons,
        'completed_lessons': completed_lessons,
        'completion_percentage': round(percentage, 2),
        'course_completed': completed_lessons == total_lessons and total_lessons > 0,
    })

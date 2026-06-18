from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Progress
from courses.models import Course, Lesson
from .serializers import ProgressSerializer


# Complete Lesson API
# Purpose:
# Student marks a lesson as completed

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_lesson(request, lesson_id):

    # Fetch lesson
    lesson = get_object_or_404(
        Lesson,
        id=lesson_id
    )

    # Create progress record
    progress, created = Progress.objects.get_or_create(
        student=request.user,
        lesson=lesson
    )

    if created:
        return Response({
            "message": "Lesson marked completed"
        })

    return Response({
        "message": "Lesson already completed"
    })
    
from .serializers import ProgressSerializer


# My Progress API
# Purpose:
# - Shows all completed lessons

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):

    progress = Progress.objects.filter(
        student=request.user,
        completed=True
    )

    serializer = ProgressSerializer(
        progress,
        many=True
    )

    return Response(serializer.data)    



# Course Progress API
#
# Purpose:
# - Calculates how much of a course
#   the student has completed
#
# Example:
# Course:
#    Module 1 -> 3 lessons
#    Module 2 -> 2 lessons
#
# Total Lessons = 5
#
# Student completed = 3
#
# Completion = 60%

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_progress(request, course_id):

    # Fetch course
    course = get_object_or_404(
        Course,
        id=course_id
    )

    # All lessons in this course
    lessons = Lesson.objects.filter(
        module__course=course
    )

    total_lessons = lessons.count()

    completed_lessons = Progress.objects.filter(
        student=request.user,
        lesson__in=lessons
    ).count()

    percentage = 0

    if total_lessons > 0:
        percentage = (
            completed_lessons / total_lessons
        ) * 100

    return Response({
        "course_title": course.title,
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "completion_percentage": round(
            percentage,
            2
        ),
        "course_completed":
            completed_lessons == total_lessons
            and total_lessons > 0
    })
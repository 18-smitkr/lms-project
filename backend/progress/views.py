from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Progress
from courses.models import Lesson
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
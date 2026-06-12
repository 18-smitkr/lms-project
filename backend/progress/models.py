from django.db import models
from accounts.models import User
from courses.models import Lesson


# Progress Model
# Purpose:
# - Tracks lesson completion for a student
# - Used to calculate course progress %

class Progress(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='progress'
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='progress'
    )

    completed = models.BooleanField(
        default=False
    )

    completed_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        # Prevent duplicate progress records
        unique_together = (
            'student',
            'lesson'
        )

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"
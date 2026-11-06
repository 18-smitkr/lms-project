import uuid

from django.db import models
from accounts.models import User
from courses.models import Course, Lesson


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


class Certificate(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='certificates',
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='certificates',
    )
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'course'], name='unique_student_course_certificate'),
        ]

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"
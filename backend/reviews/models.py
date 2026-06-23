from django.db import models


from django.db import models
from accounts.models import User
from courses.models import Course


# Review Model
# Purpose:
# - Stores student rating and review
# - One student can review a course only once

class Review(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    rating = models.IntegerField()

    review_text = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        # Prevent duplicate reviews
        unique_together = (
            'student',
            'course'
        )

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"
from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import User
from courses.models import Course


class Payment(models.Model):
    PENDING = 'pending'
    SUCCESS = 'success'
    FAILED = 'failed'
    # Using a tuple of tuples for choices is more efficient and recommended by Django documentation
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (SUCCESS, 'Success'),
        (FAILED, 'Failed'),
    ]
    # Using ForeignKey to link to User and Course models, with related_name for reverse lookups
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="payments"
    )
    # Using DecimalField for amount to ensure precision, with validators to prevent negative values
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    # Using CharField with choices for status to ensure data integrity and provide a clear set of options
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    # Using CharField for transaction_id to store the unique identifier for each payment transaction
    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True
    )
    # Using DateTimeField with auto_now_add and auto_now to automatically set timestamps for creation and updates
    # This allows for easy tracking of when payments were made and last updated without needing to manually set these fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Adding indexes on student, course, and status fields to improve query performance when filtering by these fields
    class Meta:
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['course']),
            models.Index(fields=['status']),
        ]
    # Defining the __str__ method to provide a human-readable representation of the Payment object, which is useful for debugging and admin interfaces
    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.status})"

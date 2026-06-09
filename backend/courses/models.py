from django.db import models
from accounts.models import User

# Create your models here.
class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=1000)
    price = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0
   )
    instructor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses_created'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
  

  
  
class Module(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='modules'
    )

    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title
      
      
class Lesson(models.Model):
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='lessons'
    )

    title = models.CharField(max_length=200)

    video_url = models.URLField()

    duration = models.IntegerField(
        help_text="Duration in minutes"
    )

    def __str__(self):
        return self.title    
    
    




# ForeignKey → Creates Many-to-One relationship

# related_name → Allows reverse lookup
# Example:
# user.enrollments.all()
# course.enrollments.all()

# on_delete=models.CASCADE
# Deletes enrollments if user/course is deleted

# unique_together
# Prevents same student from enrolling twice
# Enrollment links a Student with a Course
class Enrollment(models.Model):

    # One student can enroll in many courses
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )

    # One course can have many students
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )

    # Stores enrollment timestamp automatically
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent duplicate enrollments
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"  
      
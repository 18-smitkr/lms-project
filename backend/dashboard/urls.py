from django.urls import path
from .views import (
    student_dashboard,
    instructor_dashboard
)

urlpatterns = [
  # Student Dashboard API
  path('student-dashboard/',student_dashboard,name='student_dashboard'),
  # Instructor Dashboard API
  path('instructor-dashboard/',instructor_dashboard,name='instructor_dashboard'),
]
from django.urls import path

from .views import (
    student_dashboard,
    instructor_dashboard,
    sidebar_data,
    course_analytics,
)

urlpatterns = [

    path(
        "student/",
        student_dashboard
    ),

    path(
        "instructor/",
        instructor_dashboard
    ),

    path(
        "sidebar/",
        sidebar_data
    ),
    path(
        "course-analytics/<int:course_id>/",
        course_analytics
    ),

]
from django.urls import path
from .views import complete_lesson, course_progress, my_progress

urlpatterns = [
    # Complete Lesson API
    # Student marks a lesson as completed
    path('complete-lesson/<int:lesson_id>/',complete_lesson,name='complete_lesson'),
    # My Progress API
    # shows all completed lessons by a student
    path('my-progress/',my_progress,name='my_progress'),
    # Course Progress API
    # shows how much of a course has been completed by a student
    path('course-progress/<int:course_id>/',course_progress,name='course_progress'),

]
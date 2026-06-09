from django.urls import path
from .views import (
    courses_list,
    module_list,
    lesson_list,
    enrollment_list,
    enroll_course,
    my_courses,
    course_detail,
    create_course,
    update_course,
    delete_course,
)

urlpatterns = [
    path('courses/', courses_list, name='courses_list'),
    path('modules/', module_list, name='module_list'),
    path('lessons/', lesson_list, name='lesson_list'),
    path('enrollments/', enrollment_list, name='enrollment_list'),
    path('enroll/<int:course_id>/',enroll_course,name='enroll_course'),
    path('my-courses/',my_courses,name='my_courses'),
    path('course/<int:course_id>/',course_detail,name='course_detail'),
    path('create-course/',create_course,name='create_course'),
    path('update-course/<int:course_id>/',update_course,name='update_course'),
    path('delete-course/<int:course_id>/',delete_course,name='delete_course'),
]
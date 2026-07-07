# api_view is a decorator in Django REST Framework (DRF) that converts a normal Django function into a DRF API view.
# Why do we use it?
# Normally, Django function views work with Django's HttpRequest and HttpResponse.

# When you use @api_view:

# Converts HttpRequest → DRF Request
# Enables DRF features
# JSON parsing
# Authentication
# Permissions
# Browsable API
# Proper API responses


# Response is a DRF class used to return API responses. It automatically renders Python data into JSON and allows sending HTTP status codes."
# Response

# ✓ Sends data back to client
# ✓ Converts data to JSON
# ✓ Used in DRF APIs
# ✓ Supports status codes
# ✓ Replacement for HttpResponse in DRF


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course, Module, Lesson, Enrollment
from .serializers import (
    CoursesSerializer,
    ModuleSerializer,
    LessonSerializer,
    EnrollmentSerializer
)
# IsAuthenticated is a permission class in Django REST Framework (DRF) that restricts access to authenticated users only. It ensures that only users who have successfully logged in can access certain views or endpoints.
# Why do we use it?
# IsAuthenticated:
# - Restricts access to authenticated users
# - Denies access to anonymous users
# - Used in DRF views

# permission_classes:
# Why do we use it?
# permission_classes:
# - Specifies permissions for a view
# - Controls access based on user authentication
# - Used in DRF views
# - Example: @permission_classes([IsAuthenticated]) restricts access to authenticated users only.
# get_object_or_404:
# Why do we use it?
# get_object_or_404:
# - Retrieves an object or raises 404 if not found
# - Simplifies error handling in views
# - Commonly used in DRF views to fetch objects based on URL parameters
# - Example: course = get_object_or_404(Course, id=course_id)
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.shortcuts import get_object_or_404

# Create your views here.
# @api_view(['GET']) is a decorator that specifies that this view will handle GET requests. It converts the function into a DRF API view.
@api_view(['GET'])
def courses_list(request):
    # Fetch all courses from the database
    courses = Course.objects.all()
    # Serialize the course data into JSON format
    serializer = CoursesSerializer(courses, many=True)
    # Return the serialized data as a JSON response
    return Response(serializer.data)

# this view will handle GET requests to list all modules. It fetches all Module objects, serializes them, and returns the data as a JSON response.
@api_view(['GET'])
def module_list(request):
    modules = Module.objects.all()
    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data)

# this view will handle GET requests to list all lessons. It fetches all Lesson objects, serializes them, and returns the data as a JSON response.
@api_view(['GET'])
def lesson_list(request):
    lessons = Lesson.objects.all()
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)



# this view will handle GET requests to list all enrollments. It fetches all Enrollment objects, serializes them, and returns the data as a JSON response.
@api_view(['GET'])
def enrollment_list(request):
    enrollments = Enrollment.objects.all()
    serializer = EnrollmentSerializer(
        enrollments,
        many=True
    )
    return Response(serializer.data)

# 1. @api_view(['POST']) → This view will handle POST requests to enroll in a course.
# 2. @permission_classes([IsAuthenticated]) → Only authenticated users can access this view
# 3. get_object_or_404 → Fetches the course based on course_id or returns a 404 error if not found.
# 4. Enrollment.objects.get_or_create → Tries to create an enrollment. If it already exists, it returns the existing one.
# 5. Returns a success message if enrollment is created, or a message indicating the user is already enrolled if the enrollment already exists.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request, course_id):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    enrollment, created = Enrollment.objects.get_or_create(
        student=request.user,
        course=course
    )

    if created:
        return Response({
            "message": "Enrollment successful"
        })

    return Response({
        "message": "Already enrolled"
    })
    
from .serializers import MyCourseSerializer   
@api_view(['GET'])
@permission_classes([IsAuthenticated])
# This view will handle GET requests to list the courses the authenticated user is enrolled in. It filters enrollments by the current user, serializes the data, and returns it as a JSON response.
def my_courses(request):
    # Fetch enrollments for the authenticated user
    enrollments = Enrollment.objects.filter(
        student=request.user
    )
    # Serialize the enrollment data into JSON format
    serializer = MyCourseSerializer(
        enrollments,
        many=True
    )
    # Return the serialized data as a JSON response
    return Response(serializer.data)

# - This view will handle GET requests to retrieve details of a specific course based on the course_id provided in the URL. It uses get_object_or_404 to fetch the course, serializes it using CoursesSerializer, and returns the data as a JSON response.
from django.shortcuts import get_object_or_404
@api_view(['GET'])
def course_detail(request, course_id):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    serializer = CoursesSerializer(course)

    return Response(serializer.data)

# # - This view will handle POST requests to create a new course. It uses CreateCourseSerializer to validate the incoming data, saves the course with the authenticated user as the instructor, and returns the created course data as a JSON response. If the data is invalid, it returns the validation errors.
# from .serializers import CreateCourseSerializer
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_course(request):
# # - CreateCourseSerializer is used to validate the incoming data for creating a new course. It checks if the provided data meets the required fields and formats defined in the serializer.
#     serializer = CreateCourseSerializer(
#         data=request.data
#     )
# # - If the data is valid, it saves the course with the authenticated user as the instructor. The save() method is called with instructor=request.user to associate the course with the user who created it.
#     if serializer.is_valid():
#         serializer.save(
#             instructor=request.user
#         )
# # - If the course is successfully created, it returns the serialized course data as a JSON response with a status code of 201 (Created). If the data is invalid, it returns the validation errors with a status code of 400 (Bad Request).
#         return Response(
#             serializer.data,
#             status=201
#         )

#     return Response(
#         serializer.errors,
#         status=400
#     )  
from .serializers import CreateCourseSerializer
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):

    if request.user.role != 'instructor':
        return Response(
            {
                "error": "Only instructors can create courses"
            },
            status=403
        )

    serializer = CreateCourseSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save(
            instructor=request.user
        )

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )
    
from rest_framework import status
#
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_course(request, course_id):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    if course.instructor != request.user:
        return Response(
            {"error": "You can update only your courses"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = CoursesSerializer(
        course,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )    
    
    
    
@api_view(['DELETE'])
# 
@permission_classes([IsAuthenticated])
def delete_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if course.instructor != request.user:
        return Response(
            {"error": "You can delete only your courses"},
            status=status.HTTP_403_FORBIDDEN
        )

    course.delete()

    return Response(
        {"message": "Course deleted successfully"},
        status=status.HTTP_200_OK
    )   
    
    
# Module API
# Purpose:
# - Allows an instructor to add modules to a course
# - Example:
#   Python Course
#      ├── Introduction
#      ├── Variables
#      └── Functions

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_module(request, course_id):

    # Fetch course or return 404 if course doesn't exist
    course = get_object_or_404(
        Course,
        id=course_id
    )

    # Security Check
    # Only the instructor who created the course
    # can add modules to it
    if course.instructor != request.user:
        return Response(
            {
                "error": "Only course instructor can add modules"
            },
            status=403
        )

    # Validate incoming JSON data
    serializer = ModuleSerializer(
        data=request.data
    )

    if serializer.is_valid():

        # Save module and automatically link it
        # to the selected course
        serializer.save(
            course=course
        )

        return Response(
            serializer.data,
            status=201
        )

    # Return validation errors if data is invalid
    return Response(
        serializer.errors,
        status=400
   )     


# Module List API
# Purpose:
# - Show all modules inside a specific course
# Example:
# Python Course
#    ├── Introduction
#    ├── Variables
#    └── Functions
@api_view(['GET'])
def course_modules(request, course_id):

    modules = Module.objects.filter(
        course_id=course_id
    )

    serializer = ModuleSerializer(
        modules,
        many=True
    )

    return Response(serializer.data)
 
# Module Detail API
# Purpose:
# - Returns complete information about a module
# - Also returns all lessons inside that module
#
# Example:
# Python Basics
#    ├── Variables
#    ├── Data Types
#    └── Functions

@api_view(['GET'])
def module_detail(request, module_id):

    # Fetch module or return 404
    module = get_object_or_404(
        Module,
        id=module_id
    )

    serializer = ModuleSerializer(
        module
    )

    return Response(
        serializer.data
    )
    
    
    
        
# Update Module API
# Purpose:
# - Allows instructor to edit an existing module
# Example:
#   "Python Basics" -> "Python Fundamentals"

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_module(request, module_id):

    # Fetch module or return 404
    module = get_object_or_404(
        Module,
        id=module_id
    )

    # Ownership check
    # Only course creator can update module
    if module.course.instructor != request.user:
        return Response(
            {
                "error": "You can update only your modules"
            },
            status=403
        )

    serializer = ModuleSerializer(
        module,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        # Save updated data
        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=400
    )    

# Delete Module API
# Purpose:
# - Allows instructor to delete a module
#
# Example:
# Python Course
#    ├── Introduction
#    ├── Variables
#    └── Functions
#
# If "Introduction" module is deleted,
# all lessons inside it will also be deleted
# because of on_delete=models.CASCADE
#
# Security:
# - Only the course instructor can delete modules

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_module(request, module_id):

    # Fetch module or return 404
    module = get_object_or_404(
        Module,
        id=module_id
    )

    # Ownership check
    # Only instructor who owns the course
    # can delete the module
    if module.course.instructor != request.user:
        return Response(
            {
                "error": "You can delete only your modules"
            },
            status=403
        )

    # Delete module
    module.delete()

    return Response(
        {
            "message": "Module deleted successfully"
        },
        status=200
    )   
    
# Create Lesson API
# Purpose:
# - Allows instructor to add lessons inside a module
#
# Example:
# Module: Python Basics
#      ├── Variables
#      ├── Data Types
#      └── Functions
#
# Security:
# - Only course instructor can add lessons

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lesson(request, module_id):

    # Fetch module or return 404
    module = get_object_or_404(
        Module,
        id=module_id
    )

    # Ownership check
    if module.course.instructor != request.user:
        return Response(
            {
                "error": "Only instructor can add lessons"
            },
            status=403
        )

    serializer = LessonSerializer(
        data=request.data
    )

    if serializer.is_valid():

        # Automatically attach lesson to module
        serializer.save(
            module=module
        )

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )  
    
    
# Lesson List API
# Purpose:
# - Show all lessons inside a specific module

@api_view(['GET'])
def module_lessons(request, module_id):

    lessons = Lesson.objects.filter(
        module_id=module_id
    )

    serializer = LessonSerializer(
        lessons,
        many=True
    )

    return Response(serializer.data)  



# Lesson Detail API
# Purpose:
# - Returns complete information about a lesson
# - Used when student opens a lesson

@api_view(['GET'])
def lesson_detail(request, lesson_id):

    # Fetch lesson or return 404
    lesson = get_object_or_404(
        Lesson,
        id=lesson_id
    )

    serializer = LessonSerializer(
        lesson
    )

    return Response(
        serializer.data
    )    

# Update Lesson API
# Purpose:
# - Instructor can edit lesson details

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_lesson(request, lesson_id):

    lesson = get_object_or_404(
        Lesson,
        id=lesson_id
    )

    # Ownership check
    if lesson.module.course.instructor != request.user:
        return Response(
            {
                "error": "You can update only your lessons"
            },
            status=403
        )

    serializer = LessonSerializer(
        lesson,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=400
    )
    
# Delete Lesson API
# Purpose:
# - Instructor can delete lessons

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_lesson(request, lesson_id):

    lesson = get_object_or_404(
        Lesson,
        id=lesson_id
    )

    # Ownership check
    if lesson.module.course.instructor != request.user:
        return Response(
            {
                "error": "You can delete only your lessons"
            },
            status=403
        )

    lesson.delete()

    return Response(
        {
            "message": "Lesson deleted successfully"
        }
    )
    
from django.contrib.auth import get_user_model
User = get_user_model()


@api_view(["GET"])
def website_stats(request):

    total_students = User.objects.filter(role="student").count()

    total_instructors = User.objects.filter(role="instructor").count()

    total_courses = Course.objects.count()

    total_lessons = Lesson.objects.count()

    return Response({
        "students": total_students,
        "instructors": total_instructors,
        "courses": total_courses,
        "lessons": total_lessons,
    })
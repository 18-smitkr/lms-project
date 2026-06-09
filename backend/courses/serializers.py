# ModelSerializer

# ✓ Converts Model → JSON
# ✓ Converts JSON → Model
# ✓ Performs Validation
# ✓ Reduces Boilerplate Code
# ✓ Uses Meta class for configuration

# Meta:
#     model = Courses
#     fields = '__all__'

# Serialization:
# Model → Serializer → JSON

# Deserialization:
# JSON → Serializer → Validation → Model → Database

from rest_framework import serializers
from .models import Course, Module, Lesson , Enrollment


class LessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):

    # Show all lessons inside a module
    lessons = LessonSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Module
        fields = '__all__'


class CoursesSerializer(serializers.ModelSerializer):

    # Show all modules inside a course
    modules = ModuleSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Course
        fields = '__all__'
        
        
class EnrollmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Enrollment
        fields = '__all__'     
        


# - Serializer for My Courses API
# - Shows course title, description, and enrollment date for each course the user is enrolled in.

class MyCourseSerializer(serializers.ModelSerializer):
    # - Show course title and description from the related Course model
    course_title = serializers.CharField(
        source='course.title',
        read_only=True
    )

    course_description = serializers.CharField(
        source='course.description',
        read_only=True
    )
    
    class Meta:
        model = Enrollment
        fields = [
            'id',
            'course_title',
            'course_description',
            'enrolled_at'
        ]        
           
           
class CreateCourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = [
            'title',
            'description'
        ]           
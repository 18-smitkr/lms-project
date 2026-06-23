from rest_framework import serializers
from .models import Progress


# Progress Serializer
# Converts Progress Model ↔ JSON

class ProgressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Progress
        fields = '__all__'
        
        
from rest_framework import serializers

class CourseProgressSerializer(serializers.Serializer):

    course_title = serializers.CharField()

    total_lessons = serializers.IntegerField()
    
    completed_lessons = serializers.IntegerField()
    
    completion_percentage = serializers.FloatField()
    
    course_completed = serializers.BooleanField()        
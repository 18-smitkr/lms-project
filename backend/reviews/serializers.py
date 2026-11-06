from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    review_text = serializers.CharField(trim_whitespace=True, allow_blank=False)
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'student',
            'course',
            'rating',
            'review_text',
            'created_at',
            'student_username',
        ]

        read_only_fields = [
            'student',
            'course',
            'created_at'
        ]
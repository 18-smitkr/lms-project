from rest_framework import serializers
from .models import Progress


# Progress Serializer
# Converts Progress Model ↔ JSON

class ProgressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Progress
        fields = '__all__'
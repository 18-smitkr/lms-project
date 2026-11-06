from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    records = Notification.objects.filter(user=request.user)
    return Response([
        {
            "id": item.id,
            "title": item.title,
            "message": item.message,
            "is_read": item.is_read,
            "created_at": item.created_at,
        }
        for item in records
    ])


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    item = get_object_or_404(Notification, id=notification_id, user=request.user)
    item.is_read = True
    item.save(update_fields=['is_read'])
    return Response({"message": "Notification marked as read."})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"message": "Notifications marked as read."})

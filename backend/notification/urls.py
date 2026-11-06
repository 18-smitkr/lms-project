from django.urls import path

from .views import mark_all_notifications_read, mark_notification_read, notifications

urlpatterns = [
    path('', notifications, name='notifications'),
    path('read-all/', mark_all_notifications_read, name='mark_all_notifications_read'),
    path('<int:notification_id>/read/', mark_notification_read, name='mark_notification_read'),
]

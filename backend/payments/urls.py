from django.urls import path
from .views import buy_course, payment_history

urlpatterns = [
    path('buy-course/<int:course_id>/',buy_course,name='buy_course'),
    path(
        'payment-history/',
        payment_history,
        name='payment_history'
    ),
]

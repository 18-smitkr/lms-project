from django.urls import path
from .views import create_payment_order, payment_failed, payment_history, verify_payment

urlpatterns = [
    # Payment History API
    path('payment-history/',payment_history,name='payment_history'),
    # Create Payment Order API
    path('create-order/<int:course_id>/',create_payment_order,name='create_payment_order'),
    # Verify Payment API
    path('verify-payment/',verify_payment,name='verify_payment'), 
    path('payment-failed/',payment_failed,name='payment_failed'),
]

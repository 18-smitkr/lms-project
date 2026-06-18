from django.urls import path
from .views import buy_course, create_payment_order, payment_history, verify_payment

urlpatterns = [
    # Buy Course API
    path('buy-course/<int:course_id>/',buy_course,name='buy_course'),
    # Payment History API
    path('payment-history/',payment_history,name='payment_history'),
    # Create Payment Order API
    path('create-order/<int:course_id>/',create_payment_order,name='create_payment_order'),
    # Verify Payment API
    path('verify-payment/',verify_payment,name='verify_payment'), 
]

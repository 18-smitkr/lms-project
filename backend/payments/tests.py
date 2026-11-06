from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from courses.models import Course, Enrollment
from .models import Payment


@override_settings(RAZORPAY_KEY_ID='rzp_test_public', RAZORPAY_KEY_SECRET='test-secret')
class PaymentApiTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.student = user_model.objects.create_user(
            username='paymentstudent',
            password='StudentPassword!438',
            role='student',
        )
        self.other_student = user_model.objects.create_user(
            username='otherstudent',
            password='StudentPassword!438',
            role='student',
        )
        self.instructor = user_model.objects.create_user(
            username='paymentinstructor',
            password='InstructorPassword!438',
            role='instructor',
        )
        self.course = Course.objects.create(
            title='Payment course',
            description='Payment integration test course.',
            price='55.00',
            instructor=self.instructor,
        )
        self.client = APIClient()

    def test_order_is_bound_to_student_and_course_and_pending_order_is_reused(self):
        gateway = patch('payments.views.razorpay.Client').start()
        self.addCleanup(patch.stopall)
        gateway.return_value.order.create.return_value = {
            'id': 'order_bound_1',
            'amount': 5500,
            'currency': 'INR',
        }
        self.client.force_authenticate(user=self.student)

        first = self.client.post(f'/api/payments/create-order/{self.course.id}/')
        second = self.client.post(f'/api/payments/create-order/{self.course.id}/')
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(first.data['key_id'], 'rzp_test_public')
        self.assertEqual(Payment.objects.filter(student=self.student, course=self.course).count(), 1)
        gateway.return_value.order.create.assert_called_once()

        self.client.force_authenticate(user=self.other_student)
        wrong_user = self.client.post('/api/payments/verify-payment/', {
            'razorpay_order_id': 'order_bound_1',
            'razorpay_payment_id': 'pay_1',
            'razorpay_signature': 'signature',
            'course_id': self.course.id,
        }, format='json')
        self.assertEqual(wrong_user.status_code, 404)

    def test_only_captured_signed_payment_creates_success_and_enrollment_idempotently(self):
        client_patch = patch('payments.views.razorpay.Client')
        gateway_class = client_patch.start()
        self.addCleanup(client_patch.stop)
        gateway = gateway_class.return_value
        gateway.order.create.return_value = {
            'id': 'order_verified_2',
            'amount': 5500,
            'currency': 'INR',
        }
        gateway.payment.fetch.return_value = {
            'id': 'pay_verified_2',
            'order_id': 'order_verified_2',
            'amount': 5500,
            'currency': 'INR',
            'status': 'captured',
        }
        self.client.force_authenticate(user=self.student)
        order = self.client.post(f'/api/payments/create-order/{self.course.id}/')
        self.assertEqual(order.status_code, 201)

        payload = {
            'razorpay_order_id': 'order_verified_2',
            'razorpay_payment_id': 'pay_verified_2',
            'razorpay_signature': 'valid-signature',
            'course_id': self.course.id,
        }
        first = self.client.post('/api/payments/verify-payment/', payload, format='json')
        second = self.client.post('/api/payments/verify-payment/', payload, format='json')
        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        payment = Payment.objects.get(gateway_order_id='order_verified_2')
        self.assertEqual(payment.status, Payment.SUCCESS)
        self.assertEqual(payment.transaction_id, 'pay_verified_2')
        self.assertEqual(Enrollment.objects.filter(student=self.student, course=self.course).count(), 1)
        gateway.payment.fetch.assert_called_once_with('pay_verified_2')

    def test_uncaptured_payment_and_failed_order_do_not_enroll(self):
        client_patch = patch('payments.views.razorpay.Client')
        gateway_class = client_patch.start()
        self.addCleanup(client_patch.stop)
        gateway = gateway_class.return_value
        gateway.order.create.return_value = {
            'id': 'order_uncaptured_3',
            'amount': 5500,
            'currency': 'INR',
        }
        gateway.payment.fetch.return_value = {
            'id': 'pay_uncaptured_3',
            'order_id': 'order_uncaptured_3',
            'amount': 5500,
            'currency': 'INR',
            'status': 'authorized',
        }
        self.client.force_authenticate(user=self.student)
        self.client.post(f'/api/payments/create-order/{self.course.id}/')
        response = self.client.post('/api/payments/verify-payment/', {
            'razorpay_order_id': 'order_uncaptured_3',
            'razorpay_payment_id': 'pay_uncaptured_3',
            'razorpay_signature': 'signature',
            'course_id': self.course.id,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Enrollment.objects.filter(student=self.student, course=self.course).exists())

        gateway.payment.fetch.return_value = {
            'id': 'pay_failed_3',
            'order_id': 'order_uncaptured_3',
            'status': 'failed',
        }
        failed = self.client.post('/api/payments/payment-failed/', {
            'razorpay_order_id': 'order_uncaptured_3',
            'razorpay_payment_id': 'pay_failed_3',
        }, format='json')
        self.assertEqual(failed.status_code, 200)
        self.assertEqual(Payment.objects.get(gateway_order_id='order_uncaptured_3').status, Payment.FAILED)

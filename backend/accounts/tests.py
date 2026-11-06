from django.contrib.auth import get_user_model
from django.test import Client
from django.test import TestCase
from rest_framework.test import APIClient


class AccountApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_registration_cannot_self_assign_instructor_role(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'registerstudent',
            'email': 'student@example.test',
            'password': 'LongPassword!847',
            'role': 'instructor',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        user = get_user_model().objects.get(username='registerstudent')
        self.assertEqual(user.role, 'student')

    def test_registration_enforces_django_password_validation(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'weakpassword',
            'email': 'weak@example.test',
            'password': 'password',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(get_user_model().objects.filter(username='weakpassword').exists())

    def test_profile_update_cannot_change_role_and_password_change_checks_current_password(self):
        user = get_user_model().objects.create_user(
            username='profiletest',
            password='OriginalPassword!817',
            role='student',
        )
        self.client.force_authenticate(user=user)

        profile_response = self.client.patch('/api/auth/profile/', {
            'email': 'updated@example.test',
            'role': 'instructor',
        }, format='json')
        self.assertEqual(profile_response.status_code, 200)
        user.refresh_from_db()
        self.assertEqual(user.role, 'student')
        self.assertEqual(user.email, 'updated@example.test')

        failed_change = self.client.post('/api/auth/change-password/', {
            'current_password': 'wrong-password',
            'new_password': 'NewLongPassword!388',
        }, format='json')
        self.assertEqual(failed_change.status_code, 400)

        changed = self.client.post('/api/auth/change-password/', {
            'current_password': 'OriginalPassword!817',
            'new_password': 'NewLongPassword!388',
        }, format='json')
        self.assertEqual(changed.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('NewLongPassword!388'))

    def test_admin_can_create_an_instructor_with_a_hashed_password(self):
        admin_user = get_user_model().objects.create_superuser(
            username='adminflow',
            email='adminflow@example.test',
            password='AdminPassword!438',
        )
        client = Client()
        client.force_login(admin_user)

        add_url = '/admin/accounts/user/add/'
        form_response = client.get(add_url)
        self.assertEqual(form_response.status_code, 200)
        self.assertContains(form_response, 'name="role"')
        self.assertContains(form_response, 'name="password1"')
        self.assertContains(form_response, 'name="password2"')

        response = client.post(add_url, {
            'username': 'admincreatedinstructor',
            'email': 'instructor@example.test',
            'role': 'instructor',
            'phone_number': '',
            'password1': 'InstructorPassword!438',
            'password2': 'InstructorPassword!438',
            '_save': 'Save',
        })
        self.assertEqual(response.status_code, 302)

        instructor = get_user_model().objects.get(username='admincreatedinstructor')
        self.assertEqual(instructor.role, 'instructor')
        self.assertTrue(instructor.check_password('InstructorPassword!438'))
        self.assertFalse(instructor.is_staff)

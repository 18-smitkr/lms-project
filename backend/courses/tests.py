from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Course, Enrollment, Lesson, Module


class CourseApiIntegrationTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.student = user_model.objects.create_user(
            username='lmsstudent',
            password='StudentPassword!438',
            role='student',
        )
        self.instructor = user_model.objects.create_user(
            username='lmsinstructor',
            password='InstructorPassword!438',
            role='instructor',
        )
        self.other_instructor = user_model.objects.create_user(
            username='otherinstructor',
            password='InstructorPassword!438',
            role='instructor',
        )
        self.course = Course.objects.create(
            title='Integration course',
            description='Course used by isolated API tests.',
            price='0.00',
            instructor=self.instructor,
        )
        self.module = Module.objects.create(course=self.course, title='Module One')
        self.lesson = Lesson.objects.create(
            module=self.module,
            title='Lesson One',
            video_url='https://example.test/lesson.mp4',
            duration=12,
        )
        self.client = APIClient()

    def test_jwt_login_student_catalog_and_unenrolled_content_restrictions(self):
        login = self.client.post('/api/auth/login/', {
            'username': 'lmsstudent',
            'password': 'StudentPassword!438',
        }, format='json')
        self.assertEqual(login.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        catalog = self.client.get('/api/courses/')
        self.assertEqual(catalog.status_code, 200)
        catalog_course = next(item for item in catalog.data if item['id'] == self.course.id)
        self.assertIsNone(catalog_course['modules'][0]['lessons'][0]['video_url'])

        self.assertEqual(self.client.get(f'/api/lesson-detail/{self.lesson.id}/').status_code, 403)
        self.assertEqual(self.client.get(f'/api/module-lessons/{self.module.id}/').status_code, 403)
        self.assertEqual(self.client.post(f'/api/progress/complete-lesson/{self.lesson.id}/').status_code, 403)
        self.assertEqual(self.client.get(f'/api/progress/course-progress/{self.course.id}/').status_code, 403)

    def test_free_enrollment_unlocks_content_and_progress_persists(self):
        self.client.force_authenticate(user=self.student)
        enrollment = self.client.post(f'/api/enroll/{self.course.id}/')
        self.assertEqual(enrollment.status_code, 200)
        self.assertTrue(Enrollment.objects.filter(student=self.student, course=self.course).exists())

        lesson_response = self.client.get(f'/api/lesson-detail/{self.lesson.id}/')
        self.assertEqual(lesson_response.status_code, 200)
        self.assertEqual(lesson_response.data['video_url'], self.lesson.video_url)

        completion = self.client.post(f'/api/progress/complete-lesson/{self.lesson.id}/')
        self.assertEqual(completion.status_code, 200)
        progress = self.client.get(f'/api/progress/course-progress/{self.course.id}/')
        self.assertEqual(progress.data['completion_percentage'], 100.0)
        self.assertTrue(progress.data['course_completed'])
        self.assertEqual(self.client.get('/api/progress/certificates/').status_code, 200)
        self.assertEqual(len(self.client.get('/api/progress/certificates/').data), 1)

    def test_paid_course_cannot_be_enrolled_without_verified_payment(self):
        paid_course = Course.objects.create(
            title='Paid course',
            description='Requires actual verified payment.',
            price='45.00',
            instructor=self.instructor,
        )
        self.client.force_authenticate(user=self.student)
        response = self.client.post(f'/api/enroll/{paid_course.id}/')
        self.assertEqual(response.status_code, 402)
        self.assertFalse(Enrollment.objects.filter(student=self.student, course=paid_course).exists())

    def test_only_course_owner_can_manage_curriculum_and_course_fields_are_protected(self):
        self.client.force_authenticate(user=self.student)
        self.assertEqual(
            self.client.post(f'/api/create-module/{self.course.id}/', {'title': 'Nope'}).status_code,
            403,
        )

        self.client.force_authenticate(user=self.other_instructor)
        self.assertEqual(
            self.client.put(f'/api/update-course/{self.course.id}/', {'title': 'Changed'}, format='json').status_code,
            403,
        )
        self.assertEqual(
            self.client.post(f'/api/create-lesson/{self.module.id}/', {
                'title': 'Unauthorized',
                'video_url': 'https://example.test/unauthorized.mp4',
                'duration': 1,
            }, format='json').status_code,
            403,
        )

        other_course = Course.objects.create(
            title='Other course',
            description='Second course.',
            instructor=self.other_instructor,
        )
        other_module = Module.objects.create(course=other_course, title='Other module')
        self.client.force_authenticate(user=self.instructor)
        response = self.client.put(f'/api/update-lesson/{self.lesson.id}/', {
            'module': other_module.id,
            'title': 'Updated lesson',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.lesson.refresh_from_db()
        self.assertEqual(self.lesson.module_id, self.module.id)

    def test_instructor_course_crud_and_student_management_scope(self):
        self.client.force_authenticate(user=self.instructor)
        created = self.client.post('/api/create-course/', {
            'title': 'New instructor course',
            'description': 'Created through the actual API.',
            'price': '0',
        }, format='json')
        self.assertEqual(created.status_code, 201)
        new_course = Course.objects.get(title='New instructor course')
        self.assertEqual(new_course.instructor_id, self.instructor.id)

        self.client.force_authenticate(user=self.student)
        self.client.post(f'/api/enroll/{self.course.id}/')
        self.assertEqual(self.client.get(f'/api/course-students/{self.course.id}/').status_code, 403)

        self.client.force_authenticate(user=self.instructor)
        students = self.client.get(f'/api/course-students/{self.course.id}/')
        self.assertEqual(students.status_code, 200)
        self.assertEqual(students.data[0]['username'], self.student.username)

        self.client.delete(f'/api/delete-course/{new_course.id}/')
        self.assertFalse(Course.objects.filter(id=new_course.id).exists())

    def test_instructors_cannot_access_student_only_endpoints(self):
        self.client.force_authenticate(user=self.instructor)
        student_endpoints = [
            '/api/dashboard/student/',
            '/api/dashboard/sidebar/',
            '/api/my-courses/',
            '/api/wishlist/',
            '/api/progress/my-progress/',
            '/api/progress/certificates/',
        ]

        for endpoint in student_endpoints:
            with self.subTest(endpoint=endpoint):
                self.assertEqual(self.client.get(endpoint).status_code, 403)

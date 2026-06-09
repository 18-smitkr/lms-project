from django.db import models
from  django.contrib.auth.models import AbstractUser



# Custom User Model
# Inherits all fields from Django's AbstractUser:
# username, email, password, first_name, last_name, etc.

# AbstractUser
# Provides built-in fields:
# username, email, password,
# first_name, last_name, etc.

# choices
# Restricts values to predefined options

# default='student'
# New users are students by default

# blank=True
# Field is optional in forms/admin

# __str__()
# Controls how objects appear in Django Admin


class User(AbstractUser):

    # Available user roles in LMS
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    # Defines whether user is a student or instructor
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student'
    )

    # Optional contact number
    phone_number = models.CharField(
        max_length=15,
        blank=True
    )

    # String representation in Admin Panel
    def __str__(self):
        return self.username
       
# Why use AbstractUser instead of creating a User model from scratch?

# Answer:

# Reuses Django's authentication system.
# Already provides username, email, password, permissions, groups, etc.
# Allows adding custom fields like role and phone_number.
# Reduces development time and follows Django best practices.      
      
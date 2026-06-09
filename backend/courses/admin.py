from django.contrib import admin
from .models import Course, Enrollment, Module, Lesson

# Register your models here.
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Enrollment)


from django.urls import path
from .views import complete_lesson, my_progress

urlpatterns = [

    path('complete-lesson/<int:lesson_id>/',complete_lesson,name='complete_lesson'),
    path('my-progress/',my_progress,name='my_progress'),

]
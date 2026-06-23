from django.urls import path
from .views import create_review ,course_reviews,course_rating_summary, delete_review, rating_analytics, update_review


urlpatterns = [
    path('create-review/<int:course_id>/',create_review,name='create_review'),
    path('course-reviews/<int:course_id>/',course_reviews,name='course_reviews'),
    path('rating-summary/<int:course_id>/',course_rating_summary,name='course_rating_summary'),
    path('update-review/<int:review_id>/',update_review,name='update_review'),
    path('delete-review/<int:review_id>/',delete_review,name='delete_review'),
    path('rating-analytics/<int:course_id>/',rating_analytics,name='rating_analytics'),
    
]
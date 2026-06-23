from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Review
from .serializers import ReviewSerializer

from courses.models import Course
from courses.models import Enrollment
from django.db.models import Avg

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(
    request,
    course_id
):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    # Security Check
    # Only enrolled students can review

    enrolled = Enrollment.objects.filter(
        student=request.user,
        course=course
    ).exists()

    if not enrolled:
        return Response(
            {
                "error":
                "Enroll before reviewing"
            },
            status=403
        )

    serializer = ReviewSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save(
            student=request.user,
            course=course
        )

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )
    
    
# Get Course Reviews API
# Purpose:
# - Shows all reviews for a course

@api_view(['GET'])
def course_reviews(request, course_id):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    reviews = Review.objects.filter(
        course=course
    ).order_by(
        '-created_at'
    )

    serializer = ReviewSerializer(
        reviews,
        many=True
    )

    return Response(serializer.data)   
  
  
  
# Course Rating Summary API
# Purpose:
# - Returns average rating
# - Returns total reviews

@api_view(['GET'])
def course_rating_summary(request, course_id):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    reviews = Review.objects.filter(
        course=course
    )

    total_reviews = reviews.count()

    average_rating = reviews.aggregate(
        Avg('rating')
    )['rating__avg']

    if average_rating is None:
        average_rating = 0

    return Response({
        "course": course.title,
        "average_rating": round(
            average_rating,
            2
        ),
        "total_reviews": total_reviews
    }) 
    
    
# Update Review API
# Purpose:
# - Student can update his own review

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):

    review = get_object_or_404(
        Review,
        id=review_id
    )

    if review.student != request.user:
        return Response(
            {
                "error":
                "You can update only your review"
            },
            status=403
        )

    serializer = ReviewSerializer(
        review,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data
        )

    return Response(
        serializer.errors,
        status=400
    )      


# Delete Review API
# Purpose:
# - Student can delete his own review

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):

    review = get_object_or_404(
        Review,
        id=review_id
    )

    if review.student != request.user:
        return Response(
            {
                "error":
                "You can delete only your review"
            },
            status=403
        )

    review.delete()

    return Response({
        "message":
        "Review deleted successfully"
    })
    
# Rating Analytics API
# Purpose:
# - Returns count of ratings by star

@api_view(['GET'])
def rating_analytics(
    request,
    course_id
):

    course = get_object_or_404(
        Course,
        id=course_id
    )

    reviews = Review.objects.filter(
        course=course
    )

    return Response({

        "5_star": reviews.filter(
            rating=5
        ).count(),

        "4_star": reviews.filter(
            rating=4
        ).count(),

        "3_star": reviews.filter(
            rating=3
        ).count(),

        "2_star": reviews.filter(
            rating=2
        ).count(),

        "1_star": reviews.filter(
            rating=1
        ).count()
    })    
    
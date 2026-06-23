"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from courses import urls as courses_urls
from accounts import urls as accounts_urls
from payments import urls as payments_urls
from progress import urls as progress_urls 
# JWT Authentication Views--> for token generation and refresh
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # LMS API Routes
    # Including courses app URLs under the /api/ path, which will route requests to the views defined in the courses app's urls.py file, allowing for modular organization of API endpoints related to course management and interactions
    path('api/', include('courses.urls')),
    # payments app URLs are included under the /api/payments/ path, which will route requests to the views defined in the payments app's urls.py file, allowing for modular organization of API endpoints related to payment processing and management
    path('api/payments/', include('payments.urls')),
    
    path('api/auth/', include('accounts.urls')),
    # JWT Authentication Endpoints
    path(
        'api/auth/login/',
        # Using JWT's built-in view for obtaining token pairs (access and refresh)
        TokenObtainPairView.as_view(),
        # Naming the URL for reverse lookups in tests and frontend integration
        name='token_obtain_pair'
    ),
    # Endpoint for refreshing JWT tokens, allowing clients to obtain a new access token using a valid refresh token
    path(
        'api/auth/refresh/',
        # Using JWT's built-in view for refreshing tokens, which checks the validity of the provided refresh token and issues a new access token if valid
        TokenRefreshView.as_view(),
        # Naming the URL for reverse lookups, making it easier to reference this endpoint in tests and frontend code when implementing token refresh logic
        name='token_refresh'
    ),
    # Including progress app URLs under the /api/progress/ path, which will route requests to the views defined in the progress app's urls.py file, allowing for modular organization of API endpoints related to user progress tracking
    path('api/progress/', include('progress.urls')),
    # Including dashboard app URLs under the /api/dashboard/ path, which will route requests to the views defined in the dashboard app's urls.py file, allowing for modular organization of API endpoints related to user dashboards and analytics
    path('api/dashboard/',include('dashboard.urls')),
    
    # Including reviews app URLs under the /api/reviews/ path, which will route requests to the views defined in the reviews app's urls.py file, allowing for modular organization of API endpoints related to course reviews and feedback
    path('api/reviews/',include('reviews.urls')),
]

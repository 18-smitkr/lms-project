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
# JWT Authentication Views--> for token generation and refresh
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # LMS API Routes
    path('api/', include('courses.urls')),
    path('api/', include('payments.urls')),
    
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
]

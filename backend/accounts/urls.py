from django.urls import path
from .views import change_password, register, profile

urlpatterns = [

    path("register/", register),

    path("profile/", profile),
    path("change-password/", change_password),

]
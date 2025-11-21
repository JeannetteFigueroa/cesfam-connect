from django.urls import path
from .views import UserMeView, RegisterView

urlpatterns = [
    path('me/', UserMeView.as_view(), name='user_me'),
    path('register/', RegisterView.as_view(), name='register'),
]

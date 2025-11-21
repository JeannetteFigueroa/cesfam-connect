from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, CESFAMViewSet

router = DefaultRouter()
router.register(r'', PacienteViewSet)
router.register(r'cesfams', CESFAMViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

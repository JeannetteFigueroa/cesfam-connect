from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicoViewSet, DisponibilidadMedicoViewSet

router = DefaultRouter()
router.register(r'', MedicoViewSet)
router.register(r'disponibilidad', DisponibilidadMedicoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

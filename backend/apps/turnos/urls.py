from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TurnoViewSet, SolicitudCambioTurnoViewSet

router = DefaultRouter()
router.register(r'', TurnoViewSet)
router.register(r'solicitudes', SolicitudCambioTurnoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

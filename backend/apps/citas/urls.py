from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, HistorialClinicoViewSet

router = DefaultRouter()
router.register(r'', CitaViewSet)
router.register(r'historial', HistorialClinicoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

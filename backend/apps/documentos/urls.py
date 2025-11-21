from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecetaViewSet, DiagnosticoViewSet, LicenciaMedicaViewSet, ReporteViewSet

router = DefaultRouter()
router.register(r'recetas', RecetaViewSet)
router.register(r'diagnosticos', DiagnosticoViewSet)
router.register(r'licencias', LicenciaMedicaViewSet)
router.register(r'reportes', ReporteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

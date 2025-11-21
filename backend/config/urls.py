from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
# Importar la vista personalizada (si existe) que acepta 'correo' en el login
from apps.usuarios.serializers import TokenObtainPairCorreoView
from apps.pacientes.views import CESFAMViewSet
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    # Si TokenObtainPairCorreoView está disponible, usarla para aceptar payloads con 'correo'
    path('api/auth/login/', (TokenObtainPairCorreoView.as_view() if TokenObtainPairCorreoView is not None else None), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/pacientes/', include('apps.pacientes.urls')),
    # Rutas cortas para compatibilidad con frontend: listar CESFAMs en /api/cesfams/
    re_path(r'^api/cesfams/$', CESFAMViewSet.as_view({'get': 'list'}), name='cesfam-list'),
    re_path(r'^api/cesfams/(?P<pk>\d+)/$', CESFAMViewSet.as_view({'get': 'retrieve'}), name='cesfam-detail'),
    path('api/medicos/', include('apps.medicos.urls')),
    path('api/administradores/', include('apps.administradores.urls')),
    path('api/citas/', include('apps.citas.urls')),
    path('api/documentos/', include('apps.documentos.urls')),
    path('api/turnos/', include('apps.turnos.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

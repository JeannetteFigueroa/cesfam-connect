from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/pacientes/', include('apps.pacientes.urls')),
    path('api/medicos/', include('apps.medicos.urls')),
    path('api/administradores/', include('apps.administradores.urls')),
    path('api/citas/', include('apps.citas.urls')),
    path('api/documentos/', include('apps.documentos.urls')),
    path('api/turnos/', include('apps.turnos.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

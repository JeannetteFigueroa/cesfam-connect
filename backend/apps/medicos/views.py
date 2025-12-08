from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Medico, DisponibilidadMedico
from .serializers import MedicoSerializer, DisponibilidadMedicoSerializer
from apps.usuarios.models import Usuario
from django.utils.crypto import get_random_string
from rest_framework import status
from apps.pacientes.models import CESFAM
from rest_framework.permissions import AllowAny
from django.conf import settings
from rest_framework.permissions import IsAdminUser
class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.select_related('usuario', 'cesfam')
    serializer_class = MedicoSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Medico.objects.select_related("usuario", "cesfam").all()
        cesfam_id = self.request.query_params.get("cesfam")
        if cesfam_id:
            queryset = queryset.filter(cesfam_id=cesfam_id)
        return queryset

    @action(detail=False, methods=['get'])
    def mi_perfil(self, request):
        try:
            medico = Medico.objects.get(usuario=request.user)
            serializer = self.get_serializer(medico)
            return Response(serializer.data)
        except Medico.DoesNotExist:
            return Response({'error': 'No eres médico'}, status=404)

    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def crear_con_usuario(self, request):
        # En un entorno de producción, esta acción debería estar protegida.
        # Por ahora, permitimos el acceso si DEBUG=True, similar al endpoint `_public_dev` anterior.
        # Si el usuario está autenticado como admin, también se le permite.
        is_admin = getattr(request.user, 'is_staff', False) or getattr(request.user, 'role', None) == 'admin'
        if not getattr(settings, 'DEBUG', False) and not is_admin:
            return Response(
                {'detail': 'No autorizado. Se requiere ser administrador o estar en modo DEBUG.'},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data or {}

        # Toma de campos del frontend
        correo = data.get('email') or data.get('correo')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        documento = data.get('documento')
        celular = data.get('celular')
        fecha_nacimiento = data.get('fecha_nacimiento') or "2000-01-01"
        especialidad = data.get('especialidad') or "medicina_general"
        rut_profesional = data.get('rut_profesional') or documento
        cesfam_id = data.get('cesfam_id') or data.get('cesfam')

        # Validación: campos mínimos
        if not correo or not nombre or not apellido or not documento:
            return Response({'detail': 'Faltan datos requeridos'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Validación existencia
        if Usuario.objects.filter(correo=correo).exists():
            return Response({'detail': 'Ya existe un usuario con ese correo'},
                            status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(documento=documento).exists():
            return Response({'detail': 'Ya existe un usuario con ese documento'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Contraseña temporal
        temp_password = get_random_string(10)

        # Crear usuario
        usuario = Usuario.objects.create_user(
            correo=correo,
            password=temp_password,
            nombre=nombre,
            apellido=apellido,
            documento=documento,
            celular=celular or '',
            fecha_nacimiento=fecha_nacimiento,
            role='medico'
        )

        # Obtener CESFAM si viene
        cesfam = None
        if cesfam_id:
            try:
                cesfam = CESFAM.objects.get(id=cesfam_id)
            except CESFAM.DoesNotExist:
                cesfam = None

        # Crear médico
        medico = Medico.objects.create(
            usuario=usuario,
            cesfam=cesfam,
            especialidad=especialidad,
            rut_profesional=rut_profesional
        )

        serializer = self.get_serializer(medico)

        return Response({
            'medico': serializer.data,
            'password_temporal': temp_password
        }, status=status.HTTP_201_CREATED)

class DisponibilidadMedicoViewSet(viewsets.ModelViewSet):
    queryset = DisponibilidadMedico.objects.all()
    serializer_class = DisponibilidadMedicoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        return self.queryset

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

class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.select_related('usuario', 'cesfam').all()
    serializer_class = MedicoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def mi_perfil(self, request):
        try:
            medico = Medico.objects.get(usuario=request.user)
            serializer = self.get_serializer(medico)
            return Response(serializer.data)
        except Medico.DoesNotExist:
            return Response({'error': 'No eres médico'}, status=404)

    @action(detail=False, methods=['post'], url_path='crear_con_usuario')
    def crear_con_usuario(self, request):
        # Solo personal admin/staff puede crear médicos
        user_role = getattr(request.user, 'role', None)
        if not (getattr(request.user, 'is_staff', False) or user_role == 'admin'):
            return Response({'detail': 'No autorizado. Se requiere usuario admin o staff.'},
                            status=status.HTTP_403_FORBIDDEN)

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


    # ----------------------------
    #  🔧 ENDPOINT SOLO PARA TEST DEV
    # ----------------------------
    @action(detail=False, methods=['post'], url_path='crear_con_usuario_public_dev',
            permission_classes=[AllowAny])
    def crear_con_usuario_public_dev(self, request):

        if not getattr(settings, 'DEBUG', False):
            return Response({'detail': 'Solo disponible en DEBUG'},
                            status=status.HTTP_403_FORBIDDEN)

        data = request.data or {}

        # Normalización de campos (igual que el endpoint principal)
        correo = data.get('email') or data.get('correo')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        documento = data.get('documento')
        celular = data.get('celular')
        fecha_nacimiento = data.get('fecha_nacimiento') or "2000-01-01"
        especialidad = data.get('especialidad') or "medicina_general"
        rut_profesional = data.get('rut_profesional') or documento
        cesfam_id = data.get('cesfam_id') or data.get('cesfam')

        if not correo or not nombre or not apellido or not documento:
            return Response({'detail': 'Faltan datos requeridos'},
                            status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(correo=correo).exists():
            return Response({'detail': 'Ya existe un usuario con ese correo'},
                            status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(documento=documento).exists():
            return Response({'detail': 'Ya existe un usuario con ese documento'},
                            status=status.HTTP_400_BAD_REQUEST)

        temp_password = get_random_string(10)

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

        cesfam = None
        if cesfam_id:
            try:
                cesfam = CESFAM.objects.get(id=cesfam_id)
            except CESFAM.DoesNotExist:
                cesfam = None

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

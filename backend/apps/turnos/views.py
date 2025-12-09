from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Turno, SolicitudCambioTurno
from .serializers import TurnoSerializer, SolicitudCambioTurnoSerializer

class TurnoViewSet(viewsets.ModelViewSet):
    queryset = Turno.objects.select_related('medico__usuario').all()
    serializer_class = TurnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        
        if self.request.user.role == 'medico':
            queryset = queryset.filter(medico__usuario=self.request.user)
        elif self.request.user.role == 'admin':
            # Administradores ven todos los turnos
            pass
        
        # Filtros
        fecha_inicio = self.request.query_params.get('fecha_inicio')
        fecha_fin = self.request.query_params.get('fecha_fin')
        
        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)
        
        return queryset

    def perform_create(self, serializer):
        """
        Solo administradores pueden crear turnos.
        Médicos no pueden crear sus propios turnos (solo verlos).
        """
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Solo los administradores pueden crear turnos")
        serializer.save()

    def perform_update(self, serializer):
        """
        Solo administradores pueden actualizar turnos.
        """
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Solo los administradores pueden actualizar turnos")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Solo administradores pueden eliminar turnos.
        """
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Solo los administradores pueden eliminar turnos")
        instance.delete()

    @action(detail=False, methods=['get'])
    def mis_turnos(self, request):
        if request.user.role != 'medico':
            return Response({'error': 'Solo médicos pueden ver sus turnos'}, status=403)
        
        hoy = timezone.now().date()
        turnos = self.queryset.filter(
            medico__usuario=request.user,
            fecha__gte=hoy
        ).order_by('fecha', 'hora_inicio')
        
        serializer = self.get_serializer(turnos, many=True)
        return Response(serializer.data)

class SolicitudCambioTurnoViewSet(viewsets.ModelViewSet):
    queryset = SolicitudCambioTurno.objects.select_related(
        'turno_original__medico__usuario',
        'medico_solicitante__usuario'
    ).all()
    serializer_class = SolicitudCambioTurnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'medico':
            return self.queryset.filter(medico_solicitante__usuario=self.request.user)
        elif self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.none()

    @action(detail=True, methods=['post'])
    def aprobar(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Solo administradores pueden aprobar solicitudes'}, status=403)
        
        solicitud = self.get_object()
        solicitud.status = 'aprobada'
        solicitud.respuesta = request.data.get('respuesta', '')
        solicitud.save()
        
        # Actualizar el turno original
        solicitud.turno_original.fecha = solicitud.fecha_nueva
        solicitud.turno_original.hora_inicio = solicitud.hora_inicio_nueva
        solicitud.turno_original.hora_fin = solicitud.hora_fin_nueva
        solicitud.turno_original.save()
        
        return Response({'message': 'Solicitud aprobada'})

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Solo administradores pueden rechazar solicitudes'}, status=403)
        
        solicitud = self.get_object()
        solicitud.status = 'rechazada'
        solicitud.respuesta = request.data.get('respuesta', '')
        solicitud.save()
        
        return Response({'message': 'Solicitud rechazada'})

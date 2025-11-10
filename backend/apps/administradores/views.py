from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Administrador
from .serializers import AdministradorSerializer
from apps.citas.models import Cita
from apps.medicos.models import Medico

class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.select_related('usuario', 'cesfam').all()
    serializer_class = AdministradorSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Solo administradores pueden ver estadísticas'}, status=403)
        
        hoy = timezone.now().date()
        inicio_mes = hoy.replace(day=1)
        
        # Estadísticas de citas
        citas_mes = Cita.objects.filter(fecha__gte=inicio_mes).count()
        citas_completadas = Cita.objects.filter(
            fecha__gte=inicio_mes,
            status='completada'
        ).count()
        
        # Citas por especialidad
        citas_por_especialidad = Cita.objects.filter(
            fecha__gte=inicio_mes
        ).values(
            'medico__especialidad'
        ).annotate(
            total=Count('id')
        )
        
        # Médicos activos
        medicos_activos = Medico.objects.filter(
            citas__fecha__gte=inicio_mes
        ).distinct().count()
        
        return Response({
            'citas_mes': citas_mes,
            'citas_completadas': citas_completadas,
            'citas_por_especialidad': list(citas_por_especialidad),
            'medicos_activos': medicos_activos
        })

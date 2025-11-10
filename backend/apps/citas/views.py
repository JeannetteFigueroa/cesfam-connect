from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cita, HistorialClinico
from .serializers import CitaSerializer, HistorialClinicoSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related('paciente__usuario', 'medico__usuario').all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        
        if self.request.user.role == 'paciente':
            queryset = queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            queryset = queryset.filter(medico__usuario=self.request.user)
        
        return queryset

    @action(detail=False, methods=['get'])
    def mis_citas(self, request):
        if request.user.role == 'paciente':
            citas = self.queryset.filter(paciente__usuario=request.user).order_by('fecha', 'hora')
        elif request.user.role == 'medico':
            citas = self.queryset.filter(medico__usuario=request.user).order_by('fecha', 'hora')
        else:
            citas = self.queryset.none()
        
        serializer = self.get_serializer(citas, many=True)
        return Response(serializer.data)

class HistorialClinicoViewSet(viewsets.ModelViewSet):
    queryset = HistorialClinico.objects.select_related(
        'paciente__usuario',
        'medico__usuario',
        'cita'
    ).all()
    serializer_class = HistorialClinicoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'paciente':
            return self.queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        elif self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.none()

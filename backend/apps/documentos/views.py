from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Receta, Diagnostico, LicenciaMedica, Reporte
from .serializers import (
    RecetaSerializer, DiagnosticoSerializer,
    LicenciaMedicaSerializer, ReporteSerializer
)

class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.select_related('paciente__usuario', 'medico__usuario').all()
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'paciente':
            return self.queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        return self.queryset

class DiagnosticoViewSet(viewsets.ModelViewSet):
    queryset = Diagnostico.objects.select_related('paciente__usuario', 'medico__usuario').all()
    serializer_class = DiagnosticoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'paciente':
            return self.queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        return self.queryset

class LicenciaMedicaViewSet(viewsets.ModelViewSet):
    queryset = LicenciaMedica.objects.select_related('paciente__usuario', 'medico__usuario').all()
    serializer_class = LicenciaMedicaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'paciente':
            return self.queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        return self.queryset

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.select_related('medico__usuario').all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        elif self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.none()

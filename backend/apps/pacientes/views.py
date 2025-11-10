from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Paciente, CESFAM
from .serializers import PacienteSerializer, PacienteCreateSerializer, CESFAMSerializer

class CESFAMViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CESFAM.objects.all()
    serializer_class = CESFAMSerializer
    permission_classes = [AllowAny]

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.select_related('usuario', 'cesfam').all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PacienteCreateSerializer
        return PacienteSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return self.queryset
        elif self.request.user.role == 'paciente':
            return self.queryset.filter(usuario=self.request.user)
        return self.queryset.none()

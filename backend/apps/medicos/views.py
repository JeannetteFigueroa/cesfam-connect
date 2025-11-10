from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Medico, DisponibilidadMedico
from .serializers import MedicoSerializer, DisponibilidadMedicoSerializer

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

class DisponibilidadMedicoViewSet(viewsets.ModelViewSet):
    queryset = DisponibilidadMedico.objects.all()
    serializer_class = DisponibilidadMedicoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        return self.queryset

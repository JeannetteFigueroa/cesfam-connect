from rest_framework import serializers
from .models import Cita, HistorialClinico
from apps.pacientes.serializers import PacienteSerializer
from apps.medicos.serializers import MedicoSerializer

class CitaSerializer(serializers.ModelSerializer):
    paciente_info = PacienteSerializer(source='paciente', read_only=True)
    medico_info = MedicoSerializer(source='medico', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Cita
        fields = '__all__'

class HistorialClinicoSerializer(serializers.ModelSerializer):
    paciente_info = PacienteSerializer(source='paciente', read_only=True)
    medico_info = MedicoSerializer(source='medico', read_only=True)
    cita_info = CitaSerializer(source='cita', read_only=True)
    
    class Meta:
        model = HistorialClinico
        fields = '__all__'

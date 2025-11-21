from rest_framework import serializers
from .models import Turno, SolicitudCambioTurno
from apps.medicos.serializers import MedicoSerializer

class TurnoSerializer(serializers.ModelSerializer):
    medico_info = MedicoSerializer(source='medico', read_only=True)
    tipo_turno_display = serializers.CharField(source='get_tipo_turno_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Turno
        fields = '__all__'

class SolicitudCambioTurnoSerializer(serializers.ModelSerializer):
    medico_solicitante_info = MedicoSerializer(source='medico_solicitante', read_only=True)
    turno_original_info = TurnoSerializer(source='turno_original', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = SolicitudCambioTurno
        fields = '__all__'

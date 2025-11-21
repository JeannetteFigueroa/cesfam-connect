from rest_framework import serializers
from .models import Medico, DisponibilidadMedico
from apps.usuarios.serializers import UsuarioSerializer

class MedicoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Medico
        fields = '__all__'

class DisponibilidadMedicoSerializer(serializers.ModelSerializer):
    dia_semana_display = serializers.CharField(source='get_dia_semana_display', read_only=True)
    
    class Meta:
        model = DisponibilidadMedico
        fields = '__all__'

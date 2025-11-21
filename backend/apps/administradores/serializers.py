from rest_framework import serializers
from .models import Administrador
from apps.usuarios.serializers import UsuarioSerializer

class AdministradorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Administrador
        fields = '__all__'

from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'correo', 'nombre', 'apellido', 'nombre_completo',
            'tipo_documento', 'documento', 'celular', 'fecha_nacimiento',
            'role', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = Usuario
        fields = [
            'correo', 'password', 'nombre', 'apellido',
            'tipo_documento', 'documento', 'celular', 'fecha_nacimiento', 'role'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        usuario = Usuario.objects.create_user(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario

class UsuarioUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombre', 'apellido', 'celular']

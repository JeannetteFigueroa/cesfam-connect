from rest_framework import serializers
from .models import Paciente, CESFAM
from apps.usuarios.serializers import UsuarioSerializer

class CESFAMSerializer(serializers.ModelSerializer):
    class Meta:
        model = CESFAM
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    cesfam = CESFAMSerializer(read_only=True)
    
    class Meta:
        model = Paciente
        fields = '__all__'

class PacienteCreateSerializer(serializers.ModelSerializer):
    correo = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    nombre = serializers.CharField(write_only=True)
    apellido = serializers.CharField(write_only=True)
    tipo_documento = serializers.CharField(write_only=True)
    documento = serializers.CharField(write_only=True)
    celular = serializers.CharField(write_only=True)
    fecha_nacimiento = serializers.DateField(write_only=True)
    
    class Meta:
        model = Paciente
        fields = [
            'correo', 'password', 'nombre', 'apellido', 'tipo_documento',
            'documento', 'celular', 'fecha_nacimiento', 'cesfam', 'comuna',
            'direccion', 'grupo_sanguineo', 'alergias', 'enfermedades_cronicas'
        ]

    def create(self, validated_data):
        usuario_data = {
            'correo': validated_data.pop('correo'),
            'nombre': validated_data.pop('nombre'),
            'apellido': validated_data.pop('apellido'),
            'tipo_documento': validated_data.pop('tipo_documento'),
            'documento': validated_data.pop('documento'),
            'celular': validated_data.pop('celular'),
            'fecha_nacimiento': validated_data.pop('fecha_nacimiento'),
            'role': 'paciente'
        }
        password = validated_data.pop('password')
        
        usuario = Usuario.objects.create_user(**usuario_data)
        usuario.set_password(password)
        usuario.save()
        
        paciente = Paciente.objects.create(usuario=usuario, **validated_data)
        return paciente

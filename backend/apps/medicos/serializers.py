from rest_framework import serializers
from .models import Medico, DisponibilidadMedico
from apps.usuarios.serializers import UsuarioSerializer
from apps.pacientes.serializers import CESFAMSerializer   # ⬅️ IMPORTANTE

class MedicoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    cesfam = CESFAMSerializer(read_only=True)  # ⬅️ Ahora sí funciona

    cesfam_id = serializers.PrimaryKeyRelatedField(
        queryset=Medico._meta.get_field('cesfam').remote_field.model.objects.all(),
        source='cesfam',
        write_only=True
    )

    class Meta:
        model = Medico
        fields = '__all__'
class DisponibilidadMedicoSerializer(serializers.ModelSerializer):
    dia_semana_display = serializers.CharField(source='get_dia_semana_display', read_only=True)
    
    class Meta:
        model = DisponibilidadMedico
        fields = '__all__'
        extra_kwargs = {
            'medico': {'required': False, 'allow_null': True}  # No requerido en el request, se asigna en perform_create
        }


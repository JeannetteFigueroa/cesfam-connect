from django.db import models
from apps.usuarios.models import Usuario
from apps.pacientes.models import CESFAM

class Medico(models.Model):
    ESPECIALIDAD_CHOICES = [
        ('medicina_general', 'Medicina General'),
        ('pediatria', 'Pediatría'),
        ('ginecologia', 'Ginecología'),
        ('cardiologia', 'Cardiología'),
        ('dermatologia', 'Dermatología'),
        ('traumatologia', 'Traumatología'),
        ('oftalmologia', 'Oftalmología'),
        ('otorrinolaringologia', 'Otorrinolaringología'),
        ('psiquiatria', 'Psiquiatría'),
        ('nutricion', 'Nutrición'),
    ]

    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='medico')
    cesfam = models.ForeignKey(CESFAM, on_delete=models.SET_NULL, null=True, related_name='medicos')
    especialidad = models.CharField(max_length=50, choices=ESPECIALIDAD_CHOICES)
    rut_profesional = models.CharField(max_length=50, unique=True, verbose_name='RUT Profesional')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Médico'
        verbose_name_plural = 'Médicos'

    def __str__(self):
        return f"Dr(a). {self.usuario.nombre_completo}"

    def save(self, *args, **kwargs):
        # Si no se proporcionó rut_profesional en el admin/form, tomarlo desde el usuario relacionado
        try:
            if (not self.rut_profesional or self.rut_profesional.strip() == '') and self.usuario:
                self.rut_profesional = self.usuario.documento
        except Exception:
            pass
        return super().save(*args, **kwargs)

class DisponibilidadMedico(models.Model):
    DIAS_SEMANA = [
        (1, 'Lunes'),
        (2, 'Martes'),
        (3, 'Miércoles'),
        (4, 'Jueves'),
        (5, 'Viernes'),
        (6, 'Sábado'),
        (7, 'Domingo'),
    ]

    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='disponibilidades')
    dia_semana = models.IntegerField(choices=DIAS_SEMANA)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Disponibilidad Médico'
        verbose_name_plural = 'Disponibilidades Médicos'
        unique_together = ['medico', 'dia_semana', 'hora_inicio']

    def __str__(self):
        return f"{self.medico} - {self.get_dia_semana_display()} {self.hora_inicio}-{self.hora_fin}"

from django.db import models
from apps.pacientes.models import Paciente
from apps.medicos.models import Medico
from apps.citas.models import Cita

class Receta(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='recetas')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='recetas')
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE, null=True, blank=True)
    medicamento = models.CharField(max_length=200)
    dosis = models.CharField(max_length=100)
    frecuencia = models.CharField(max_length=100)
    duracion = models.CharField(max_length=100)
    indicaciones = models.TextField()
    archivo = models.FileField(upload_to='recetas/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Receta'
        verbose_name_plural = 'Recetas'
        ordering = ['-created_at']

    def __str__(self):
        return f"Receta {self.id} - {self.paciente.usuario.nombre_completo}"

class Diagnostico(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='diagnosticos')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='diagnosticos')
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE, null=True, blank=True)
    diagnostico = models.TextField()
    codigo_cie10 = models.CharField(max_length=10)
    observaciones = models.TextField(blank=True, null=True)
    archivo = models.FileField(upload_to='diagnosticos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Diagnóstico'
        verbose_name_plural = 'Diagnósticos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Diagnóstico {self.id} - {self.paciente.usuario.nombre_completo}"

class LicenciaMedica(models.Model):
    TIPO_CHOICES = [
        ('enfermedad', 'Enfermedad'),
        ('maternidad', 'Maternidad'),
        ('accidente', 'Accidente Laboral'),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='licencias')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='licencias')
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE, null=True, blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    dias_reposo = models.IntegerField()
    diagnostico = models.TextField()
    archivo = models.FileField(upload_to='licencias/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Licencia Médica'
        verbose_name_plural = 'Licencias Médicas'
        ordering = ['-created_at']

    def __str__(self):
        return f"Licencia {self.id} - {self.paciente.usuario.nombre_completo}"

class Reporte(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='reportes')
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    archivo = models.FileField(upload_to='reportes/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Reporte'
        verbose_name_plural = 'Reportes'
        ordering = ['-created_at']

    def __str__(self):
        return f"Reporte {self.id} - {self.titulo}"

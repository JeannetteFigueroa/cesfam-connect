from django.db import models
from apps.pacientes.models import Paciente
from apps.medicos.models import Medico

class Cita(models.Model):
    STATUS_CHOICES = [
        ('agendada', 'Agendada'),
        ('confirmada', 'Confirmada'),
        ('en_curso', 'En Curso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
        ('no_asistio', 'No Asistió'),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='citas')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='citas')
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='agendada')
    observaciones = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['fecha', 'hora']
        unique_together = ['medico', 'fecha', 'hora']

    def __str__(self):
        return f"Cita {self.id} - {self.paciente.usuario.nombre_completo} - {self.fecha}"

class HistorialClinico(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='historial')
    cita = models.OneToOneField(Cita, on_delete=models.CASCADE, related_name='historial')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    diagnostico = models.TextField()
    codigo_cie10 = models.CharField(max_length=10, blank=True, null=True)
    tratamiento = models.TextField()
    observaciones = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Historial Clínico'
        verbose_name_plural = 'Historiales Clínicos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Historial {self.id} - {self.paciente.usuario.nombre_completo}"

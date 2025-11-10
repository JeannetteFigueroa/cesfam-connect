from django.db import models
from apps.medicos.models import Medico

class Turno(models.Model):
    TIPO_TURNO_CHOICES = [
        ('diurno', 'Diurno'),
        ('vespertino', 'Vespertino'),
        ('nocturno', 'Nocturno'),
    ]

    STATUS_CHOICES = [
        ('programado', 'Programado'),
        ('en_curso', 'En Curso'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]

    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='turnos')
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    tipo_turno = models.CharField(max_length=20, choices=TIPO_TURNO_CHOICES)
    cargo = models.CharField(max_length=100, verbose_name='Cargo/Actividad')
    area = models.CharField(max_length=100, verbose_name='Área')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='programado')
    observaciones = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Turno'
        verbose_name_plural = 'Turnos'
        ordering = ['fecha', 'hora_inicio']

    def __str__(self):
        return f"{self.medico} - {self.fecha} {self.tipo_turno}"

class SolicitudCambioTurno(models.Model):
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
    ]

    turno_original = models.ForeignKey(Turno, on_delete=models.CASCADE, related_name='solicitudes_cambio')
    medico_solicitante = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='solicitudes_enviadas')
    fecha_nueva = models.DateField()
    hora_inicio_nueva = models.TimeField()
    hora_fin_nueva = models.TimeField()
    motivo = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    respuesta = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Solicitud de Cambio de Turno'
        verbose_name_plural = 'Solicitudes de Cambio de Turno'
        ordering = ['-created_at']

    def __str__(self):
        return f"Solicitud {self.id} - {self.medico_solicitante} - {self.status}"

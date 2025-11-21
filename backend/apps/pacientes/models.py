from django.db import models
from apps.usuarios.models import Usuario

class CESFAM(models.Model):
    nombre = models.CharField(max_length=200, verbose_name='Nombre CESFAM')
    direccion = models.CharField(max_length=300, verbose_name='Dirección')
    comuna = models.CharField(max_length=100, verbose_name='Comuna')
    telefono = models.CharField(max_length=20, verbose_name='Teléfono')
    latitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'CESFAM'
        verbose_name_plural = 'CESFAMs'

    def __str__(self):
        return self.nombre

class Paciente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='paciente')
    cesfam = models.ForeignKey(CESFAM, on_delete=models.SET_NULL, null=True, related_name='pacientes')
    comuna = models.CharField(max_length=100, verbose_name='Comuna')
    direccion = models.CharField(max_length=300, verbose_name='Dirección')
    grupo_sanguineo = models.CharField(max_length=5, blank=True, null=True)
    alergias = models.TextField(blank=True, null=True)
    enfermedades_cronicas = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'

    def __str__(self):
        return f"Paciente: {self.usuario.nombre_completo}"

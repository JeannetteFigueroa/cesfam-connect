from django.db import models
from apps.usuarios.models import Usuario
from apps.pacientes.models import CESFAM

class Administrador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='administrador')
    cesfam = models.ForeignKey(CESFAM, on_delete=models.SET_NULL, null=True, related_name='administradores')
    cargo = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'

    def __str__(self):
        return f"Admin: {self.usuario.nombre_completo}"

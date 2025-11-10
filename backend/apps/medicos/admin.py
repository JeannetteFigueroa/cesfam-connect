from django.contrib import admin
from .models import Medico, DisponibilidadMedico

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'especialidad', 'cesfam', 'rut_profesional']
    search_fields = ['usuario__nombre', 'usuario__apellido', 'rut_profesional']
    list_filter = ['especialidad', 'cesfam']

@admin.register(DisponibilidadMedico)
class DisponibilidadMedicoAdmin(admin.ModelAdmin):
    list_display = ['medico', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo']
    list_filter = ['dia_semana', 'activo']

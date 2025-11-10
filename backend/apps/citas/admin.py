from django.contrib import admin
from .models import Cita, HistorialClinico

@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ['id', 'paciente', 'medico', 'fecha', 'hora', 'status']
    list_filter = ['status', 'fecha']
    search_fields = ['paciente__usuario__nombre', 'medico__usuario__nombre']

@admin.register(HistorialClinico)
class HistorialClinicoAdmin(admin.ModelAdmin):
    list_display = ['id', 'paciente', 'medico', 'diagnostico', 'created_at']
    search_fields = ['paciente__usuario__nombre', 'diagnostico']
    list_filter = ['created_at']

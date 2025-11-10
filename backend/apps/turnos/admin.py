from django.contrib import admin
from .models import Turno, SolicitudCambioTurno

@admin.register(Turno)
class TurnoAdmin(admin.ModelAdmin):
    list_display = ['medico', 'fecha', 'hora_inicio', 'hora_fin', 'tipo_turno', 'area', 'status']
    list_filter = ['tipo_turno', 'status', 'fecha']
    search_fields = ['medico__usuario__nombre', 'medico__usuario__apellido', 'area']

@admin.register(SolicitudCambioTurno)
class SolicitudCambioTurnoAdmin(admin.ModelAdmin):
    list_display = ['id', 'medico_solicitante', 'turno_original', 'status', 'created_at']
    list_filter = ['status', 'created_at']

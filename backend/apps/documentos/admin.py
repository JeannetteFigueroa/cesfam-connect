from django.contrib import admin
from .models import Receta, Diagnostico, LicenciaMedica, Reporte

@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ['id', 'paciente', 'medico', 'medicamento', 'created_at']
    search_fields = ['paciente__usuario__nombre', 'medicamento']

@admin.register(Diagnostico)
class DiagnosticoAdmin(admin.ModelAdmin):
    list_display = ['id', 'paciente', 'medico', 'codigo_cie10', 'created_at']
    search_fields = ['paciente__usuario__nombre', 'diagnostico', 'codigo_cie10']

@admin.register(LicenciaMedica)
class LicenciaMedicaAdmin(admin.ModelAdmin):
    list_display = ['id', 'paciente', 'medico', 'tipo', 'fecha_inicio', 'fecha_fin']
    list_filter = ['tipo']

@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = ['id', 'medico', 'titulo', 'created_at']
    search_fields = ['titulo', 'descripcion']

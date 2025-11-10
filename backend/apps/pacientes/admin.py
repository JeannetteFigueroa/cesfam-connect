from django.contrib import admin
from .models import Paciente, CESFAM

@admin.register(CESFAM)
class CESFAMAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'comuna', 'telefono']
    search_fields = ['nombre', 'comuna']

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'cesfam', 'comuna', 'created_at']
    search_fields = ['usuario__nombre', 'usuario__apellido', 'usuario__documento']
    list_filter = ['cesfam', 'comuna']

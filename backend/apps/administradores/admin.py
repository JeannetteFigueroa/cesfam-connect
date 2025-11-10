from django.contrib import admin
from .models import Administrador

@admin.register(Administrador)
class AdministradorAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'cesfam', 'cargo', 'created_at']
    search_fields = ['usuario__nombre', 'usuario__apellido', 'cargo']

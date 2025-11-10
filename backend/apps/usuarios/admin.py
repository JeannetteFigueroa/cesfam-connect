from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    list_display = ['correo', 'nombre', 'apellido', 'documento', 'role', 'is_active']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['correo', 'nombre', 'apellido', 'documento']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('correo', 'password')}),
        ('Información Personal', {'fields': ('nombre', 'apellido', 'tipo_documento', 'documento', 'celular', 'fecha_nacimiento')}),
        ('Permisos', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Fechas', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('correo', 'nombre', 'apellido', 'documento', 'password1', 'password2', 'role'),
        }),
    )

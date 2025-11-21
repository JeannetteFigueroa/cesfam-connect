from django.contrib import admin
from .models import Paciente, CESFAM

@admin.register(CESFAM)
class CESFAMAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'comuna', 'telefono']
    search_fields = ['nombre', 'comuna']

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    fields = ['usuario', 'cesfam', 'comuna', 'direccion']
    list_display = ['usuario', 'usuario_documento', 'cesfam', 'comuna', 'created_at']
    search_fields = ['usuario__nombre', 'usuario__apellido', 'usuario__documento']
    list_filter = ['cesfam', 'comuna']
    raw_id_fields = ('usuario',)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'cesfam':
            from .models import CESFAM
            kwargs['queryset'] = CESFAM.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if 'cesfam' in form.base_fields:
            form.base_fields['cesfam'].required = True
        return form

    def usuario_documento(self, obj):
        return obj.usuario.documento if obj.usuario else None
    usuario_documento.short_description = 'RUT'

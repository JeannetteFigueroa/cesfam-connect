from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from .models import Medico, DisponibilidadMedico
from apps.pacientes.models import CESFAM
from apps.usuarios.models import Usuario


@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    class MedicoAdminForm(forms.ModelForm):
        usuario_documento = forms.CharField(label='RUT (Usuario)', required=True,
                                            help_text='Ingrese el RUT del Usuario existente')

        class Meta:
            model = Medico
            fields = ['usuario_documento', 'cesfam', 'especialidad']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            # Si el objeto ya existe, mostrar el documento del usuario
            if self.instance and self.instance.pk and self.instance.usuario:
                self.fields['usuario_documento'].initial = self.instance.usuario.documento

        def clean_usuario_documento(self):
            doc = self.cleaned_data.get('usuario_documento')
            try:
                user = Usuario.objects.get(documento=doc)
            except Usuario.DoesNotExist:
                raise ValidationError('No existe un Usuario con ese RUT. Crea primero el Usuario en admin.')
            return doc

        def save(self, commit=True):
            # Asignar usuario antes de guardar el Medico
            doc = self.cleaned_data.get('usuario_documento')
            user = Usuario.objects.get(documento=doc)
            self.instance.usuario = user
            # Asegurar rut_profesional toma el documento del usuario
            if not self.instance.rut_profesional:
                self.instance.rut_profesional = user.documento
            return super().save(commit=commit)

    form = MedicoAdminForm
    fields = ['usuario_documento', 'cesfam', 'especialidad']
    list_display = ['usuario', 'usuario_documento', 'especialidad', 'cesfam']
    search_fields = ['usuario__nombre', 'usuario__apellido', 'rut_profesional']
    list_filter = ['especialidad', 'cesfam']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'cesfam':
            kwargs['queryset'] = CESFAM.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # hacer que cesfam sea obligatorio en el admin (sin cambiar el modelo)
        if 'cesfam' in form.base_fields:
            form.base_fields['cesfam'].required = True
        return form

    def usuario_documento(self, obj):
        return obj.usuario.documento if obj.usuario else None
    usuario_documento.short_description = 'RUT'

@admin.register(DisponibilidadMedico)
class DisponibilidadMedicoAdmin(admin.ModelAdmin):
    list_display = ['medico', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo']
    list_filter = ['dia_semana', 'activo']

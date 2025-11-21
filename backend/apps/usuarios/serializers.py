from rest_framework import serializers
from .models import Usuario


class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear usuarios (escribe contraseña, no la devuelve)."""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            "correo",
            "nombre",
            "apellido",
            "tipo_documento",
            "documento",
            "celular",
            "fecha_nacimiento",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer de lectura para Usuario."""

    class Meta:
        model = Usuario
        fields = [
            "id",
            "correo",
            "nombre",
            "apellido",
            "tipo_documento",
            "documento",
            "celular",
            "fecha_nacimiento",
            "role",
        ]


# --- JWT compatibility: aceptar 'correo' en lugar de 'username' ---
try:
    from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
    from rest_framework_simplejwt.views import TokenObtainPairView

    class TokenObtainPairCorreoSerializer(TokenObtainPairSerializer):
        """Extiende el serializer de simplejwt para aceptar el campo 'correo'.

        Si el payload contiene 'correo' pero no 'username', lo mapeamos a 'username'
        antes de delegar en la validación normal. Esto permite que el frontend
        envie `{ "correo": ..., "password": ... }` y el login funcione.
        """

        def validate(self, attrs):
            # Si el frontend envía 'correo' asegurarnos de que el campo
            # que espera SimpleJWT (self.username_field) esté presente.
            # No eliminamos 'correo' del payload para evitar KeyError
            # cuando username_field == 'correo'.
            username_field = getattr(self, 'username_field', 'username')
            if 'correo' in attrs and username_field not in attrs:
                attrs[username_field] = attrs.get('correo')
            return super().validate(attrs)

    class TokenObtainPairCorreoView(TokenObtainPairView):
        serializer_class = TokenObtainPairCorreoSerializer
except Exception:
    # Si simplejwt no está disponible en el entorno, no fallar durante la importación.
    TokenObtainPairCorreoSerializer = None
    TokenObtainPairCorreoView = None

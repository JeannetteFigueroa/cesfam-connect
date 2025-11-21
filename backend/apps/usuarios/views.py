from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UsuarioCreateSerializer, UsuarioSerializer
import logging

logger = logging.getLogger(__name__)

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Devolver un perfil enriquecido que incluya campos del Usuario
        # y datos relacionados de Paciente cuando existan. También añadimos
        # la clave 'email' para compatibilidad con el frontend.
        profile = {
            "id": user.id,
            "correo": user.correo,
            "email": user.correo,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "tipo_documento": user.tipo_documento,
            "documento": user.documento,
            "celular": user.celular,
            "fecha_nacimiento": str(user.fecha_nacimiento) if user.fecha_nacimiento else None,
            "role": user.role,
        }

        # Si el usuario tiene un perfil de Paciente, incluir cesfam, comuna y direccion
        try:
            paciente = getattr(user, 'paciente', None)
            if paciente is not None:
                profile.update({
                    "cesfam": {
                        "id": paciente.cesfam.id if paciente.cesfam else None,
                        "nombre": paciente.cesfam.nombre if paciente.cesfam else None,
                    },
                    "comuna": paciente.comuna,
                    "direccion": paciente.direccion,
                })
        except Exception:
            # No bloquear si hay problemas accediendo a datos relacionados
            pass

        return Response(profile)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Filtrar sólo los campos esperados por el serializer para evitar
        # errores cuando el frontend envía campos opcionales/extra (ej. comuna, direccion, cesfam_id)
        allowed_fields = set(UsuarioCreateSerializer.Meta.fields)
        filtered_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        # Loguear datos entrantes para depuración (no incluir contraseñas en logs en producción)
        logger.debug("RegisterView received data: %s", {k: (v if k != 'password' else '***') for k, v in request.data.items()})

        serializer = UsuarioCreateSerializer(data=filtered_data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "id": user.id,
                "correo": user.correo,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "role": user.role
            }, status=status.HTTP_201_CREATED)
        # Loguear errores de validación para depuración
        logger.warning("RegisterView validation errors: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

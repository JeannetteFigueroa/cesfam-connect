from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cita, HistorialClinico
from .serializers import CitaSerializer, HistorialClinicoSerializer
from apps.medicos.models import Medico, DisponibilidadMedico
from apps.turnos.models import Turno
from django.utils import timezone
from datetime import datetime, timedelta

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related('paciente__usuario', 'medico__usuario').all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        
        if self.request.user.role == 'paciente':
            queryset = queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            queryset = queryset.filter(medico__usuario=self.request.user)
        
        return queryset

    @action(detail=False, methods=['get'])
    def mis_citas(self, request):
        if request.user.role == 'paciente':
            citas = self.queryset.filter(paciente__usuario=request.user).order_by('fecha', 'hora')
        elif request.user.role == 'medico':
            citas = self.queryset.filter(medico__usuario=request.user).order_by('fecha', 'hora')
        else:
            citas = self.queryset.none()
        
        serializer = self.get_serializer(citas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='horarios-disponibles', permission_classes=[AllowAny])
    def horarios_disponibles(self, request):
        """
        Obtiene los horarios disponibles para un médico en una fecha específica.
        Considera: disponibilidad del médico, turnos asignados y citas ya agendadas.
        """
        medico_id = request.query_params.get('medico_id')
        fecha_str = request.query_params.get('fecha')
        
        if not medico_id or not fecha_str:
            return Response({'error': 'Se requiere medico_id y fecha'}, status=400)
        
        try:
            medico = Medico.objects.get(id=medico_id)
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
            dia_semana = fecha.weekday() + 1  # 1=Lunes, 7=Domingo
            
            # Obtener disponibilidad del médico para ese día
            disponibilidades = DisponibilidadMedico.objects.filter(
                medico=medico,
                dia_semana=dia_semana,
                activo=True
            )
            
            if not disponibilidades.exists():
                return Response([])
            
            # Generar todos los horarios posibles de 30 minutos entre hora_inicio y hora_fin
            horarios_disponibles = []
            
            for disp in disponibilidades:
                hora_inicio = disp.hora_inicio
                hora_fin = disp.hora_fin
                
                # Convertir a datetime para facilitar cálculos
                inicio_dt = datetime.combine(fecha, hora_inicio)
                fin_dt = datetime.combine(fecha, hora_fin)
                
                # Si la hora_fin es menor que inicio, significa que cruza medianoche
                if fin_dt <= inicio_dt:
                    fin_dt += timedelta(days=1)
                
                # Generar slots de 30 minutos
                current = inicio_dt
                while current < fin_dt:
                    hora_str = current.time().strftime('%H:%M')
                    horarios_disponibles.append(hora_str)
                    current += timedelta(minutes=30)
            
            # Obtener turnos asignados para ese día
            turnos = Turno.objects.filter(
                medico=medico,
                fecha=fecha,
                status__in=['programado', 'en_curso']
            )
            
            # Obtener citas ya agendadas para ese día
            citas = Cita.objects.filter(
                medico=medico,
                fecha=fecha,
                status__in=['agendada', 'confirmada', 'en_curso']
            )
            
            # Filtrar horarios ocupados por turnos
            horarios_ocupados = set()
            for turno in turnos:
                turno_inicio = datetime.combine(fecha, turno.hora_inicio)
                turno_fin = datetime.combine(fecha, turno.hora_fin)
                if turno_fin <= turno_inicio:
                    turno_fin += timedelta(days=1)
                
                current = turno_inicio
                while current < turno_fin:
                    horarios_ocupados.add(current.time().strftime('%H:%M'))
                    current += timedelta(minutes=30)
            
            # Filtrar horarios ocupados por citas
            for cita in citas:
                cita_hora = cita.hora.strftime('%H:%M')
                horarios_ocupados.add(cita_hora)
            
            # Filtrar horarios disponibles
            horarios_finales = [
                h for h in horarios_disponibles 
                if h not in horarios_ocupados
            ]
            
            # Ordenar y eliminar duplicados
            horarios_finales = sorted(list(set(horarios_finales)))
            
            return Response(horarios_finales)
            
        except Medico.DoesNotExist:
            return Response({'error': 'Médico no encontrado'}, status=404)
        except ValueError:
            return Response({'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class HistorialClinicoViewSet(viewsets.ModelViewSet):
    queryset = HistorialClinico.objects.select_related(
        'paciente__usuario',
        'medico__usuario',
        'cita'
    ).all()
    serializer_class = HistorialClinicoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'paciente':
            return self.queryset.filter(paciente__usuario=self.request.user)
        elif self.request.user.role == 'medico':
            return self.queryset.filter(medico__usuario=self.request.user)
        elif self.request.user.role == 'admin':
            return self.queryset
        return self.queryset.none()

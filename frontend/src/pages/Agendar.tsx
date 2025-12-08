import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '@/lib/api';

interface Medico {
  id: string;
  user_id: string;
  especialidad: string;
  nombre?: string;
  apellido?: string;
  user?: {
    nombre: string;
    apellido: string;
  };
}

const Agendar = () => {
  const [date, setDate] = useState<Date>();
  const [especialidad, setEspecialidad] = useState('');
  const [medico, setMedico] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [agendado, setAgendado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [citaCreada, setCitaCreada] = useState<any>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadMedicos();
  }, []);

  useEffect(() => {
    if (medico && date) {
      loadHorarios();
    }
  }, [medico, date]);

  const loadMedicos = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await api.getMedicos(token);
      const list = Array.isArray(data) ? data : (data?.results || []);
      setMedicos(list);
      
      // Extraer especialidades únicas
      const specs = [...new Set(list.map((m: Medico) => m.especialidad))];
      setEspecialidades(specs);
    } catch (err) {
      console.error('Error loading médicos:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los médicos",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadHorarios = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const fechaStr = date ? format(date, 'yyyy-MM-dd') : '';
      const horarios = await api.getHorariosDisponibles(medico, fechaStr, token);
      setHorariosDisponibles(Array.isArray(horarios) ? horarios : [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00'
      ]);
    } catch (err) {
      // Fallback a horarios estándar
      setHorariosDisponibles([
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00'
      ]);
    }
  };

  const getMedicosFiltrados = () => {
    if (!especialidad) return [];
    return medicos.filter(m => m.especialidad === especialidad);
  };

  const getMedicoNombre = (med: Medico) => {
    if (med.user) {
      return `Dr(a). ${med.user.nombre} ${med.user.apellido}`;
    }
    if (med.nombre && med.apellido) {
      return `Dr(a). ${med.nombre} ${med.apellido}`;
    }
    return `Médico ${med.id}`;
  };

  const formatEspecialidad = (esp: string) => {
    return esp.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAgendar = async () => {
    if (!date || !especialidad || !medico || !hora) {
      toast({
        title: "Faltan datos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || '';
      const medicoSeleccionado = medicos.find(m => m.id === medico);
      
      const citaData = {
        medico_id: medico,
        fecha: format(date, 'yyyy-MM-dd'),
        hora: hora,
        motivo: motivo || 'Consulta médica',
        status: 'pendiente'
      };

      const result = await api.createCita(citaData, token);
      
      setCitaCreada({
        ...result,
        medicoNombre: medicoSeleccionado ? getMedicoNombre(medicoSeleccionado) : '',
        especialidad: formatEspecialidad(especialidad),
        fecha: date,
        hora: hora
      });
      
      setAgendado(true);
      toast({
        title: "¡Cita agendada exitosamente!",
        description: "Tu cita ha sido registrada",
      });
    } catch (err: any) {
      console.error('Error al crear cita:', err);
      toast({
        title: "Error al agendar",
        description: err.message || "No se pudo crear la cita",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (agendado && citaCreada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-accent/5 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-secondary">¡Cita Agendada!</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Tu hora médica ha sido confirmada exitosamente
            </p>
            
            <Card className="bg-muted mb-8">
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Especialidad</p>
                    <p className="font-semibold">{citaCreada.especialidad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Médico</p>
                    <p className="font-semibold">{citaCreada.medicoNombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                    <p className="font-semibold">
                      {citaCreada.fecha && format(citaCreada.fecha, "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hora</p>
                    <p className="font-semibold">{citaCreada.hora}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Puedes ver esta cita en tu historial médico
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => {
                  setAgendado(false);
                  setCitaCreada(null);
                  setEspecialidad('');
                  setMedico('');
                  setHora('');
                  setMotivo('');
                  setDate(undefined);
                }} variant="outline">
                  Agendar Otra Cita
                </Button>
                <Button onClick={() => window.location.href = '/historial'} className="bg-primary">
                  Ver Historial
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Agendar Hora Médica</h1>
          <p className="text-muted-foreground">Reserva tu cita con nuestros especialistas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Cita</CardTitle>
            <CardDescription>
              Completa todos los campos para agendar tu hora médica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Especialidad */}
            <div className="space-y-2">
              <Label>Especialidad Médica</Label>
              <Select value={especialidad} onValueChange={(value) => {
                setEspecialidad(value);
                setMedico('');
                setHora('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {formatEspecialidad(esp)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {especialidades.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay especialidades disponibles</p>
              )}
            </div>

            {/* Médico */}
            {especialidad && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>Médico</span>
                </Label>
                <Select value={medico} onValueChange={setMedico}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {getMedicosFiltrados().map((med) => (
                      <SelectItem key={med.id} value={med.id}>
                        {getMedicoNombre(med)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getMedicosFiltrados().length === 0 && (
                  <p className="text-sm text-muted-foreground">No hay médicos disponibles en esta especialidad</p>
                )}
              </div>
            )}

            {/* Fecha */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>Fecha</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setHora('');
                    }}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hora */}
            {date && medico && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Horario</span>
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {horariosDisponibles.map((h) => (
                    <Button
                      key={h}
                      variant={hora === h ? "default" : "outline"}
                      className={hora === h ? "bg-primary" : ""}
                      onClick={() => setHora(h)}
                    >
                      {h}
                    </Button>
                  ))}
                </div>
                {horariosDisponibles.length === 0 && (
                  <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta fecha</p>
                )}
              </div>
            )}

            {/* Motivo */}
            <div className="space-y-2">
              <Label>Motivo de la consulta (opcional)</Label>
              <Textarea
                placeholder="Describe brevemente el motivo de tu consulta..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
              />
            </div>

            {/* Botón Agendar */}
            <Button
              onClick={handleAgendar}
              className="w-full gradient-primary hover:opacity-90 h-12 text-lg"
              disabled={!date || !especialidad || !medico || !hora || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Confirmar Cita Médica
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agendar;

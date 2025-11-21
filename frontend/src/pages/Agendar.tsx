import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Agendar = () => {
  const [date, setDate] = useState<Date>();
  const [especialidad, setEspecialidad] = useState('');
  const [medico, setMedico] = useState('');
  const [hora, setHora] = useState('');
  const [agendado, setAgendado] = useState(false);
  const { toast } = useToast();

  const especialidades = [
    'Medicina General',
    'Cardiología',
    'Pediatría',
    'Ginecología',
    'Traumatología',
    'Dermatología'
  ];

  const medicos = {
    'Medicina General': ['Dr. Juan Pérez', 'Dra. Ana López'],
    'Cardiología': ['Dra. María González', 'Dr. Carlos Ruiz'],
    'Pediatría': ['Dra. Laura Martínez', 'Dr. Roberto Silva'],
    'Ginecología': ['Dra. Patricia Torres', 'Dra. Carmen Díaz'],
    'Traumatología': ['Dr. Miguel Ángel Rojas', 'Dr. Fernando Castro'],
    'Dermatología': ['Dra. Sofía Morales', 'Dr. Diego Vargas']
  };

  const horarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleAgendar = () => {
    if (!date || !especialidad || !medico || !hora) {
      toast({
        title: "Faltan datos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setAgendado(true);
    toast({
      title: "¡Cita agendada exitosamente!",
      description: `Tu cita con ${medico} está confirmada`,
    });
  };

  if (agendado) {
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
                    <p className="font-semibold">{especialidad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Médico</p>
                    <p className="font-semibold">{medico}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                    <p className="font-semibold">
                      {date && format(date, "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hora</p>
                    <p className="font-semibold">{hora}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Recibirás un correo de confirmación con los detalles de tu cita
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setAgendado(false)} variant="outline">
                  Agendar Otra Cita
                </Button>
                <Button onClick={() => window.location.href = '/'} className="bg-primary">
                  Volver al Inicio
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
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    {medicos[especialidad as keyof typeof medicos]?.map((med) => (
                      <SelectItem key={med} value={med}>{med}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hora */}
            {date && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Horario</span>
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {horarios.map((h) => (
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
              </div>
            )}

            {/* Botón Agendar */}
            <Button
              onClick={handleAgendar}
              className="w-full gradient-primary hover:opacity-90 h-12 text-lg"
              disabled={!date || !especialidad || !medico || !hora}
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Confirmar Cita Médica
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agendar;

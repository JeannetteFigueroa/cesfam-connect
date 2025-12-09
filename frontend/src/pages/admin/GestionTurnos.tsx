import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Loader2, Download, Save } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns";
import { es } from "date-fns/locale";


const HORAS = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Medico {
  id: string;
  nombre?: string;
  apellido?: string;
  especialidad: string;
  usuario?: { nombre: string; apellido: string; };
}

interface Turno {
  id: string;
  medico_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cargo: string;
  area: string;
  medico?: Medico;
}

function MedicoCard({ medico }: { medico: Medico }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `medico-${medico.id}`,
    data: { medico }
  });
  // Obtiene el nombre completo del médico
  const nombre = medico.usuario
    ? `${medico.usuario.nombre} ${medico.usuario.apellido}`
    : `${medico.nombre || ''} ${medico.apellido || ''}`;

  // Formatea la especialidad para mostrarla legible
  const especialidad = medico.especialidad
    ? medico.especialidad.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Sin especialidad';


  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      className={`p-3 bg-primary/10 border border-primary rounded-lg cursor-move hover:bg-primary/20 transition-colors ${isDragging ? 'opacity-50' : ''}`}>
      <p className="font-medium text-sm">{nombre}</p>
      <p className="text-xs text-muted-foreground capitalize">{especialidad}</p>
    </div>
  );
}

function CeldaTurno({ dia, hora, turno }: { dia: number; hora: string; turno?: Turno }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${dia}-${hora}`, data: { dia, hora } });

  return (
    <div ref={setNodeRef}
      className={`min-h-[80px] border rounded-lg p-2 transition-colors ${isOver ? 'bg-primary/20 border-primary' : 'bg-card hover:bg-accent/10'} ${turno ? 'bg-primary/10' : ''}`}>
      {turno && (
        <div className="text-xs">
          <p className="font-medium">{turno.medico?.usuario?.nombre || turno.medico?.nombre} {turno.medico?.usuario?.apellido || turno.medico?.apellido}</p>
          <p className="text-muted-foreground text-[10px]">{turno.cargo}</p>
        </div>
      )}
    </div>
  );
}

interface CESFAM {
  id: string;
  nombre: string;
}

export default function GestionTurnos() {
  const [cesfam, setCesfam] = useState('');
  const [cesfams, setCesfams] = useState<CESFAM[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [semanaActual, setSemanaActual] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCesfams();
  }, []);

  useEffect(() => {
    if (cesfam) {
      loadData();
    } else {
      setMedicos([]);
      setTurnos([]);
    }
  }, [cesfam]);

  const loadCesfams = async () => {
    try {
      const cesfamsData = await api.getCesfams();
      setCesfams(Array.isArray(cesfamsData) ? cesfamsData : []);
    } catch (err) {
      console.error('Error loading CESFAMs:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los CESFAMs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (!cesfam) return;
    
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      const medicosRes = await api.getMedicosByCesfam(cesfam, token);
      setMedicos(Array.isArray(medicosRes) ? medicosRes : (medicosRes?.results || []));
      
      // Cargar turnos del CESFAM (filtrar por médicos del CESFAM)
      const turnosRes = await api.getTurnos(token);
      const turnosList = Array.isArray(turnosRes) ? turnosRes : (turnosRes?.results || []);
      const medicosIds = medicos.map(m => m.id);
      const turnosFiltrados = turnosList.filter((t: Turno) => medicosIds.includes(t.medico_id));
      setTurnos(turnosFiltrados);
    } catch (err: any) {
      console.error('Error loading data:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudieron cargar los datos",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const medicoData = active.data.current?.medico as Medico;
    const slotData = over.data.current as { dia: number; hora: string };
    if (!medicoData || !slotData) return;

    const fecha = getDateForDia(slotData.dia);
    const turnoExistente = turnos.find(t =>
      t.fecha === fecha && t.hora_inicio === slotData.hora
    );
      if (turnoExistente) {
      toast({ title: "Ya existe un turno", variant: "destructive" });
      return;
    }

    const nuevoTurno: Turno = {
      id: `temp-${Date.now()}`,
      medico_id: medicoData.id,
      fecha,
      hora_inicio: slotData.hora,
      hora_fin: `${parseInt(slotData.hora) + 1}:00`,
      cargo: 'Atención Médica',
      area: 'Consulta',
      medico: medicoData
    };
    setTurnos([...turnos, nuevoTurno]);
    toast({ title: `Turno asignado a ${medicoData.usuario?.nombre || medicoData.nombre}` });
  };

  function getDateForDia(dia: number) {
    // Lunes = 1, Martes = 2, ..., Sábado = 6
    const inicioSemana = startOfWeek(addWeeks(new Date(), semanaActual), { weekStartsOn: 1 }); // Lunes
    const fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + dia - 1); // <-- Suma dia directamente
    return fecha.toISOString().split('T')[0];
  }

  const handleSave = async () => {
    if (!cesfam) {
      toast({
        title: "Selecciona un CESFAM",
        description: "Debes seleccionar un CESFAM antes de guardar turnos",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      const newTurnos = turnos.filter(t => t.id.startsWith('temp-'));
      if (newTurnos.length === 0) {
        toast({
          title: "Sin turnos nuevos",
          description: "No hay turnos nuevos para guardar",
          variant: "default"
        });
        return;
      }

      for (const turno of newTurnos) {
        await api.createTurno({
          medico: turno.medico_id,
          fecha: turno.fecha,
          hora_inicio: turno.hora_inicio,
          hora_fin: turno.hora_fin,
          cargo: turno.cargo,
          area: turno.area,
          tipo_turno: 'diurno',
          status: 'programado'
        }, token);
      }
      
      toast({ 
        title: "Turnos guardados correctamente",
        description: `Se guardaron ${newTurnos.length} turno(s)`
      });
      await loadData();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || "Error al guardar turnos";
      toast({ 
        title: "Error al guardar", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally { 
      setSaving(false); 
    }
  };

  // Calcula el rango de la semana actual
  function getSemanaRango(semanaActual: number) {
    const hoy = new Date();
    const inicio = startOfWeek(addWeeks(hoy, semanaActual), { weekStartsOn: 1 }); // Lunes
    const fin = endOfWeek(addWeeks(hoy, semanaActual), { weekStartsOn: 1 });     // Domingo
    return {
      inicio,
      fin,
      texto: `${format(inicio, "dd MMMM", { locale: es })} - ${format(fin, "dd MMMM", { locale: es })}`
    };
  };

  const getTurnoParaSlot = (dia: number, hora: string) => {
    const fechaSlot = getDateForDia(dia); // fecha ISO para la celda
    return turnos.find(t => t.fecha === fechaSlot && t.hora_inicio === hora);
  };

  const activeMedico = activeId ? medicos.find(m => `medico-${m.id}` === activeId) : null;

  if (loading) return <div className="container mx-auto p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={(e) => setActiveId(e.active.id as string)}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Turnos</h1>
            <p className="text-muted-foreground">Selecciona un CESFAM y arrastra médicos para asignar turnos</p>
          </div>
          <Button onClick={handleSave} disabled={saving || !cesfam}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Turnos
          </Button>
        </div>

        {/* Selector de CESFAM */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar CESFAM</CardTitle>
            <CardDescription>Elige el CESFAM para gestionar turnos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>CESFAM</Label>
                <Select value={cesfam} onValueChange={(value) => {
                  setCesfam(value);
                  setTurnos([]);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un CESFAM" />
                  </SelectTrigger>
                  <SelectContent>
                    {cesfams.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {cesfam ? (
        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Médicos Disponibles</CardTitle>
              <CardDescription>Arrastra para asignar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No hay médicos en este CESFAM</p>
              ) : medicos.map((m) => <MedicoCard key={m.id} medico={m} />)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />Calendario
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setSemanaActual(s => s - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {getSemanaRango(semanaActual).texto}
                  </span>
                  <Button variant="outline" size="icon" onClick={() => setSemanaActual(s => s + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    <div className="font-medium text-sm text-muted-foreground">Hora</div>
                    {DIAS_SEMANA.map((dia) => <div key={dia} className="font-medium text-sm text-center">{dia}</div>)}
                  </div>
                  {HORAS.map((hora) => (
                    <div key={hora} className="grid grid-cols-7 gap-2 mb-2">
                      <div className="flex items-center text-sm text-muted-foreground font-medium">{hora}</div>
                      {DIAS_SEMANA.map((_, i) => <CeldaTurno key={`${i}-${hora}`} dia={i + 1} hora={hora} turno={getTurnoParaSlot(i + 1, hora)} />)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Selecciona un CESFAM para comenzar a gestionar turnos</p>
            </CardContent>
          </Card>
        )}
      </div>
      <DragOverlay>
        {activeMedico && (
          <div className="p-3 bg-primary/10 border border-primary rounded-lg shadow-lg">
            <p className="font-medium text-sm">{activeMedico.usuario?.nombre || activeMedico.nombre}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

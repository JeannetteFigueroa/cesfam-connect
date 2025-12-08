import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Loader2, Download, Save } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const HORAS = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Medico {
  id: string;
  nombre?: string;
  apellido?: string;
  especialidad: string;
  user?: { nombre: string; apellido: string; };
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
  const nombre = medico.user ? `${medico.user.nombre} ${medico.user.apellido}` : `${medico.nombre || ''} ${medico.apellido || ''}`;

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      className={`p-3 bg-primary/10 border border-primary rounded-lg cursor-move hover:bg-primary/20 transition-colors ${isDragging ? 'opacity-50' : ''}`}>
      <p className="font-medium text-sm">{nombre}</p>
      <p className="text-xs text-muted-foreground capitalize">{medico.especialidad?.replace(/_/g, ' ')}</p>
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
          <p className="font-medium">{turno.medico?.user?.nombre || turno.medico?.nombre} {turno.medico?.user?.apellido || turno.medico?.apellido}</p>
          <p className="text-muted-foreground text-[10px]">{turno.cargo}</p>
        </div>
      )}
    </div>
  );
}

export default function GestionTurnos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [semanaActual, setSemanaActual] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const medicosRes = await api.getMedicos(token);
      setMedicos(Array.isArray(medicosRes) ? medicosRes : (medicosRes?.results || []));
      const turnosRes = await api.getTurnos(token);
      setTurnos(Array.isArray(turnosRes) ? turnosRes : (turnosRes?.results || []));
    } catch (err) {
      console.error('Error loading data:', err);
    } finally { setLoading(false); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const medicoData = active.data.current?.medico as Medico;
    const slotData = over.data.current as { dia: number; hora: string };
    if (!medicoData || !slotData) return;

    const turnoExistente = turnos.find(t => {
      const d = new Date(t.fecha).getDay();
      return d === slotData.dia && t.hora_inicio === slotData.hora;
    });

    if (turnoExistente) {
      toast({ title: "Ya existe un turno", variant: "destructive" });
      return;
    }

    const fecha = getDateForDia(slotData.dia);
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
    toast({ title: `Turno asignado a ${medicoData.user?.nombre || medicoData.nombre}` });
  };

  const getDateForDia = (dia: number) => {
    const today = new Date();
    const diff = dia - today.getDay() + (semanaActual * 7);
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    return date.toISOString().split('T')[0];
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const newTurnos = turnos.filter(t => t.id.startsWith('temp-'));
      for (const turno of newTurnos) {
        await api.createTurno({
          medico_id: turno.medico_id,
          fecha: turno.fecha,
          hora_inicio: turno.hora_inicio,
          hora_fin: turno.hora_fin,
          cargo: turno.cargo,
          area: turno.area,
          tipo_turno: 'regular',
          status: 'activo'
        }, token);
      }
      toast({ title: "Turnos guardados correctamente" });
      await loadData();
    } catch (err: any) {
      toast({ title: "Error al guardar", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const getTurnoParaSlot = (dia: number, hora: string) => {
    return turnos.find(t => {
      const d = new Date(t.fecha).getDay();
      return d === dia && t.hora_inicio === hora;
    });
  };

  const activeMedico = activeId ? medicos.find(m => `medico-${m.id}` === activeId) : null;

  if (loading) return <div className="container mx-auto p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={(e) => setActiveId(e.active.id as string)}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Turnos</h1>
            <p className="text-muted-foreground">Arrastra médicos para asignar turnos</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Turnos
          </Button>
        </div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Médicos Disponibles</CardTitle>
              <CardDescription>Arrastra para asignar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No hay médicos</p>
              ) : medicos.map((m) => <MedicoCard key={m.id} medico={m} />)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Calendario</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setSemanaActual(s => s - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Badge variant="secondary">Semana {semanaActual + 1}</Badge>
                  <Button variant="outline" size="icon" onClick={() => setSemanaActual(s => s + 1)}><ChevronRight className="h-4 w-4" /></Button>
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
      </div>
      <DragOverlay>
        {activeMedico && (
          <div className="p-3 bg-primary/10 border border-primary rounded-lg shadow-lg">
            <p className="font-medium text-sm">{activeMedico.user?.nombre || activeMedico.nombre}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

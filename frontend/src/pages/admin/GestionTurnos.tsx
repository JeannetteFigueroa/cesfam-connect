import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { toast } from "sonner";

const HORAS = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
}

interface Turno {
  id: string;
  medico_id: string;
  dia: number;
  hora: string;
  medico?: Medico;
}

function MedicoCard({ medico }: { medico: Medico }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `medico-${medico.id}`,
    data: { medico }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 bg-primary/10 border border-primary rounded-lg cursor-move hover:bg-primary/20 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <p className="font-medium text-sm">{medico.nombre} {medico.apellido}</p>
      <p className="text-xs text-muted-foreground capitalize">{medico.especialidad.replace(/_/g, ' ')}</p>
    </div>
  );
}

function CeldaTurno({ dia, hora, turno }: { dia: number; hora: string; turno?: Turno }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${dia}-${hora}`,
    data: { dia, hora }
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] border rounded-lg p-2 transition-colors ${
        isOver ? 'bg-primary/20 border-primary' : 'bg-card hover:bg-accent/10'
      } ${turno ? 'bg-primary/10' : ''}`}
    >
      {turno && turno.medico && (
        <div className="text-xs">
          <p className="font-medium">{turno.medico.nombre} {turno.medico.apellido}</p>
          <p className="text-muted-foreground capitalize text-[10px]">{turno.medico.especialidad.replace(/_/g, ' ')}</p>
        </div>
      )}
    </div>
  );
}

export default function GestionTurnos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [semanaActual, setSemanaActual] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    loadMedicos();
    loadTurnos();
  }, []);

  const loadMedicos = async () => {
    // TODO: Load from Django API
    setMedicos([]);
  };

  const loadTurnos = async () => {
    // En este ejemplo simplificado, usamos datos locales
    // En producción, cargarías desde la base de datos
    setTurnos([]);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const medicoData = active.data.current?.medico as Medico;
    const slotData = over.data.current as { dia: number; hora: string };

    if (!medicoData || !slotData) return;

    // Verificar si ya existe un turno en ese slot
    const turnoExistente = turnos.find(
      t => t.dia === slotData.dia && t.hora === slotData.hora
    );

    if (turnoExistente) {
      toast.error("Ya existe un turno asignado en ese horario");
      return;
    }

    // Crear nuevo turno
    const nuevoTurno: Turno = {
      id: `temp-${Date.now()}`,
      medico_id: medicoData.id,
      dia: slotData.dia,
      hora: slotData.hora,
      medico: medicoData
    };

    setTurnos([...turnos, nuevoTurno]);
    toast.success(`Turno asignado a ${medicoData.nombre} ${medicoData.apellido}`);

    // Aquí guardarías en la base de datos
    // await supabase.from('turnos').insert({ ... });
  };

  const getTurnoParaSlot = (dia: number, hora: string) => {
    return turnos.find(t => t.dia === dia && t.hora === hora);
  };

  const activeMedico = activeId
    ? medicos.find(m => `medico-${m.id}` === activeId)
    : null;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={(e) => setActiveId(e.active.id as string)}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Turnos</h1>
            <p className="text-muted-foreground">Arrastra médicos a los horarios para asignar turnos</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          {/* Panel de médicos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Médicos Disponibles</CardTitle>
              <CardDescription>Arrastra para asignar turnos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay médicos registrados
                </p>
              ) : (
                medicos.map((medico) => (
                  <MedicoCard key={medico.id} medico={medico} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Calendario */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Calendario Semanal</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSemanaActual(semanaActual - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary">Semana {semanaActual + 1}</Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSemanaActual(semanaActual + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Encabezado de días */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    <div className="font-medium text-sm text-muted-foreground">Hora</div>
                    {DIAS_SEMANA.map((dia) => (
                      <div key={dia} className="font-medium text-sm text-center">
                        {dia}
                      </div>
                    ))}
                  </div>

                  {/* Filas de horarios */}
                  {HORAS.map((hora) => (
                    <div key={hora} className="grid grid-cols-7 gap-2 mb-2">
                      <div className="flex items-center text-sm text-muted-foreground font-medium">
                        {hora}
                      </div>
                      {DIAS_SEMANA.map((_, diaIndex) => (
                        <CeldaTurno
                          key={`${diaIndex}-${hora}`}
                          dia={diaIndex}
                          hora={hora}
                          turno={getTurnoParaSlot(diaIndex, hora)}
                        />
                      ))}
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
            <p className="font-medium text-sm">{activeMedico.nombre} {activeMedico.apellido}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {activeMedico.especialidad.replace(/_/g, ' ')}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

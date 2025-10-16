import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const medicos = [
  { id: 1, nombre: "Dr. Silva", especialidad: "Medicina General" },
  { id: 2, nombre: "Dra. Martínez", especialidad: "Medicina Interna" },
  { id: 3, nombre: "Dr. Rojas", especialidad: "Medicina Familiar" },
  { id: 4, nombre: "Dra. Pérez", especialidad: "Pediatría" },
  { id: 5, nombre: "Dra. González", especialidad: "Ginecología" },
];

const areas = ["Consulta", "Urgencia", "Control Crónico", "Vacunatorio", "Dental", "Kinesiología"];

const turnosAsignados = [
  { id: 1, medico: "Dr. Silva", fecha: "2025-01-20", hora: "08:00 - 14:00", area: "Consulta", actividad: "Atención General" },
  { id: 2, medico: "Dra. Martínez", fecha: "2025-01-20", hora: "14:00 - 20:00", area: "Urgencia", actividad: "Urgencias" },
  { id: 3, medico: "Dr. Rojas", fecha: "2025-01-21", hora: "08:00 - 14:00", area: "Control Crónico", actividad: "Control Hipertensión" },
];

export default function GestionTurnos() {
  const [medicoSeleccionado, setMedicoSeleccionado] = useState("");
  const [fechaTurno, setFechaTurno] = useState("");
  const [horaTurno, setHoraTurno] = useState("");
  const [areaSeleccionada, setAreaSeleccionada] = useState("");
  const [actividad, setActividad] = useState("");

  const handleAsignarTurno = () => {
    if (!medicoSeleccionado || !fechaTurno || !horaTurno || !areaSeleccionada) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    toast.success("Turno asignado exitosamente");
    setMedicoSeleccionado("");
    setFechaTurno("");
    setHoraTurno("");
    setAreaSeleccionada("");
    setActividad("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Turnos</h1>
        <p className="text-muted-foreground">Organiza y asigna turnos a los médicos</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Asignar Nuevo Turno
            </CardTitle>
            <CardDescription>Programa un turno para un médico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medico">Médico</Label>
              <Select value={medicoSeleccionado} onValueChange={setMedicoSeleccionado}>
                <SelectTrigger id="medico">
                  <SelectValue placeholder="Selecciona un médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico.id} value={medico.nombre}>
                      {medico.nombre} - {medico.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={fechaTurno}
                onChange={(e) => setFechaTurno(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Horario</Label>
              <Select value={horaTurno} onValueChange={setHoraTurno}>
                <SelectTrigger id="hora">
                  <SelectValue placeholder="Selecciona el horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00 - 14:00">Mañana (08:00 - 14:00)</SelectItem>
                  <SelectItem value="14:00 - 20:00">Tarde (14:00 - 20:00)</SelectItem>
                  <SelectItem value="20:00 - 02:00">Noche (20:00 - 02:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Selecciona el área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actividad">Actividad/Cargo</Label>
              <Input
                id="actividad"
                placeholder="Ej: Atención General, Control Crónico..."
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
              />
            </div>

            <Button onClick={handleAsignarTurno} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Asignar Turno
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turnos Asignados</CardTitle>
            <CardDescription>Próximos turnos programados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turnosAsignados.map((turno) => (
                <div key={turno.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{turno.medico}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(turno.fecha).toLocaleDateString('es-ES')} - {turno.hora}
                      </p>
                    </div>
                    <Badge>{turno.area}</Badge>
                  </div>
                  <p className="text-sm">{turno.actividad}</p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

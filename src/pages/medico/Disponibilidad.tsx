import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const diasSemana = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

const horarios = [
  { id: "mañana", label: "Mañana (08:00 - 14:00)" },
  { id: "tarde", label: "Tarde (14:00 - 20:00)" },
  { id: "noche", label: "Noche (20:00 - 02:00)" },
];

export default function Disponibilidad() {
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState<string[]>([]);
  const [solicitudCambio, setSolicitudCambio] = useState("");

  const handleDiaChange = (dia: string) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleHorarioChange = (horario: string) => {
    setHorariosSeleccionados((prev) =>
      prev.includes(horario) ? prev.filter((h) => h !== horario) : [...prev, horario]
    );
  };

  const handleSubmitDisponibilidad = () => {
    toast.success("Disponibilidad actualizada");
  };

  const handleSubmitSolicitud = () => {
    toast.success("Solicitud de cambio enviada");
    setSolicitudCambio("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Disponibilidad</h1>
        <p className="text-muted-foreground">Informa tus horarios disponibles y solicita cambios de turno</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Días Disponibles
            </CardTitle>
            <CardDescription>Selecciona los días que puedes trabajar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {diasSemana.map((dia) => (
              <div key={dia.id} className="flex items-center space-x-2">
                <Checkbox
                  id={dia.id}
                  checked={diasSeleccionados.includes(dia.id)}
                  onCheckedChange={() => handleDiaChange(dia.id)}
                />
                <Label htmlFor={dia.id} className="font-normal cursor-pointer">
                  {dia.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios Disponibles
            </CardTitle>
            <CardDescription>Selecciona los horarios en que puedes trabajar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {horarios.map((horario) => (
              <div key={horario.id} className="flex items-center space-x-2">
                <Checkbox
                  id={horario.id}
                  checked={horariosSeleccionados.includes(horario.id)}
                  onCheckedChange={() => handleHorarioChange(horario.id)}
                />
                <Label htmlFor={horario.id} className="font-normal cursor-pointer">
                  {horario.label}
                </Label>
              </div>
            ))}
            <Button onClick={handleSubmitDisponibilidad} className="w-full mt-4">
              Guardar Disponibilidad
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Solicitar Cambio de Turno
            </CardTitle>
            <CardDescription>Describe el cambio que necesitas realizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ejemplo: Necesito cambiar mi turno del 20/01 en la mañana por uno en la tarde debido a..."
              value={solicitudCambio}
              onChange={(e) => setSolicitudCambio(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSubmitSolicitud} className="w-full">
              Enviar Solicitud
            </Button>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Solicitudes Pendientes</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">Cambio de turno - 15/01/2025</p>
                  <p className="text-xs text-muted-foreground mt-1">Estado: Pendiente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

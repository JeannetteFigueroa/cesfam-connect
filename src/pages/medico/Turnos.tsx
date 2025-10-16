import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

const turnosDelMes = [
  { id: 1, fecha: "2025-01-20", hora: "08:00 - 14:00", cargo: "Atención Médica General", area: "Consulta", compañeros: ["Dr. Silva", "Enf. López"] },
  { id: 2, fecha: "2025-01-21", hora: "14:00 - 20:00", cargo: "Urgencias", area: "Urgencia", compañeros: ["Dra. Martínez", "Enf. García"] },
  { id: 3, fecha: "2025-01-23", hora: "08:00 - 14:00", cargo: "Control Crónico", area: "Consulta", compañeros: ["Dr. Rojas", "Enf. Torres"] },
  { id: 4, fecha: "2025-01-24", hora: "14:00 - 20:00", cargo: "Atención Médica General", area: "Consulta", compañeros: ["Dra. Pérez", "Enf. Muñoz"] },
  { id: 5, fecha: "2025-01-27", hora: "08:00 - 14:00", cargo: "Vacunación", area: "Vacunatorio", compañeros: ["Enf. Castro", "Enf. Ramírez"] },
];

export default function Turnos() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Turnos</h1>
        <p className="text-muted-foreground">Horarios y actividades del mes</p>
      </div>

      <div className="grid gap-4">
        {turnosDelMes.map((turno) => (
          <Card key={turno.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {new Date(turno.fecha).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    {turno.hora}
                  </CardDescription>
                </div>
                <Badge>{turno.area}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Cargo/Actividad:</p>
                <p className="text-sm text-muted-foreground">{turno.cargo}</p>
              </div>
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Compañeros de turno:
                </p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {turno.compañeros.map((compañero, idx) => (
                    <Badge key={idx} variant="secondary">{compañero}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

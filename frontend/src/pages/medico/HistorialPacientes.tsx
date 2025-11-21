import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Calendar } from "lucide-react";

const pacientesAtendidos = [
  { id: 1, nombre: "María González", rut: "12.345.678-9", fecha: "2025-01-15", diagnostico: "Control rutinario", area: "Consulta" },
  { id: 2, nombre: "Pedro Ramírez", rut: "98.765.432-1", fecha: "2025-01-14", diagnostico: "Hipertensión", area: "Control Crónico" },
  { id: 3, nombre: "Ana Torres", rut: "11.222.333-4", fecha: "2025-01-13", diagnostico: "Gripe", area: "Urgencia" },
  { id: 4, nombre: "Carlos Muñoz", rut: "55.666.777-8", fecha: "2025-01-12", diagnostico: "Diabetes tipo 2", area: "Control Crónico" },
  { id: 5, nombre: "Laura Castro", rut: "33.444.555-6", fecha: "2025-01-11", diagnostico: "Vacunación anual", area: "Vacunatorio" },
];

export default function HistorialPacientes() {
  const [search, setSearch] = useState("");

  const filteredPacientes = pacientesAtendidos.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(search.toLowerCase()) ||
      paciente.rut.includes(search)
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de Pacientes</h1>
        <p className="text-muted-foreground">Pacientes que has atendido</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o RUT..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredPacientes.map((paciente) => (
          <Card key={paciente.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{paciente.nombre}</CardTitle>
                  <CardDescription>RUT: {paciente.rut}</CardDescription>
                </div>
                <Badge>{paciente.area}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(paciente.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">Diagnóstico:</p>
                <p className="text-sm text-muted-foreground">{paciente.diagnostico}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  status: string;
  paciente?: {
    id: string;
    user?: {
      nombre: string;
      apellido: string;
      documento: string;
    };
    comuna?: string;
  };
}

export default function HistorialPacientes() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await api.getCitasByMedico(token);
      const list = Array.isArray(data) ? data : (data?.results || []);
      setCitas(list);
    } catch (err) {
      console.error('Error loading citas:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pacientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPacienteNombre = (cita: Cita) => {
    if (cita.paciente?.user) {
      return `${cita.paciente.user.nombre} ${cita.paciente.user.apellido}`;
    }
    return 'Paciente';
  };

  const getPacienteRut = (cita: Cita) => {
    return cita.paciente?.user?.documento || 'Sin RUT';
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'pendiente': 'bg-warning',
      'confirmada': 'bg-primary',
      'completada': 'bg-success',
      'cancelada': 'bg-destructive',
    };
    return map[status] || 'bg-muted';
  };

  const filteredCitas = citas.filter((cita) => {
    const nombre = getPacienteNombre(cita).toLowerCase();
    const rut = getPacienteRut(cita).toLowerCase();
    const searchLower = search.toLowerCase();
    return nombre.includes(searchLower) || rut.includes(searchLower);
  });

  // Agrupar por paciente para mostrar los próximos a atender
  const citasPendientes = filteredCitas.filter(c => 
    c.status === 'pendiente' || c.status === 'confirmada'
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <p className="text-muted-foreground">Pacientes con citas agendadas contigo</p>
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

      {/* Próximos a atender */}
      {citasPendientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Próximos Pacientes a Atender
            </CardTitle>
            <CardDescription>Citas pendientes y confirmadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {citasPendientes.map((cita) => (
                <div key={cita.id} className="flex items-start justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <h3 className="font-semibold">{getPacienteNombre(cita)}</h3>
                    <p className="text-sm text-muted-foreground">RUT: {getPacienteRut(cita)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatFecha(cita.fecha)} - {cita.hora}</span>
                    </div>
                    {cita.motivo && (
                      <p className="text-sm text-muted-foreground mt-1">Motivo: {cita.motivo}</p>
                    )}
                  </div>
                  <Badge className={getStatusBadge(cita.status)}>
                    {cita.status.charAt(0).toUpperCase() + cita.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial completo */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Atenciones</CardTitle>
          <CardDescription>Todas las citas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCitas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {search ? 'No se encontraron pacientes con ese criterio' : 'No tienes citas registradas'}
            </p>
          ) : (
            <div className="grid gap-4">
              {filteredCitas.map((cita) => (
                <Card key={cita.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{getPacienteNombre(cita)}</CardTitle>
                        <CardDescription>RUT: {getPacienteRut(cita)}</CardDescription>
                      </div>
                      <Badge className={getStatusBadge(cita.status)}>
                        {cita.status.charAt(0).toUpperCase() + cita.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatFecha(cita.fecha)} - {cita.hora}</span>
                    </div>
                    {cita.motivo && (
                      <div>
                        <p className="text-sm font-medium">Motivo:</p>
                        <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Turno {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cargo: string;
  area: string;
  tipo_turno: string;
  observaciones?: string;
  status: string;
}

export default function Turnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await api.getMisTurnos(token);
      const list = Array.isArray(data) ? data : (data?.results || []);
      setTurnos(list);
    } catch (err) {
      console.error('Error loading turnos:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los turnos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "EEEE, d 'de' MMMM yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'activo': { label: 'Activo', variant: 'default' },
      'pendiente': { label: 'Pendiente', variant: 'secondary' },
      'completado': { label: 'Completado', variant: 'outline' },
      'cancelado': { label: 'Cancelado', variant: 'destructive' },
    };
    return statusMap[status] || { label: status, variant: 'outline' };
  };

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
        <h1 className="text-3xl font-bold">Mis Turnos</h1>
        <p className="text-muted-foreground">Horarios y actividades asignadas</p>
      </div>

      {turnos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Sin turnos asignados</h3>
            <p className="text-muted-foreground">
              No tienes turnos asignados actualmente. El administrador te asignará turnos próximamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {turnos.map((turno) => {
            const statusInfo = getStatusBadge(turno.status);
            return (
              <Card key={turno.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {formatFecha(turno.fecha)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4" />
                        {turno.hora_inicio} - {turno.hora_fin}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{turno.area}</Badge>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Cargo/Actividad:</p>
                    <p className="text-sm text-muted-foreground">{turno.cargo}</p>
                  </div>
                  {turno.tipo_turno && (
                    <div>
                      <p className="text-sm font-medium">Tipo de turno:</p>
                      <p className="text-sm text-muted-foreground capitalize">{turno.tipo_turno.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {turno.observaciones && (
                    <div>
                      <p className="text-sm font-medium">Observaciones:</p>
                      <p className="text-sm text-muted-foreground">{turno.observaciones}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

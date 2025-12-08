import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface DisponibilidadItem {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

interface SolicitudCambio {
  id: string;
  motivo: string;
  status: string;
  created_at: string;
  fecha_nueva?: string;
}

const diasSemana = [
  { id: 0, label: "Domingo" },
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miércoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sábado" },
];

const horariosOpciones = [
  { inicio: "08:00", fin: "14:00", label: "Mañana (08:00 - 14:00)" },
  { inicio: "14:00", fin: "20:00", label: "Tarde (14:00 - 20:00)" },
  { inicio: "20:00", fin: "02:00", label: "Noche (20:00 - 02:00)" },
];

export default function Disponibilidad() {
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadItem[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudCambio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingSolicitud, setSendingSolicitud] = useState(false);

  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [solicitudMotivo, setSolicitudMotivo] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      
      // Cargar disponibilidad actual
      try {
        const dispData = await api.getMiDisponibilidad(token);
        const dispList = Array.isArray(dispData) ? dispData : (dispData?.results || []);
        setDisponibilidades(dispList);
        
        // Marcar días ya configurados
        const diasActivos = dispList.filter((d: DisponibilidadItem) => d.activo).map((d: DisponibilidadItem) => d.dia_semana);
        setDiasSeleccionados(diasActivos);
      } catch (e) {
        console.warn('No se pudo cargar disponibilidad:', e);
      }

      // Cargar solicitudes de cambio
      try {
        const solData = await api.getSolicitudesCambio(token);
        const solList = Array.isArray(solData) ? solData : (solData?.results || []);
        setSolicitudes(solList);
      } catch (e) {
        console.warn('No se pudieron cargar solicitudes:', e);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiaChange = (diaId: number) => {
    setDiasSeleccionados((prev) =>
      prev.includes(diaId) ? prev.filter((d) => d !== diaId) : [...prev, diaId]
    );
  };

  const handleSubmitDisponibilidad = async () => {
    if (diasSeleccionados.length === 0 || !horarioSeleccionado) {
      toast({
        title: "Datos incompletos",
        description: "Selecciona al menos un día y un horario",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const horario = horariosOpciones.find(h => h.label === horarioSeleccionado);

      if (!horario) {
        throw new Error("Horario no válido");
      }

      // Crear disponibilidad para cada día seleccionado
      for (const dia of diasSeleccionados) {
        await api.saveDisponibilidad({
          dia_semana: dia,
          hora_inicio: horario.inicio,
          hora_fin: horario.fin,
          activo: true
        }, token);
      }

      toast({
        title: "Disponibilidad guardada",
        description: "Tu disponibilidad ha sido actualizada correctamente"
      });

      await loadData();
    } catch (err: any) {
      console.error('Error saving disponibilidad:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo guardar la disponibilidad",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDisponibilidad = async (id: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      await api.deleteDisponibilidad(id, token);
      toast({
        title: "Disponibilidad eliminada",
        description: "Se ha eliminado la disponibilidad correctamente"
      });
      await loadData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo eliminar la disponibilidad",
        variant: "destructive"
      });
    }
  };

  const handleSubmitSolicitud = async () => {
    if (!solicitudMotivo.trim()) {
      toast({
        title: "Motivo requerido",
        description: "Por favor describe el motivo de tu solicitud",
        variant: "destructive"
      });
      return;
    }

    setSendingSolicitud(true);
    try {
      const token = localStorage.getItem('token') || '';
      await api.createSolicitudCambio({
        motivo: solicitudMotivo,
      }, token);

      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de cambio ha sido enviada al administrador"
      });

      setSolicitudMotivo("");
      await loadData();
    } catch (err: any) {
      console.error('Error sending solicitud:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo enviar la solicitud",
        variant: "destructive"
      });
    } finally {
      setSendingSolicitud(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'pendiente': 'bg-warning',
      'aprobada': 'bg-success',
      'rechazada': 'bg-destructive',
    };
    return map[status] || 'bg-muted';
  };

  const getDiaNombre = (dia: number) => {
    return diasSemana.find(d => d.id === dia)?.label || `Día ${dia}`;
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
        <h1 className="text-3xl font-bold">Gestión de Disponibilidad</h1>
        <p className="text-muted-foreground">Informa tus horarios disponibles y solicita cambios de turno</p>
      </div>

      {/* Disponibilidad actual */}
      {disponibilidades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tu Disponibilidad Actual</CardTitle>
            <CardDescription>Horarios que has registrado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {disponibilidades.map((disp) => (
                <div key={disp.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{getDiaNombre(disp.dia_semana)}</span>
                    <span className="text-muted-foreground ml-2">
                      {disp.hora_inicio} - {disp.hora_fin}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDisponibilidad(disp.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            {diasSemana.slice(1, 7).map((dia) => (
              <div key={dia.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`dia-${dia.id}`}
                  checked={diasSeleccionados.includes(dia.id)}
                  onCheckedChange={() => handleDiaChange(dia.id)}
                />
                <Label htmlFor={`dia-${dia.id}`} className="font-normal cursor-pointer">
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
              Horario Disponible
            </CardTitle>
            <CardDescription>Selecciona el horario en que puedes trabajar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={horarioSeleccionado} onValueChange={setHorarioSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                {horariosOpciones.map((horario) => (
                  <SelectItem key={horario.label} value={horario.label}>
                    {horario.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSubmitDisponibilidad} 
              className="w-full mt-4"
              disabled={saving || diasSeleccionados.length === 0 || !horarioSeleccionado}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Disponibilidad"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Solicitar Cambio de Turno / Vacaciones / Licencia
            </CardTitle>
            <CardDescription>Describe el cambio que necesitas realizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ejemplo: Necesito cambiar mi turno del 20/01 en la mañana por uno en la tarde debido a una cita médica personal..."
              value={solicitudMotivo}
              onChange={(e) => setSolicitudMotivo(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleSubmitSolicitud} 
              className="w-full"
              disabled={sendingSolicitud || !solicitudMotivo.trim()}
            >
              {sendingSolicitud ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </Button>

            {solicitudes.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Tus Solicitudes</h3>
                <div className="space-y-2">
                  {solicitudes.map((sol) => (
                    <div key={sol.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs text-white ${getStatusBadge(sol.status)}`}>
                          {sol.status.charAt(0).toUpperCase() + sol.status.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(sol.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{sol.motivo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

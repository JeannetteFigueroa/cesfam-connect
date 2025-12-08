import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Pill, Activity, FileCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  status: string;
  medico?: {
    especialidad: string;
    user?: {
      nombre: string;
      apellido: string;
    };
  };
}

interface Documento {
  id: string;
  tipo_documento: string;
  contenido: string;
  archivo_url: string;
  created_at: string;
  cita_id: string;
}

const Historial = () => {
  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      
      // Cargar citas del paciente
      const citasData = await api.getCitas(token);
      const citasList = Array.isArray(citasData) ? citasData : (citasData?.results || []);
      setCitas(citasList);

      // Cargar documentos del paciente
      try {
        const docsData = await api.getMisDocumentos(token);
        const docsList = Array.isArray(docsData) ? docsData : (docsData?.results || []);
        setDocumentos(docsList);
      } catch (e) {
        console.warn('No se pudieron cargar documentos:', e);
      }
    } catch (err) {
      console.error('Error loading historial:', err);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial médico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMedicoNombre = (cita: Cita) => {
    if (cita.medico?.user) {
      return `Dr(a). ${cita.medico.user.nombre} ${cita.medico.user.apellido}`;
    }
    return 'Médico no especificado';
  };

  const getEspecialidad = (cita: Cita) => {
    return cita.medico?.especialidad?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Consulta';
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'pendiente': { label: 'Pendiente', className: 'bg-warning' },
      'confirmada': { label: 'Confirmada', className: 'bg-primary' },
      'completada': { label: 'Completada', className: 'bg-success' },
      'cancelada': { label: 'Cancelada', className: 'bg-destructive' },
    };
    return statusMap[status] || { label: status, className: 'bg-muted' };
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getDocumentosByTipo = (tipo: string) => {
    return documentos.filter(d => d.tipo_documento === tipo);
  };

  const handleDownload = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Error",
        description: "No hay archivo disponible para descargar",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const recetas = getDocumentosByTipo('receta');
  const diagnosticos = getDocumentosByTipo('diagnostico');
  const licencias = getDocumentosByTipo('licencia');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Historial Médico</h1>
            <p className="text-muted-foreground">Tu registro completo de atenciones médicas</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Citas Médicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Citas Médicas</span>
              </CardTitle>
              <CardDescription>Registro de tus consultas médicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {citas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes citas registradas
                </p>
              ) : (
                citas.map((cita, index) => {
                  const statusInfo = getStatusBadge(cita.status);
                  return (
                    <div key={cita.id}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                            <Badge className="bg-primary">{formatFecha(cita.fecha)}</Badge>
                            <Badge variant="outline">{cita.hora}</Badge>
                            <Badge variant="outline">{getEspecialidad(cita)}</Badge>
                            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                          </div>
                          <h3 className="font-semibold mb-1">{getMedicoNombre(cita)}</h3>
                          <p className="text-sm text-muted-foreground">{cita.motivo || 'Consulta médica'}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </Button>
                      </div>
                      {index < citas.length - 1 && <Separator className="mt-4" />}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recetas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-accent" />
                <span>Recetas Médicas</span>
              </CardTitle>
              <CardDescription>Medicamentos prescritos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recetas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes recetas registradas
                </p>
              ) : (
                recetas.map((receta, index) => (
                  <div key={receta.id}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-accent">{formatFecha(receta.created_at)}</Badge>
                        </div>
                        <p className="text-sm">{receta.contenido}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(receta.archivo_url)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                    {index < recetas.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Diagnósticos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-success" />
                  <span>Diagnósticos</span>
                </CardTitle>
                <CardDescription>Historial de diagnósticos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {diagnosticos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No tienes diagnósticos registrados
                  </p>
                ) : (
                  diagnosticos.map((diagnostico, index) => (
                    <div key={diagnostico.id}>
                      <Badge className="bg-success mb-2">{formatFecha(diagnostico.created_at)}</Badge>
                      <p className="text-sm">{diagnostico.contenido}</p>
                      {diagnostico.archivo_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleDownload(diagnostico.archivo_url)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      )}
                      {index < diagnosticos.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Licencias Médicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-warning" />
                  <span>Licencias Médicas</span>
                </CardTitle>
                <CardDescription>Registro de licencias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {licencias.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No tienes licencias registradas
                  </p>
                ) : (
                  licencias.map((licencia) => (
                    <div key={licencia.id} className="p-4 bg-muted rounded-lg">
                      <Badge className="bg-warning mb-2">{formatFecha(licencia.created_at)}</Badge>
                      <p className="text-sm mb-2">{licencia.contenido}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(licencia.archivo_url)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Licencia
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Documento {
  id: string;
  tipo_documento: string;
  contenido: string;
  archivo_url: string;
  created_at: string;
  paciente_rut?: string;
}

export default function Documentos() {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [pacienteRut, setPacienteRut] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [documentos, setDocumentos] = useState<Documento[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await api.getDocumentos(token);
      const list = Array.isArray(data) ? data : (data?.results || []);
      // Mostrar solo los últimos 10
      setDocumentos(list.slice(0, 10));
    } catch (err) {
      console.warn('Error loading documentos:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoDocumento || !pacienteRut || !descripcion) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || '';
      const formData = new FormData();
      formData.append('tipo_documento', tipoDocumento);
      formData.append('paciente_rut', pacienteRut);
      formData.append('contenido', descripcion);
      
      if (archivo) {
        formData.append('archivo', archivo);
      }

      await api.uploadDocumento(formData, token);

      toast({
        title: "Documento subido",
        description: "El documento ha sido subido y vinculado al paciente exitosamente"
      });

      // Limpiar formulario
      setTipoDocumento("");
      setPacienteRut("");
      setDescripcion("");
      setArchivo(null);
      
      // Recargar lista
      await loadDocumentos();
    } catch (err: any) {
      console.error('Error uploading documento:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo subir el documento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      'receta': 'Receta',
      'diagnostico': 'Diagnóstico',
      'licencia': 'Licencia',
      'examen': 'Orden de Examen',
      'reporte': 'Reporte',
    };
    return map[tipo] || tipo;
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d MMM yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subir Documentos</h1>
        <p className="text-muted-foreground">Recetas, diagnósticos, licencias y reportes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir Documento
            </CardTitle>
            <CardDescription>Completa los datos del documento a subir</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger id="tipoDocumento">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receta">Receta Médica</SelectItem>
                    <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    <SelectItem value="licencia">Licencia Médica</SelectItem>
                    <SelectItem value="examen">Orden de Examen</SelectItem>
                    <SelectItem value="reporte">Reporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pacienteRut">RUT del Paciente *</Label>
                <Input
                  id="pacienteRut"
                  placeholder="12.345.678-9"
                  value={pacienteRut}
                  onChange={(e) => setPacienteRut(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  El documento se vinculará automáticamente al paciente con este RUT
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción / Contenido *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Detalles del documento, medicamentos, indicaciones, etc."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="archivo">Archivo (opcional)</Label>
                <Input 
                  id="archivo" 
                  type="file" 
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos: PDF, JPG, PNG, DOC, DOCX
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documento
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Recientes
            </CardTitle>
            <CardDescription>Últimos documentos subidos</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDocs ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : documentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay documentos recientes
              </p>
            ) : (
              <div className="space-y-3">
                {documentos.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{getTipoLabel(doc.tipo_documento)}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {doc.contenido}
                      </p>
                      {doc.paciente_rut && (
                        <p className="text-xs text-muted-foreground">
                          RUT: {doc.paciente_rut}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatFecha(doc.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

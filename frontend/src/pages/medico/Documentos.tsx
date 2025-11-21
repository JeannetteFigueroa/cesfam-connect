import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Documentos() {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [pacienteRut, setPacienteRut] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Documento subido exitosamente");
    setTipoDocumento("");
    setPacienteRut("");
    setDescripcion("");
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
                <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger id="tipoDocumento">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receta">Receta Médica</SelectItem>
                    <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    <SelectItem value="licencia">Licencia Médica</SelectItem>
                    <SelectItem value="examen">Orden de Examen</SelectItem>
                    <SelectItem value="reporte">Reporte para Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pacienteRut">RUT del Paciente</Label>
                <Input
                  id="pacienteRut"
                  placeholder="12.345.678-9"
                  value={pacienteRut}
                  onChange={(e) => setPacienteRut(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Detalles adicionales del documento..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="archivo">Archivo</Label>
                <Input id="archivo" type="file" accept=".pdf,.jpg,.png,.doc,.docx" required />
              </div>

              <Button type="submit" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Subir Documento
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
            <div className="space-y-3">
              {[
                { tipo: "Receta", paciente: "María González", fecha: "2025-01-15" },
                { tipo: "Licencia", paciente: "Pedro Ramírez", fecha: "2025-01-14" },
                { tipo: "Diagnóstico", paciente: "Ana Torres", fecha: "2025-01-13" },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{doc.tipo}</p>
                    <p className="text-xs text-muted-foreground">{doc.paciente}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{doc.fecha}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

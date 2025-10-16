import { Download, FileText, Calendar, Pill, Activity, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Historial = () => {
  const historial = {
    citas: [
      { id: 1, fecha: '15 Ene 2025', especialidad: 'Medicina General', medico: 'Dr. Juan Pérez', motivo: 'Control de rutina' },
      { id: 2, fecha: '10 Ene 2025', especialidad: 'Cardiología', medico: 'Dra. María González', motivo: 'Control presión arterial' },
      { id: 3, fecha: '05 Ene 2025', especialidad: 'Medicina General', medico: 'Dr. Juan Pérez', motivo: 'Consulta por gripe' },
    ],
    recetas: [
      { id: 1, fecha: '15 Ene 2025', medicamento: 'Paracetamol 500mg', dosis: '1 cada 8 horas', duracion: '7 días' },
      { id: 2, fecha: '10 Ene 2025', medicamento: 'Losartán 50mg', dosis: '1 al día', duracion: '30 días' },
    ],
    diagnosticos: [
      { id: 1, fecha: '15 Ene 2025', diagnostico: 'Estado general saludable', codigo: 'Z00.0' },
      { id: 2, fecha: '10 Ene 2025', diagnostico: 'Hipertensión arterial esencial', codigo: 'I10' },
    ],
    licencias: [
      { id: 1, fecha: '05 Ene 2025', tipo: 'Licencia Médica', dias: '3 días', motivo: 'Síndrome gripal' },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Historial Médico</h1>
            <p className="text-muted-foreground">Tu registro completo de atenciones médicas</p>
          </div>
          <Button className="gradient-primary w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Descargar Historial Completo
          </Button>
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
              {historial.citas.map((cita, index) => (
                <div key={cita.id}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-primary">{cita.fecha}</Badge>
                        <Badge variant="outline">{cita.especialidad}</Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{cita.medico}</h3>
                      <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </div>
                  {index < historial.citas.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
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
              {historial.recetas.map((receta, index) => (
                <div key={receta.id}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-accent">{receta.fecha}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{receta.medicamento}</h3>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Dosis: </span>
                          <span>{receta.dosis}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duración: </span>
                          <span>{receta.duracion}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                  {index < historial.recetas.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
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
                {historial.diagnosticos.map((diagnostico, index) => (
                  <div key={diagnostico.id}>
                    <Badge className="bg-success mb-2">{diagnostico.fecha}</Badge>
                    <h3 className="font-semibold mb-1">{diagnostico.diagnostico}</h3>
                    <p className="text-sm text-muted-foreground">Código CIE-10: {diagnostico.codigo}</p>
                    {index < historial.diagnosticos.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
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
                {historial.licencias.map((licencia) => (
                  <div key={licencia.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-warning">{licencia.fecha}</Badge>
                      <Badge variant="outline">{licencia.dias}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{licencia.tipo}</h3>
                    <p className="text-sm text-muted-foreground">{licencia.motivo}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Licencia
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;

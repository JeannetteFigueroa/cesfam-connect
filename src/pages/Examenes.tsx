import { useState } from 'react';
import { Microscope, Scan, Activity, Hash, ArrowLeft, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Examenes = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [searchEpisodio, setSearchEpisodio] = useState('');

  const categories = [
    { id: 'laboratorio', label: 'Laboratorio', icon: Microscope, color: 'bg-blue-100 text-blue-700' },
    { id: 'imagenologia', label: 'Imagenología', icon: Scan, color: 'bg-green-100 text-green-700' },
    { id: 'procedimientos', label: 'Procedimientos', icon: Activity, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'episodio', label: 'Recuperación N° de episodio', icon: Hash, color: 'bg-purple-100 text-purple-700' },
  ];

  const examenes = {
    laboratorio: [
      { nombre: 'Hemograma Completo', fecha: '10 Ene 2025', estado: 'Disponible' },
      { nombre: 'Perfil Lipídico', fecha: '05 Ene 2025', estado: 'Disponible' },
    ],
    imagenologia: [
      { nombre: 'Radiografía de Tórax', fecha: '08 Ene 2025', estado: 'Disponible' },
      { nombre: 'Ecografía Abdominal', fecha: '03 Ene 2025', estado: 'En Proceso' },
    ],
    procedimientos: [
      { nombre: 'Electrocardiograma', fecha: '15 Ene 2025', estado: 'Disponible' },
      { nombre: 'Espirometría', fecha: '12 Ene 2025', estado: 'En Proceso' },
    ],
  };

  // Pantalla principal de selección de tipo de examen
  if (!selectedTab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Selecciona el tipo de examen</h1>
          <p className="text-muted-foreground mb-10">Elige el tipo de examen que deseas consultar o descargar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className={`cursor-pointer hover:shadow-lg transition-transform hover:scale-105 p-6 ${cat.color}`}
                  onClick={() => setSelectedTab(cat.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-white/80 rounded-full p-4 shadow">
                      <Icon className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{cat.label}</CardTitle>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p>
              ¿Tienes problemas? Escríbenos a{' '}
              <a href="mailto:example@cesfaminfo.cl" className="text-primary underline">
                example@cesfaminfo.cl
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Contenido de cada tipo de examen
  const Icon = categories.find((c) => c.id === selectedTab)?.icon;
  const label = categories.find((c) => c.id === selectedTab)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Button variant="ghost" onClick={() => setSelectedTab(null)}>
            <ArrowLeft className="w-5 h-5 mr-1" /> Volver
          </Button>
          <h2 className="text-2xl font-bold text-secondary">{label}</h2>
        </div>

        {selectedTab !== 'episodio' ? (
          <div className="space-y-4">
            {examenes[selectedTab].map((examen, index) => (
              <Card key={index} className="hover:shadow-md transition-smooth">
                <CardContent className="p-6 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{examen.nombre}</h3>
                    <p className="text-sm text-muted-foreground">Fecha: {examen.fecha}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" /> Ver
                    </Button>
                    <Button className="bg-primary" size="sm">
                      <Download className="w-4 h-4 mr-2" /> Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recuperar Número de Episodio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Ingresa tu RUT o número de atención"
                value={searchEpisodio}
                onChange={(e) => setSearchEpisodio(e.target.value)}
              />
              <Button className="bg-primary w-full">Buscar</Button>

              {searchEpisodio && (
                <div className="bg-muted p-4 rounded-lg mt-4 space-y-2">
                  <p className="font-semibold">Episodio Encontrado</p>
                  <p>N° Episodio: <strong>EP-2025-001234</strong></p>
                  <p>Fecha: 15 Enero 2025</p>
                  <p>Centro Médico: CESFAM La Granja</p>
                  <Button className="mt-2 w-full bg-primary">
                    <Download className="w-4 h-4 mr-2" /> Descargar Comprobante
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Examenes;

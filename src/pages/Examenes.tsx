import { useState } from 'react';
import { FileText, Download, Eye, Search, Microscope, Scan, Activity, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Examenes = () => {
  const [searchEpisodio, setSearchEpisodio] = useState('');

  const examenes = {
    laboratorio: [
      { id: 1, nombre: 'Hemograma Completo', fecha: '10 Ene 2025', estado: 'Disponible' },
      { id: 2, nombre: 'Perfil Bioquímico', fecha: '05 Ene 2025', estado: 'Disponible' },
      { id: 3, nombre: 'Examen de Orina', fecha: '28 Dic 2024', estado: 'Disponible' },
    ],
    imagenologia: [
      { id: 4, nombre: 'Radiografía de Tórax', fecha: '12 Ene 2025', estado: 'Disponible' },
      { id: 5, nombre: 'Ecografía Abdominal', fecha: '08 Ene 2025', estado: 'Disponible' },
      { id: 6, nombre: 'TAC Cerebral', fecha: '02 Ene 2025', estado: 'En Proceso' },
    ],
    procedimientos: [
      { id: 7, nombre: 'Electrocardiograma', fecha: '15 Ene 2025', estado: 'Disponible' },
      { id: 8, nombre: 'Espirometría', fecha: '10 Ene 2025', estado: 'Disponible' },
      { id: 9, nombre: 'Holter 24 horas', fecha: '05 Ene 2025', estado: 'En Proceso' },
    ]
  };

  const categories = [
    { id: 'laboratorio', label: 'Laboratorio', icon: Microscope },
    { id: 'imagenologia', label: 'Imagenología', icon: Scan },
    { id: 'procedimientos', label: 'Procedimientos', icon: Activity },
    { id: 'episodio', label: 'Recuperar N° Episodio', icon: Hash }
  ];

  const renderExamenesTable = (tipo: 'laboratorio' | 'imagenologia' | 'procedimientos') => {
    return (
      <div className="space-y-4">
        {examenes[tipo].map((examen) => (
          <Card key={examen.id} className="hover:shadow-md transition-smooth">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{examen.nombre}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Fecha: {examen.fecha}</span>
                    <Badge className={examen.estado === 'Disponible' ? 'bg-success' : 'bg-warning'}>
                      {examen.estado}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button className="bg-primary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Exámenes Médicos</h1>
          <p className="text-muted-foreground">Consulta y descarga tus resultados médicos</p>
        </div>

        <Tabs defaultValue="laboratorio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex items-center space-x-2 py-3"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="laboratorio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Microscope className="w-5 h-5 text-primary" />
                  <span>Exámenes de Laboratorio</span>
                </CardTitle>
                <CardDescription>
                  Análisis clínicos y pruebas de laboratorio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderExamenesTable('laboratorio')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imagenologia">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scan className="w-5 h-5 text-primary" />
                  <span>Imagenología</span>
                </CardTitle>
                <CardDescription>
                  Radiografías, ecografías y estudios por imágenes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderExamenesTable('imagenologia')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procedimientos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Procedimientos</span>
                </CardTitle>
                <CardDescription>
                  Estudios funcionales y procedimientos diagnósticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderExamenesTable('procedimientos')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="episodio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-primary" />
                  <span>Recuperar Número de Episodio</span>
                </CardTitle>
                <CardDescription>
                  Busca y recupera el número de episodio de tu atención médica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ingresa tu RUT o número de atención para buscar el episodio asociado
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ej: 12.345.678-9"
                      value={searchEpisodio}
                      onChange={(e) => setSearchEpisodio(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="bg-primary">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>

                {searchEpisodio && (
                  <div className="p-6 bg-muted rounded-lg space-y-4">
                    <div className="flex items-center space-x-2 text-success">
                      <FileText className="w-5 h-5" />
                      <span className="font-semibold">Episodio Encontrado</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">N° Episodio</p>
                        <p className="font-semibold text-lg">EP-2025-001234</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Fecha de Atención</p>
                        <p className="font-semibold">15 Enero 2025</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Centro Médico</p>
                        <p className="font-semibold">CESFAM La Granja</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Profesional</p>
                        <p className="font-semibold">Dr. Juan Pérez</p>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto bg-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Comprobante
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Examenes;

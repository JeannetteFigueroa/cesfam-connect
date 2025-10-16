import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Mapa = () => {
  const cesfams = [
    {
      id: 1,
      nombre: 'CESFAM La Granja',
      direccion: 'Av. La Granja 1234, Santiago',
      telefono: '+56 2 2222 1111',
      correo: 'lagranja@cesfam.cl',
      horario: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
      region: 'Metropolitana',
      estado: 'Abierto'
    },
    {
      id: 2,
      nombre: 'CESFAM Maipú',
      direccion: 'Calle Principal 567, Maipú',
      telefono: '+56 2 2222 2222',
      correo: 'maipu@cesfam.cl',
      horario: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
      region: 'Metropolitana',
      estado: 'Abierto'
    },
    {
      id: 3,
      nombre: 'CESFAM San Bernardo',
      direccion: 'Av. O\'Higgins 890, San Bernardo',
      telefono: '+56 2 2222 3333',
      correo: 'sanbernardo@cesfam.cl',
      horario: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
      region: 'Metropolitana',
      estado: 'Abierto'
    },
    {
      id: 4,
      nombre: 'CESFAM Valparaíso Centro',
      direccion: 'Plaza Sotomayor 123, Valparaíso',
      telefono: '+56 32 2222 4444',
      correo: 'valpocentro@cesfam.cl',
      horario: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
      region: 'Valparaíso',
      estado: 'Abierto'
    },
    {
      id: 5,
      nombre: 'CESFAM Concepción Norte',
      direccion: 'Av. Paicaví 456, Concepción',
      telefono: '+56 41 2222 5555',
      correo: 'concepcionnorte@cesfam.cl',
      horario: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
      region: 'Biobío',
      estado: 'Abierto'
    },
    {
      id: 6,
      nombre: 'CESFAM La Serena',
      direccion: 'Calle Brasil 789, La Serena',
      telefono: '+56 51 2222 6666',
      correo: 'laserena@cesfam.cl',
      horario: 'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
      region: 'Coquimbo',
      estado: 'Abierto'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Centros Médicos</h1>
          <p className="text-muted-foreground">Encuentra el CESFAM más cercano a tu ubicación</p>
        </div>

        {/* Mapa simulado */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-64 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 relative flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mapa Interactivo</h3>
              <p className="text-muted-foreground mb-4">Visualización de CESFAM en Chile</p>
              <Button className="bg-primary">
                <Navigation className="w-4 h-4 mr-2" />
                Usar Mi Ubicación
              </Button>
            </div>
            {/* Simulación de pines en el mapa */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-destructive rounded-full animate-pulse flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-destructive rounded-full animate-pulse flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute bottom-1/4 left-1/2 w-8 h-8 bg-destructive rounded-full animate-pulse flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        {/* Lista de CESFAM */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cesfams.map((cesfam) => (
            <Card key={cesfam.id} className="hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-success">{cesfam.estado}</Badge>
                  <Badge variant="outline">{cesfam.region}</Badge>
                </div>
                <CardTitle className="text-xl">{cesfam.nombre}</CardTitle>
                <CardDescription className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{cesfam.direccion}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>{cesfam.telefono}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>{cesfam.correo}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 text-accent" />
                  <span>{cesfam.horario}</span>
                </div>
                <Button className="w-full mt-4 gradient-primary">
                  <Navigation className="w-4 h-4 mr-2" />
                  Cómo Llegar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mapa;

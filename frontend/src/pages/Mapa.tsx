import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const cesfams = [
  {
    id: 1,
    nombre: 'CESFAM Madre Teresa de Calcuta',
    direccion: 'Av. Argentina 2830, Valparaíso',
    telefono: '+56 32 2255800',
    correo: 'cesfam.mtc@ssvalparaiso.cl',
    horario: 'Lunes a Viernes: 08:00 - 17:00',
    region: 'Valparaíso',
    estado: 'Operativo',
    lat: -33.0458,
    lng: -71.6197
  },
  {
    id: 2,
    nombre: 'CESFAM Recreo',
    direccion: 'Calle Recreo 1550, Viña del Mar',
    telefono: '+56 32 2185400',
    correo: 'cesfam.recreo@ssvalparaiso.cl',
    horario: 'Lunes a Viernes: 08:00 - 20:00, Sábados: 09:00 - 13:00',
    region: 'Valparaíso',
    estado: 'Operativo',
    lat: -33.0239,
    lng: -71.5519
  },
  {
    id: 3,
    nombre: 'CESFAM Los Castaños',
    direccion: 'Los Castaños 1444, Viña del Mar',
    telefono: '+56 32 2672900',
    correo: 'cesfam.castanos@ssvalparaiso.cl',
    horario: 'Lunes a Viernes: 08:00 - 17:00',
    region: 'Valparaíso',
    estado: 'Operativo',
    lat: -33.0364,
    lng: -71.5398
  },
  {
    id: 4,
    nombre: 'CESFAM La Faena',
    direccion: 'Av. La Faena 850, Peñalolén',
    telefono: '+56 2 2522 8200',
    correo: 'cesfam.lafaena@ssms.cl',
    horario: 'Lunes a Viernes: 08:00 - 20:00',
    region: 'Metropolitana',
    estado: 'Operativo',
    lat: -33.4889,
    lng: -70.5782
  },
  {
    id: 5,
    nombre: 'CESFAM Barón',
    direccion: 'Tomás Ramos 134, Valparaíso',
    telefono: '+56 32 2255700',
    correo: 'cesfam.baron@ssvalparaiso.cl',
    horario: 'Lunes a Viernes: 08:00 - 17:00',
    region: 'Valparaíso',
    estado: 'Operativo',
    lat: -33.0384,
    lng: -71.6270
  },
  {
    id: 6,
    nombre: 'CESFAM Placeres',
    direccion: 'Av. Placeres 2260, Valparaíso',
    telefono: '+56 32 2255600',
    correo: 'cesfam.placeres@ssvalparaiso.cl',
    horario: 'Lunes a Viernes: 08:00 - 20:00',
    region: 'Valparaíso',
    estado: 'Operativo',
    lat: -33.0294,
    lng: -71.6417
  },
  {
    id: 7,
    nombre: 'CESFAM Cordillera Andina',
    direccion: 'Av. Cordillera 3456, Puente Alto',
    telefono: '+56 2 2522 9100',
    correo: 'cesfam.cordillera@ssms.cl',
    horario: 'Lunes a Viernes: 08:00 - 18:00',
    region: 'Metropolitana',
    estado: 'Operativo',
    lat: -33.6103,
    lng: -70.5756
  }
];

const Mapa = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Chile
    const map = L.map(mapContainerRef.current).setView([-33.4489, -70.6693], 7);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers for each CESFAM
    cesfams.forEach((cesfam) => {
      const marker = L.marker([cesfam.lat, cesfam.lng]).addTo(map);
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${cesfam.nombre}</h3>
          <p class="text-sm">${cesfam.direccion}</p>
          <p class="text-sm">${cesfam.telefono}</p>
        </div>
      `);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Centros Médicos</h1>
          <p className="text-muted-foreground">Encuentra el CESFAM más cercano a tu ubicación</p>
        </div>

        {/* Mapa OpenStreetMap */}
        <Card className="mb-8 overflow-hidden">
          <div ref={mapContainerRef} className="h-96 w-full" />
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
                <Button
                  className="w-full mt-4 gradient-primary"
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.setView([cesfam.lat, cesfam.lng], 15);
                    }
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Ver en Mapa
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

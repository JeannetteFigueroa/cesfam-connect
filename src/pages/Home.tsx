import { Calendar, FileText, MapPin, Users, Activity, Clock, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      icon: Calendar,
      title: 'Agendar Cita Médica',
      description: 'Reserva tu hora con especialistas de forma rápida y sencilla',
      link: '/agendar',
      color: 'text-primary'
    },
    {
      icon: FileText,
      title: 'Consultar Resultados',
      description: 'Accede a tus exámenes de laboratorio e imagenología',
      link: '/examenes',
      color: 'text-accent'
    },
    {
      icon: Activity,
      title: 'Historial Médico',
      description: 'Revisa tu historial completo de atenciones y tratamientos',
      link: '/historial',
      color: 'text-success'
    },
    {
      icon: MapPin,
      title: 'CESFAM Cercanos',
      description: 'Encuentra el centro de salud más próximo a tu ubicación',
      link: '/mapa',
      color: 'text-warning'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Atención 24/7',
      description: 'Urgencias disponibles todos los días del año'
    },
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Tus datos médicos están protegidos'
    },
    {
      icon: Users,
      title: 'Equipo Profesional',
      description: 'Médicos especializados y comprometidos'
    }
  ];

  const healthTips = [
    {
      title: 'Prevención de Gripe',
      description: 'Consejos para mantenerte saludable durante la temporada de invierno',
      date: '15 Ene 2025'
    },
    {
      title: 'Alimentación Saludable',
      description: 'Guía completa para una dieta balanceada y nutritiva',
      date: '12 Ene 2025'
    },
    {
      title: 'Salud Mental',
      description: 'La importancia del bienestar emocional en tu vida diaria',
      date: '10 Ene 2025'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 shadow-glow">
            <Heart className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tu Salud es Nuestra Prioridad
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Accede a servicios médicos de calidad, consulta tus exámenes y agenda citas en línea
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90">
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/registro">Registro</Link>
                </Button>
              </>
            ) : (
              <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90">
                <Link to="/agendar">Agendar Hora Médica</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tu salud en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link key={index} to={isAuthenticated ? service.link : '/login'}>
                  <Card className="h-full hover:shadow-lg transition-smooth hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${service.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Consejos de Salud
            </h2>
            <p className="text-lg text-muted-foreground">
              Información útil para cuidar tu bienestar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-smooth">
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">{tip.date}</div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0 text-primary">
                    Leer más →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para cuidar tu salud?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Únete a miles de personas que confían en MiCESFAM para su bienestar
          </p>
          {!isAuthenticated && (
            <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90">
              <Link to="/login">Comenzar Ahora</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

import { Users, ClipboardCheck, CalendarCog, FileBarChart, Shield, Activity, Settings, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const HomeAdmin = () => {
  const { isAuthenticated } = useAuth();

  const adminTools = [
    {
      icon: ClipboardCheck,
      title: 'Gestión de Turnos',
      description: 'Revisa, edita o reasigna los turnos médicos',
      link: '/admin/GestionTurnos',
      color: 'text-accent'
    },
    {
      icon: FileBarChart,
      title: 'Panel de Control',
      description: 'Visualiza datos de rendimiento y atención médica',
      link: '/admin/Dashboard',
      color: 'text-success'
    },
    {
      icon: Settings,
      title: 'Configuración General',
      description: 'Administra opciones y parámetros del sistema',
      link: '/configuracion',
      color: 'text-warning'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Control y Seguridad',
      description: 'Protege la información de usuarios y operaciones'
    },
    {
      icon: Activity,
      title: 'Supervisión en Tiempo Real',
      description: 'Monitorea las operaciones del CESFAM continuamente'
    },
    {
      icon: BarChart3,
      title: 'Toma de Decisiones',
      description: 'Accede a datos clave para mejorar la gestión'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 shadow-glow">
            <CalendarCog className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Panel de Administración
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Supervisa y gestiona el funcionamiento general del CESFAM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90">
              <Link to="/admin/Dashboard">Ir al Panel de Control</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Herramientas */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Herramientas de Administración
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestiona todo el sistema desde un entorno centralizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link key={index} to={isAuthenticated ? tool.link : '/login'}>
                  <Card className="h-full hover:shadow-lg transition-smooth hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${tool.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
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
    </div>
  );
};

export default HomeAdmin;

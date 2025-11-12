import { CalendarCheck, ClipboardList, FileText, Clock, Shield, Users, Stethoscope, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const HomeMedico = () => {
  const { user } = useAuth();

  const tools = [
    {
      icon: ClipboardList,
      title: 'Turnos Asignados',
      description: 'Revisa y gestiona tus turnos médicos asignados',
      link: '/medico/Turnos',
      color: 'text-primary'
    },
    {
      icon: FileText,
      title: 'Historial de Pacientes',
      description: 'Accede a las fichas y antecedentes de tus pacientes',
      link: '/medico/HistorialPacientes',
      color: 'text-accent'
    },
    {
      icon: Stethoscope,
      title: 'Documentos Médicos',
      description: 'Sube y consulta informes, recetas y resultados clínicos',
      link: '/medico/Documentos',
      color: 'text-success'
    },
    {
      icon: CalendarCheck,
      title: 'Disponibilidad',
      description: 'Actualiza tus horarios y disponibilidad para atención',
      link: '/medico/Disponibilidad',
      color: 'text-warning'
    }
  ];

  const features = [
    {
      icon: Activity,
      title: 'Seguimiento Continuo',
      description: 'Monitorea el estado y evolución de tus pacientes'
    },
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Tus datos y los de tus pacientes están protegidos'
    },
    {
      icon: Users,
      title: 'Colaboración',
      description: 'Comparte información de manera segura con el equipo médico'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 shadow-glow">
            <Stethoscope className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido al Panel Médico
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Administra tus pacientes, documentos y turnos desde una sola plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90">
              <Link to="/medico/Turnos">Ir a mis Turnos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Herramientas */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Herramientas Médicas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accede a las funciones que facilitan tu labor médica diaria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link key={index} to={user ? tool.link : '/login'}>
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

export default HomeMedico;

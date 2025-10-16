import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, MapPin, FileText, Calendar, Settings, LogOut, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navItems = isAuthenticated ? [
    { name: 'Inicio', path: '/', icon: Activity },
    { name: 'Cuenta', path: '/cuenta', icon: User },
    { name: 'Mapa', path: '/mapa', icon: MapPin },
    { name: 'Exámenes', path: '/examenes', icon: FileText },
    { name: 'Historial', path: '/historial', icon: FileText },
    { name: 'Agendar Hora', path: '/agendar', icon: Calendar },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ] : [
    { name: 'Inicio', path: '/', icon: Activity },
    { name: 'Mapa', path: '/mapa', icon: MapPin },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-secondary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-glow transition-transform group-hover:scale-110">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-secondary-foreground">MiCESFAM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                    isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-secondary-foreground hover:bg-primary/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-secondary-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Salir</span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="ml-4 bg-primary hover:bg-primary/90"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-secondary-foreground hover:bg-primary/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-lg border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${
                    isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-secondary-foreground hover:bg-primary/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Salir</span>
              </button>
            ) : (
              <Button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full mt-2 bg-primary hover:bg-primary/90"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

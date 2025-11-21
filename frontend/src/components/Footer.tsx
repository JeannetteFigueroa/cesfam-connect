import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Acerca de */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">MiCESFAM</h3>
            <p className="text-sm opacity-90">
              Tu salud es nuestra prioridad. Accede a servicios médicos de calidad en tu Centro de Salud Familiar.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/mapa" className="hover:text-primary transition-colors">Centros Médicos</Link>
              </li>
              <li>
                <Link to="/agendar" className="hover:text-primary transition-colors">Agendar Hora</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>contacto@micesfam.cl</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>+56 2 2222 3333</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Santiago, Región Metropolitana, Chile</span>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Horario de Atención</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span className="text-primary">8:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span className="text-primary">9:00 - 14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span className="text-muted-foreground">Cerrado</span>
              </li>
              <li className="mt-4 text-xs opacity-75">
                *Urgencias 24/7 disponibles
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm opacity-75">
              © 2025 MiCESFAM. Todos los derechos reservados.
            </p>
            <p className="text-sm opacity-75 flex items-center">
              Desarrollado con <Heart className="w-4 h-4 mx-1 text-destructive" /> por el Equipo 7 (JFKDVC)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

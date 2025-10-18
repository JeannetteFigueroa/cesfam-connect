import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(correo, password);

      if (success) {
        toast.success("Inicio de sesión exitoso 🎉");

        // Recuperar datos del usuario desde localStorage
        const storedUser = localStorage.getItem("cesfam_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);

          // Redirección según rol
          switch (user.role) {
            case "paciente":
              navigate("/paciente/home");
              break;
            case "medico":
              navigate("/medico/home"); // Cambié la ruta a la correcta
              break;
            case "admin":
              navigate("/admin/home");
              break;
            default:
              navigate("/");
          }
        }
      } else {
        toast.error("Correo o contraseña incorrectos ❌");
      }
    } catch (err) {
      toast.error("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-glow mb-4">
            <Activity className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Bienvenido a MiCESFAM</h1>
          <p className="text-muted-foreground">Ingresa a tu cuenta para continuar</p>
        </div>

        {/* Tarjeta de Login */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede con tu correo y contraseña
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo correo */}
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="correo"
                    type="email"
                    placeholder="tu@correo.cl"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Campo contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Botón */}
              <Button
                type="submit"
                className="w-full gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              {/* Enlace de recuperación */}
              <div className="text-center space-y-2">
                <a href="#" className="text-sm text-primary hover:underline block">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>

            {/* Usuarios de prueba */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">Usuarios de prueba:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Paciente:</strong> paciente@cesfam.cl / paciente123</p>
                <p><strong>Médico:</strong> medico@cesfam.cl / medico123</p>
                <p><strong>Admin:</strong> admin@cesfam.cl / admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

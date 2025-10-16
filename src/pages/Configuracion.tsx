import { Bell, Lock, Globe, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Configuracion = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Tus preferencias han sido actualizadas",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia en MiCESFAM</p>
        </div>

        <div className="grid gap-6">
          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Notificaciones</span>
              </CardTitle>
              <CardDescription>Gestiona cómo quieres recibir actualizaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por correo</Label>
                  <p className="text-sm text-muted-foreground">Recibe recordatorios de citas por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios de exámenes</Label>
                  <p className="text-sm text-muted-foreground">Avisos cuando tus resultados estén listos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Consejos de salud</Label>
                  <p className="text-sm text-muted-foreground">Recibe tips y recomendaciones médicas</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-primary" />
                <span>Seguridad</span>
              </CardTitle>
              <CardDescription>Protege tu cuenta y datos personales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Contraseña actual</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Nueva contraseña</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar nueva contraseña</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button className="bg-primary">
                  Cambiar Contraseña
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Preferencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span>Preferencias</span>
              </CardTitle>
              <CardDescription>Personaliza la apariencia y el idioma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-primary" />
                  <div>
                    <Label>Modo oscuro</Label>
                    <p className="text-sm text-muted-foreground">Activa el tema oscuro</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  <Switch />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Idioma</Label>
                <select className="w-full p-2 border rounded-lg bg-background">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Guardar Cambios */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSave} className="gradient-primary">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;

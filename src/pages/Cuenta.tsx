import { useState } from 'react';
import { User, Mail, Phone, CreditCard, Edit2, Save, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';

const Cuenta = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    telefono: user?.telefono || '',
  });

  const handleSave = () => {
    toast({
      title: "Cambios guardados",
      description: "Tu información ha sido actualizada exitosamente",
    });
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    const roleColors = {
      paciente: 'bg-primary',
      medico: 'bg-accent',
      admin: 'bg-warning'
    };
    
    return (
      <Badge className={`${roleColors[user?.role || 'paciente']} text-white`}>
        {user?.role === 'paciente' ? 'Paciente' : user?.role === 'medico' ? 'Médico' : 'Administrador'}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Mi Cuenta</h1>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>

        <div className="grid gap-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Datos de tu cuenta en MiCESFAM</CardDescription>
                </div>
                {getRoleBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.nombre}</h3>
                  <p className="text-muted-foreground">{user?.correo}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  {isEditing ? (
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>RUT</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.rut}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.correo}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  {isEditing ? (
                    <Input
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.telefono || 'No registrado'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-success hover:bg-success/90">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-primary">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar Información
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Credencial Digital */}
          <Card>
            <CardHeader>
              <CardTitle>Credencial Digital</CardTitle>
              <CardDescription>Tu identificación médica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-primary text-white p-6 rounded-xl">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm opacity-75 mb-1">MiCESFAM</p>
                    <p className="text-2xl font-bold">{user?.nombre}</p>
                  </div>
                  <User className="w-12 h-12" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75">RUT</p>
                    <p className="font-semibold">{user?.rut}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Tipo</p>
                    <p className="font-semibold">{user?.role === 'paciente' ? 'Paciente' : user?.role === 'medico' ? 'Médico' : 'Administrador'}</p>
                  </div>
                </div>
                <div className="mt-6 bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center">
                    <CreditCard className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-xs mt-2 opacity-75">Código QR de identificación</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Código QR */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Código QR Personal
              </CardTitle>
              <CardDescription>
                Código único con tu información personal y CESFAM
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG 
                  value={JSON.stringify({
                    nombre: user?.nombre,
                    rut: user?.rut,
                    correo: user?.correo,
                    role: user?.role,
                    cesfam: "CESFAM Madre Teresa de Calcuta"
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Escanea este código para acceder a tu información personal
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cuenta;

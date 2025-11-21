import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, CreditCard, Edit2, Save, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const Cuenta = () => {
  const { user, userRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    // Use user data from context
    setProfile(user);
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      celular: user.celular || ''
    });
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    // TODO: Implement update via Django API
    toast.info('Funcionalidad de actualización en desarrollo');
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    const roleColors = {
      paciente: 'bg-primary',
      medico: 'bg-accent',
      admin: 'bg-warning'
    };
    
    return (
      <Badge className={`${roleColors[userRole || 'paciente']} text-white`}>
        {userRole === 'paciente' ? 'Paciente' : userRole === 'medico' ? 'Médico' : 'Administrador'}
      </Badge>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Mi Cuenta</h1>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>

        <div className="grid gap-6">
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{profile?.nombre} {profile?.apellido}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  {isEditing ? (
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{profile?.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Apellido</Label>
                  {isEditing ? (
                    <Input
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{profile?.apellido}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Documento</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span>{profile?.documento}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  {isEditing ? (
                    <Input
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profile?.celular || 'No registrado'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Nacimiento</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span>{profile?.fecha_nacimiento}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar Información
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credencial Digital</CardTitle>
              <CardDescription>Tu identificación médica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-xl">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm opacity-75 mb-1">MiCESFAM</p>
                    <p className="text-2xl font-bold">{profile?.nombre} {profile?.apellido}</p>
                  </div>
                  <UserIcon className="w-12 h-12" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Documento</p>
                    <p className="font-semibold">{profile?.documento}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Tipo</p>
                    <p className="font-semibold">
                      {userRole === 'paciente' ? 'Paciente' : userRole === 'medico' ? 'Médico' : 'Administrador'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    nombre: `${profile?.nombre} ${profile?.apellido}`,
                    documento: profile?.documento,
                    email: user?.email,
                    role: userRole
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

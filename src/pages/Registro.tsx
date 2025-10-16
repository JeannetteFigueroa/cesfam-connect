import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const cesfams = [
  "CESFAM Madre Teresa de Calcuta",
  "CESFAM Recreo",
  "CESFAM Los Castaños",
  "CESFAM La Faena",
  "CESFAM Barón",
  "CESFAM Placeres",
  "CESFAM Cordillera Andina"
];

const comunas = [
  "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón",
  "Santiago", "Providencia", "Las Condes", "La Florida", "Maipú",
  "Puente Alto", "San Bernardo", "Ñuñoa", "Peñalolén", "La Reina"
];

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<"rut" | "pasaporte">("rut");
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    documento: "",
    cesfam: "",
    comuna: "",
    direccion: "",
    celular: "",
    correo: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    // Aquí se conectará con el backend Django/MySQL más adelante
    console.log("Datos de registro:", { ...formData, tipoDocumento });
    
    // Simulación temporal
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de Paciente</CardTitle>
          <CardDescription>Completa tus datos para crear una cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  required
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <RadioGroup value={tipoDocumento} onValueChange={(value) => setTipoDocumento(value as "rut" | "pasaporte")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rut" id="rut" />
                    <Label htmlFor="rut" className="font-normal">RUT</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pasaporte" id="pasaporte" />
                    <Label htmlFor="pasaporte" className="font-normal">Pasaporte</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento">{tipoDocumento === "rut" ? "RUT" : "Pasaporte"}</Label>
                <Input
                  id="documento"
                  required
                  placeholder={tipoDocumento === "rut" ? "12.345.678-9" : "ABC123456"}
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cesfam">CESFAM</Label>
                <Select value={formData.cesfam} onValueChange={(value) => setFormData({ ...formData, cesfam: value })}>
                  <SelectTrigger id="cesfam">
                    <SelectValue placeholder="Selecciona tu CESFAM" />
                  </SelectTrigger>
                  <SelectContent>
                    {cesfams.map((cesfam) => (
                      <SelectItem key={cesfam} value={cesfam}>{cesfam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comuna">Comuna</Label>
                <Select value={formData.comuna} onValueChange={(value) => setFormData({ ...formData, comuna: value })}>
                  <SelectTrigger id="comuna">
                    <SelectValue placeholder="Selecciona tu comuna" />
                  </SelectTrigger>
                  <SelectContent>
                    {comunas.map((comuna) => (
                      <SelectItem key={comuna} value={comuna}>{comuna}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  required
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  type="tel"
                  required
                  placeholder="+56912345678"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Personal</Label>
                <Input
                  id="correo"
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

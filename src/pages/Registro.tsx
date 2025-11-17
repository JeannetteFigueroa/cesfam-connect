import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const registroSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  documento: z.string().min(8, "Documento inválido"),
  celular: z.string().min(9, "Celular inválido"),
  fecha_nacimiento: z.string().min(1, "Fecha de nacimiento obligatoria"),
  tipo_documento: z.enum(["rut", "pasaporte"]),
  comuna: z.string().min(1, "Comuna obligatoria"),
  direccion: z.string().min(1, "Dirección obligatoria")
});

const comunas = [
  "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón",
  "Santiago", "Providencia", "Las Condes", "La Florida", "Maipú",
  "Puente Alto", "San Bernardo", "Ñuñoa", "Peñalolén", "La Reina"
];

export default function Registro() {
  const navigate = useNavigate();
  const { signUp, token } = useAuth();
  const { toast } = useToast();
  const [cesfams, setCesfams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [tipoDocumento, setTipoDocumento] = useState<"rut" | "pasaporte">("rut");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    documento: "",
    cesfam_id: "",
    comuna: "",
    direccion: "",
    celular: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    loadCesfams();
  }, []);

  const loadCesfams = async () => {
    try {
      const data = await api.getCesfams();
      setCesfams(data);
    } catch (err) {
      console.error("Error loading cesfams:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const validation = registroSchema.safeParse({
      ...formData,
      tipo_documento: tipoDocumento,
      role: 'paciente'
    });

    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(formData.email, formData.password, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipo_documento: tipoDocumento,
      documento: formData.documento,
      celular: formData.celular,
      fecha_nacimiento: formData.fecha_nacimiento,
      role: 'paciente'
    });

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    // Crear perfil de paciente si tenemos token
    if (token) {
      try {
        await api.createPaciente({
          cesfam_id: formData.cesfam_id || null,
          comuna: formData.comuna,
          direccion: formData.direccion,
        }, token);
      } catch (err) {
        console.error("Error creating patient profile:", err);
      }
    }

    toast({
      title: "¡Registro exitoso!",
      description: "Tu cuenta ha sido creada correctamente.",
    });

    setLoading(false);
    navigate("/");
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-glow mb-4">
            <Activity className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Crear Cuenta</h1>
          <p className="text-muted-foreground">Completa el formulario para registrarte</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Registro de Paciente</CardTitle>
            <CardDescription>
              Todos los campos son obligatorios
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Personal</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      placeholder="Juan"
                    />
                    {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => handleChange("apellido", e.target.value)}
                      placeholder="Pérez"
                    />
                    {errors.apellido && <p className="text-sm text-destructive">{errors.apellido}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                  />
                  {errors.fecha_nacimiento && <p className="text-sm text-destructive">{errors.fecha_nacimiento}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Documento</Label>
                  <RadioGroup value={tipoDocumento} onValueChange={(val: any) => setTipoDocumento(val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rut" id="rut" />
                      <Label htmlFor="rut">RUT</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pasaporte" id="pasaporte" />
                      <Label htmlFor="pasaporte">Pasaporte</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documento">{tipoDocumento === "rut" ? "RUT" : "Pasaporte"}</Label>
                  <Input
                    id="documento"
                    value={formData.documento}
                    onChange={(e) => handleChange("documento", e.target.value)}
                    placeholder={tipoDocumento === "rut" ? "12345678-9" : "ABC123456"}
                  />
                  {errors.documento && <p className="text-sm text-destructive">{errors.documento}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleChange("celular", e.target.value)}
                    placeholder="+56912345678"
                  />
                  {errors.celular && <p className="text-sm text-destructive">{errors.celular}</p>}
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ubicación</h3>

                <div className="space-y-2">
                  <Label htmlFor="comuna">Comuna</Label>
                  <Select value={formData.comuna} onValueChange={(val) => handleChange("comuna", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      {comunas.map(comuna => (
                        <SelectItem key={comuna} value={comuna}>{comuna}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.comuna && <p className="text-sm text-destructive">{errors.comuna}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    placeholder="Calle 123, Depto 45"
                  />
                  {errors.direccion && <p className="text-sm text-destructive">{errors.direccion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cesfam_id">CESFAM (Opcional)</Label>
                  <Select value={formData.cesfam_id} onValueChange={(val) => handleChange("cesfam_id", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu CESFAM" />
                    </SelectTrigger>
                    <SelectContent>
                      {cesfams.map(cesfam => (
                        <SelectItem key={cesfam.id} value={cesfam.id}>{cesfam.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Credenciales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Credenciales de Acceso</h3>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="tu@correo.cl"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Crear Cuenta"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const registroSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  documento: z.string().min(8, "Documento inválido"),
  celular: z.string().min(9, "Celular inválido"),
  fecha_nacimiento: z.string().min(1, "Fecha de nacimiento obligatoria"),
  tipo_documento: z.enum(["rut", "pasaporte"]),
  role: z.enum(["paciente", "medico", "admin"]),
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
  const { signUp } = useAuth();
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
    confirmPassword: "",
    role: "paciente" as "paciente" | "medico" | "admin",
    // Campos extra para médicos
    especialidad: "",
    rut_profesional: ""
  });

  useEffect(() => {
    loadCesfams();
  }, []);

  const loadCesfams = async () => {
    const { data } = await supabase.from('cesfams').select('*').order('nombre');
    if (data) setCesfams(data);
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
      tipo_documento: tipoDocumento
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

    // Registrar usuario
    const { error: signUpError } = await signUp(formData.email, formData.password, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipo_documento: tipoDocumento,
      documento: formData.documento,
      celular: formData.celular,
      fecha_nacimiento: formData.fecha_nacimiento,
      role: formData.role
    });

    if (signUpError) {
      setLoading(false);
      return;
    }

    // Obtener el usuario recién creado
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Crear perfil específico según el rol
      if (formData.role === 'paciente') {
        await supabase.from('pacientes').insert({
          user_id: user.id,
          cesfam_id: formData.cesfam_id || null,
          comuna: formData.comuna,
          direccion: formData.direccion
        });
      } else if (formData.role === 'medico') {
        await supabase.from('medicos').insert({
          user_id: user.id,
          cesfam_id: formData.cesfam_id || null,
          especialidad: formData.especialidad,
          rut_profesional: formData.rut_profesional
        });
      }
    }

    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
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
                {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                />
                {errors.apellido && <p className="text-sm text-destructive">{errors.apellido}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  required
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
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
                <Label htmlFor="role">Tipo de Usuario</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "paciente" | "medico" | "admin") => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cesfam">CESFAM</Label>
                <Select
                  value={formData.cesfam_id}
                  onValueChange={(value) => setFormData({ ...formData, cesfam_id: value })}
                >
                  <SelectTrigger id="cesfam">
                    <SelectValue placeholder="Selecciona tu CESFAM" />
                  </SelectTrigger>
                  <SelectContent>
                    {cesfams.map((cesfam) => (
                      <SelectItem key={cesfam.id} value={cesfam.id}>
                        {cesfam.nombre} - {cesfam.comuna}
                      </SelectItem>
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
                <Label htmlFor="email">Correo Personal</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              {formData.role === 'medico' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Select
                      value={formData.especialidad}
                      onValueChange={(value) => setFormData({ ...formData, especialidad: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicina_general">Medicina General</SelectItem>
                        <SelectItem value="pediatria">Pediatría</SelectItem>
                        <SelectItem value="ginecologia">Ginecología</SelectItem>
                        <SelectItem value="cardiologia">Cardiología</SelectItem>
                        <SelectItem value="dermatologia">Dermatología</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rut_profesional">RUT Profesional</Label>
                    <Input
                      id="rut_profesional"
                      value={formData.rut_profesional}
                      onChange={(e) => setFormData({ ...formData, rut_profesional: e.target.value })}
                      placeholder="12.345.678-9"
                      required
                    />
                  </div>
                </>
              )}
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

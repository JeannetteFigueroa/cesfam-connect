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
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";

const registroSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  documento: z.string().min(8),
  celular: z.string().min(9),
  fecha_nacimiento: z.string().min(1),
  tipo_documento: z.enum(["rut", "pasaporte"]),
  comuna: z.string().min(1),
  direccion: z.string().min(1),
  cesfam_id: z.string().min(1)
});

const comunas = [
  "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón",
  "Santiago", "Providencia", "Las Condes", "La Florida", "Maipú",
  "Puente Alto", "San Bernardo", "Ñuñoa", "Peñalolén", "La Reina"
];

export default function Registro() {
  const navigate = useNavigate();
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
      // Normalizar respuesta: puede ser array o objeto paginado { results: [...] }
      const list = Array.isArray(data) ? data : (data?.results || []);
      // Asegurar que los ids son strings (Select espera string values)
      const normalized = list.map((c: any) => ({ ...c, id: String(c.id) }));
      setCesfams(normalized);
      console.debug('Loaded CESFAMs:', normalized);
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

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.email,
          password: formData.password,
          tipo_documento: tipoDocumento,
          documento: formData.documento,
          celular: formData.celular,
          fecha_nacimiento: formData.fecha_nacimiento,
          comuna: formData.comuna,
          direccion: formData.direccion,
          cesfam_id: formData.cesfam_id || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error Django:", data);

        if (data) setErrors(data);
        else setError("Error desconocido");

        setLoading(false);
        return;
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente."
      });

      navigate("/login");

    } catch (err) {
      console.error("Error submitting:", err);
      setError("Error de conexión con el servidor.");
    }

    setLoading(false);
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
          <h1 className="text-3xl font-bold">Crear Cuenta</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Registro de Paciente</CardTitle>
            <CardDescription>Todos los campos son obligatorios</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* INFORMACIÓN PERSONAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                  {errors.nombre && <p className="text-red-500">{errors.nombre}</p>}
                </div>

                <div>
                  <Label>Apellido</Label>
                  <Input
                    value={formData.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                  />
                  {errors.apellido && <p className="text-red-500">{errors.apellido}</p>}
                </div>
              </div>

              <div>
                <Label>Fecha de nacimiento</Label>
                <Input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                />
                {errors.fecha_nacimiento && <p className="text-red-500">{errors.fecha_nacimiento}</p>}
              </div>

              {/* DOCUMENTO */}

              <div>
                <Label>Tipo de documento</Label>
                <RadioGroup value={tipoDocumento} onValueChange={(v) => setTipoDocumento(v as any)}>
                  <div className="flex gap-4">
                    <label><RadioGroupItem value="rut" /> RUT</label>
                    <label><RadioGroupItem value="pasaporte" /> Pasaporte</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>{tipoDocumento === "rut" ? "RUT" : "Pasaporte"}</Label>
                <Input
                  value={formData.documento}
                  onChange={(e) => handleChange("documento", e.target.value)}
                />
                {errors.documento && <p className="text-red-500">{errors.documento}</p>}
              </div>

              <div>
                <Label>Celular</Label>
                <Input
                  value={formData.celular}
                  onChange={(e) => handleChange("celular", e.target.value)}
                />
                {errors.celular && <p className="text-red-500">{errors.celular}</p>}
              </div>

              {/* UBICACION */}
              <div>
                <Label>Comuna</Label>
                <Select
                  value={formData.comuna}
                  onValueChange={(v) => handleChange("comuna", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una comuna" />
                  </SelectTrigger>
                  <SelectContent>
                    {comunas.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.comuna && <p className="text-red-500">{errors.comuna}</p>}
              </div>

              <div>
                <Label>Dirección</Label>
                <Input
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                />
                {errors.direccion && <p className="text-red-500">{errors.direccion}</p>}
              </div>

              <div>
                <Label>CESFAM</Label>
                <Select
                  value={formData.cesfam_id}
                  onValueChange={(v) => handleChange("cesfam_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un CESFAM" />
                  </SelectTrigger>
                  <SelectContent>
                    {cesfams.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cesfam_id && <p className="text-red-500">{errors.cesfam_id}</p>}
              </div>

              {/* CREDENCIALES */}
              <div>
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.correo && <p className="text-red-500">{errors.correo}</p>}
              </div>

              <div>
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>

              <div>
                <Label>Confirmar contraseña</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Crear cuenta
              </Button>

              <p className="text-center text-sm mt-4">
                ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600">Inicia sesión</Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

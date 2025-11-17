import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Mail, Lock, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const medicoSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  documento: z.string().min(8, "Documento inválido"),
  celular: z.string().min(9, "Celular inválido"),
  fecha_nacimiento: z.string().min(1, "Fecha de nacimiento obligatoria"),
  especialidad: z.string().min(1, "Especialidad obligatoria"),
  rut_profesional: z.string().min(8, "RUT profesional inválido"),
  cesfam_id: z.string().min(1, "CESFAM obligatorio")
});

export default function GestionMedicos() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cesfams, setCesfams] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    documento: "",
    celular: "",
    email: "",
    especialidad: "",
    rut_profesional: "",
    cesfam_id: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // TODO: Load from Django API
    setCesfams([]);
    setMedicos([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = medicoSchema.safeParse(formData);
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
      // TODO: Create via Django API
      toast.info('Funcionalidad de gestión de médicos en desarrollo');
      
      setFormData({
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        documento: "",
        celular: "",
        email: "",
        especialidad: "",
        rut_profesional: "",
        cesfam_id: ""
      });
      
      setOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Médicos</h1>
          <p className="text-muted-foreground">Crea y administra cuentas de médicos</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Crear Médico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Médico</DialogTitle>
              <DialogDescription>
                Completa los datos para crear una cuenta de médico. Se generará una contraseña temporal.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
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
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                  />
                  {errors.fecha_nacimiento && <p className="text-sm text-destructive">{errors.fecha_nacimiento}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documento">RUT</Label>
                  <Input
                    id="documento"
                    placeholder="12.345.678-9"
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  />
                  {errors.documento && <p className="text-sm text-destructive">{errors.documento}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    placeholder="+56912345678"
                    value={formData.celular}
                    onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  />
                  {errors.celular && <p className="text-sm text-destructive">{errors.celular}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

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
                  {errors.especialidad && <p className="text-sm text-destructive">{errors.especialidad}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rut_profesional">RUT Profesional</Label>
                  <Input
                    id="rut_profesional"
                    placeholder="12.345.678-9"
                    value={formData.rut_profesional}
                    onChange={(e) => setFormData({ ...formData, rut_profesional: e.target.value })}
                  />
                  {errors.rut_profesional && <p className="text-sm text-destructive">{errors.rut_profesional}</p>}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="cesfam">CESFAM</Label>
                  <Select
                    value={formData.cesfam_id}
                    onValueChange={(value) => setFormData({ ...formData, cesfam_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona CESFAM" />
                    </SelectTrigger>
                    <SelectContent>
                      {cesfams.map((cesfam) => (
                        <SelectItem key={cesfam.id} value={cesfam.id}>
                          {cesfam.nombre} - {cesfam.comuna}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cesfam_id && <p className="text-sm text-destructive">{errors.cesfam_id}</p>}
                </div>
              </div>

              <div className="bg-accent/10 border border-accent rounded-lg p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-accent-foreground">Contraseña Temporal</p>
                  <p className="text-muted-foreground">Se generará automáticamente y se mostrará solo una vez. El médico deberá cambiarla en su primer acceso.</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Crear Médico"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Médicos Registrados
          </CardTitle>
          <CardDescription>Lista de todos los médicos en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>RUT Profesional</TableHead>
                <TableHead>CESFAM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay médicos registrados
                  </TableCell>
                </TableRow>
              ) : (
                medicos.map((medico) => (
                  <TableRow key={medico.id}>
                    <TableCell className="font-medium">
                      {medico.nombre} {medico.apellido}
                    </TableCell>
                    <TableCell className="capitalize">
                      {medico.especialidad.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>{medico.rut_profesional}</TableCell>
                    <TableCell>{medico.cesfam?.nombre || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

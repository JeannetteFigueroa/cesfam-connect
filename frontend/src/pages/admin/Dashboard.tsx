import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Activity, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totalMedicos, setTotalMedicos] = useState(0);
  const [totalCitas, setTotalCitas] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const medicosRes = await api.getMedicos(token);
        const medicosList = Array.isArray(medicosRes) ? medicosRes : (medicosRes.results || []);
        setTotalMedicos(medicosList.length);

        try {
          const citasRes = await api.getCitas(token);
          const citasList = Array.isArray(citasRes) ? citasRes : (citasRes.results || []);
          setTotalCitas(citasList.length);
        } catch { setTotalCitas(0); }

        try {
          const usuariosRes = await api.getUsuarios(token);
          const usuariosList = Array.isArray(usuariosRes) ? usuariosRes : (usuariosRes.results || []);
          setTotalUsuarios(usuariosList.length);
        } catch { setTotalUsuarios(0); }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Estadísticas del CESFAM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicos Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedicos}</div>
            <p className="text-xs text-muted-foreground">En todas las áreas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Registradas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCitas}</div>
            <p className="text-xs text-muted-foreground">Total en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">Usuarios Registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Activo</div>
            <p className="text-xs text-muted-foreground">Sistema operativo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
          <CardDescription>Los datos se cargan desde tu backend Django</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El dashboard muestra datos reales obtenidos de la API. Agrega más endpoints en tu backend para ver estadísticas adicionales.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

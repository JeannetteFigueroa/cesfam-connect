import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 🧠 Páginas Paciente
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Cuenta from "./pages/Cuenta";
import Mapa from "./pages/Mapa";
import Examenes from "./pages/Examenes";
import Historial from "./pages/Historial";
import Agendar from "./pages/Agendar";
import Configuracion from "./pages/Configuracion";

// 🩺 Páginas Médico
import HomeMedico from "./pages/medico/HomeMedico";
import Turnos from "./pages/medico/Turnos";
import HistorialPacientes from "./pages/medico/HistorialPacientes";
import Documentos from "./pages/medico/Documentos";
import Disponibilidad from "./pages/medico/Disponibilidad";

// 👨‍💼 Páginas Admin
import HomeAdmin from "./pages/admin/HomeAdmin";
import Dashboard from "./pages/admin/Dashboard";
import GestionTurnos from "./pages/admin/GestionTurnos";

// 🧩 Página general
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 🔒 Ruta protegida general (solo usuarios logueados)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mapa" element={<Mapa />} />

          {/* Rutas protegidas Paciente */}
          <Route
            path="/cuenta"
            element={
              <ProtectedRoute>
                <Cuenta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examenes"
            element={
              <ProtectedRoute>
                <Examenes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <Historial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendar"
            element={
              <ProtectedRoute>
                <Agendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            }
          />

          {/* Rutas Médico */}
          <Route
            path="/medico/home"
            element={
              <RoleProtectedRoute allowedRoles={["medico"]}>
                <HomeMedico />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/medico/Turnos"
            element={
              <RoleProtectedRoute allowedRoles={["medico"]}>
                <Turnos />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/medico/HistorialPacientes"
            element={
              <RoleProtectedRoute allowedRoles={["medico"]}>
                <HistorialPacientes />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/medico/Documentos"
            element={
              <RoleProtectedRoute allowedRoles={["medico"]}>
                <Documentos />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/medico/Disponibilidad"
            element={
              <RoleProtectedRoute allowedRoles={["medico"]}>
                <Disponibilidad />
              </RoleProtectedRoute>
            }
          />

          {/*  Rutas Admin */}
          <Route
            path="/admin/home"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <HomeAdmin />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/Dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/GestionTurnos"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <GestionTurnos />
              </RoleProtectedRoute>
            }
          />

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

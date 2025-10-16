import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Cuenta from "./pages/Cuenta";
import Mapa from "./pages/Mapa";
import Examenes from "./pages/Examenes";
import Historial from "./pages/Historial";
import Agendar from "./pages/Agendar";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";
import Turnos from "./pages/medico/Turnos";
import HistorialPacientes from "./pages/medico/HistorialPacientes";
import Documentos from "./pages/medico/Documentos";
import Disponibilidad from "./pages/medico/Disponibilidad";
import Dashboard from "./pages/admin/Dashboard";
import GestionTurnos from "./pages/admin/GestionTurnos";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mapa" element={<Mapa />} />
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
          {/* Rutas para médicos */}
          <Route
            path="/medico/turnos"
            element={
              <ProtectedRoute>
                <Turnos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/historial-pacientes"
            element={
              <ProtectedRoute>
                <HistorialPacientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/documentos"
            element={
              <ProtectedRoute>
                <Documentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medico/disponibilidad"
            element={
              <ProtectedRoute>
                <Disponibilidad />
              </ProtectedRoute>
            }
          />
          {/* Rutas para admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gestion-turnos"
            element={
              <ProtectedRoute>
                <GestionTurnos />
              </ProtectedRoute>
            }
          />
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

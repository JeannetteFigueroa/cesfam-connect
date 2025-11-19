import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { toast } from "sonner";

export type UserRole = "paciente" | "medico" | "admin";

interface AuthContextType {
  user: any | null;
  token: string | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();

      setUser(data);
      setUserRole(data.role);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      
      // Show user-friendly error message
      if (error.message === "Failed to fetch") {
        toast.error("No se puede conectar con el servidor. Verifica que el backend esté corriendo.");
      }
      
      setToken(null);
      localStorage.removeItem("token");
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.detail || "Credenciales incorrectas" };
      }

      const access = data.access;

      localStorage.setItem("token", access);
      setToken(access);

      await fetchUserData();

      return { error: null };
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message === "Failed to fetch") {
        return { error: "No se puede conectar con el servidor. Asegúrate de que el backend Django esté corriendo en http://127.0.0.1:8000" };
      }
      
      return { error: "Error al conectar con el servidor" };
    }
  };


  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email,
          password,
          nombre: userData.nombre,
          apellido: userData.apellido,
          tipo_documento: userData.tipo_documento,
          documento: userData.documento,
          celular: userData.celular,
          fecha_nacimiento: userData.fecha_nacimiento,
          role: userData.role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.detail || data.error || "Error al registrar" };
      }

      // Auto login después del registro
      return await signIn(email, password);
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.message === "Failed to fetch") {
        return { error: "No se puede conectar con el servidor" };
      }
      
      return { error: "Error al conectar con el servidor" };
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    setUserRole(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, userRole, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

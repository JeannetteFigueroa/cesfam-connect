import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "paciente" | "medico" | "admin";

interface AuthContextType {
  user: any | null;
  token: string | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
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
      const res = await fetch("http://127.0.0.1:8000/api/usuarios/me/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();

      setUser(data);
      setUserRole(data.rol);
    } catch (error) {
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
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
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
    } catch (error) {
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
    <AuthContext.Provider value={{ user, token, userRole, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

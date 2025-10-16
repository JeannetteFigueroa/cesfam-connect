import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'paciente' | 'medico' | 'admin';

export interface User {
  id: string;
  nombre: string;
  correo: string;
  rut: string;
  telefono?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de prueba
const mockUsers: Record<string, { password: string; user: User }> = {
  'paciente@cesfam.cl': {
    password: 'paciente123',
    user: {
      id: '1',
      nombre: 'Juan Pérez',
      correo: 'paciente@cesfam.cl',
      rut: '12.345.678-9',
      telefono: '+56912345678',
      role: 'paciente'
    }
  },
  'medico@cesfam.cl': {
    password: 'medico123',
    user: {
      id: '2',
      nombre: 'Dra. María González',
      correo: 'medico@cesfam.cl',
      rut: '98.765.432-1',
      telefono: '+56987654321',
      role: 'medico'
    }
  },
  'admin@cesfam.cl': {
    password: 'admin123',
    user: {
      id: '3',
      nombre: 'Carlos Administrador',
      correo: 'admin@cesfam.cl',
      rut: '11.111.111-1',
      telefono: '+56911111111',
      role: 'admin'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('cesfam_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (correo: string, password: string): Promise<boolean> => {
    const userCredentials = mockUsers[correo];
    
    if (userCredentials && userCredentials.password === password) {
      setUser(userCredentials.user);
      localStorage.setItem('cesfam_user', JSON.stringify(userCredentials.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cesfam_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// API Configuration
// Para desarrollo local con ngrok: export const API_BASE_URL = "https://tu-url.ngrok.io";
// Para producción: export const API_BASE_URL = "https://tu-backend-desplegado.com";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REGISTER: `${API_BASE_URL}/api/usuarios/register/`,
    ME: `${API_BASE_URL}/api/usuarios/me/`,
  },
  CESFAMS: `${API_BASE_URL}/api/cesfams/`,
  MEDICOS: `${API_BASE_URL}/api/medicos/`,
  PACIENTES: `${API_BASE_URL}/api/pacientes/`,
  USUARIOS: `${API_BASE_URL}/api/usuarios/`,
};

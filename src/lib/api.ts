import { API_ENDPOINTS } from "@/config/api";

export const api = {
  async getCesfams() {
    const res = await fetch(API_ENDPOINTS.CESFAMS);
    if (!res.ok) throw new Error("Error al cargar CESFAMs");
    return res.json();
  },

  async createPaciente(data: any, token: string) {
    const res = await fetch(API_ENDPOINTS.PACIENTES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear perfil de paciente");
    return res.json();
  },
};

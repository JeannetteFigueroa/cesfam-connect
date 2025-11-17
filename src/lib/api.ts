const API_BASE_URL = "http://127.0.0.1:8000/api";

export const api = {
  async getCesfams() {
    const res = await fetch(`${API_BASE_URL}/cesfams/`);
    if (!res.ok) throw new Error("Error al cargar CESFAMs");
    return res.json();
  },

  async createPaciente(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/pacientes/`, {
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

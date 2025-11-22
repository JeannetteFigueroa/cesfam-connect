import { API_ENDPOINTS } from "@/config/api";

export const api = {
  async getCesfams() {
    try {
      const res = await fetch(API_ENDPOINTS.CESFAMS);
      if (!res.ok) {
        console.warn('getCesfams: response not ok', res.status);
        return [];
      }
      const data = await res.json();
      // DRF puede devolver paginación { results: [...] }
      if (data && typeof data === "object" && Array.isArray(data.results)) {
        return data.results;
      }
      if (Array.isArray(data)) return data;
      return [];
    } catch (e) {
      console.warn("getCesfams error", e);
      return [];
    }
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

  async createMedicoWithUser(data: any, token: string) {
  // 🔥 SIEMPRE USAR EL MISMO ENDPOINT
  const endpoint = `${API_ENDPOINTS.MEDICOS}crear_con_usuario/`;

  const headers: any = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let parsed: any = null;
    try {
      parsed = await res.json();
    } catch (e) {
      try {
        parsed = await res.text();
      } catch (e) {
        parsed = null;
      }
    }

    const msg =
      (parsed && (parsed.detail || parsed.message)) ||
      (typeof parsed === "string"
        ? parsed
        : `Error al crear médico (status ${res.status})`);

    throw { message: msg, status: res.status, body: parsed };
  }

  return res.json();
}
};
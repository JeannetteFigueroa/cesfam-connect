import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";

export const api = {
  // ========================
  // CESFAMS
  // ========================
  async getCesfams() {
    try {
      const res = await fetch(API_ENDPOINTS.CESFAMS);
      if (!res.ok) {
        console.warn('getCesfams: response not ok', res.status);
        return [];
      }
      const data = await res.json();
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

  // ========================
  // MEDICOS
  // ========================
  async getMedicos(token: string) {
    const res = await fetch(API_ENDPOINTS.MEDICOS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener médicos");
    return res.json();
  },

  async getMedicosByCesfam(cesfamId: string, token: string) {
    const res = await fetch(`${API_ENDPOINTS.MEDICOS}?cesfam_id=${cesfamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener médicos del CESFAM");
    return res.json();
  },

  async getMedicoProfile(token: string) {
    const res = await fetch(`${API_ENDPOINTS.MEDICOS}me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener perfil de médico");
    return res.json();
  },

  async createMedicoWithUser(data: any, token: string) {
    const endpoint = `${API_ENDPOINTS.MEDICOS}register/`;
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
      } catch {
        try { parsed = await res.text(); } catch {}
      }
      const msg =
        (parsed && (parsed.detail || parsed.message)) ||
        (typeof parsed === "string"
          ? parsed
          : `Error al crear médico (status ${res.status})`);
      throw { message: msg, status: res.status, body: parsed };
    }
    return res.json();
  },

  // ========================
  // PACIENTES
  // ========================
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

  async getPacienteProfile(token: string) {
    const res = await fetch(`${API_ENDPOINTS.PACIENTES}me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener perfil de paciente");
    return res.json();
  },

  // ========================
  // CITAS
  // ========================
  async getCitas(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/citas/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener citas");
    return res.json();
  },

  async getCitasByMedico(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/citas/mis_pacientes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener citas del médico");
    return res.json();
  },

  async createCita(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/citas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al crear cita");
    }
    return res.json();
  },

  // ========================
  // TURNOS
  // ========================
  async getTurnos(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/turnos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener turnos");
    return res.json();
  },

  async getMisTurnos(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/turnos/mis_turnos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener mis turnos");
    return res.json();
  },

  async createTurno(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/turnos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al crear turno");
    }
    return res.json();
  },

  async updateTurno(id: string, data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/turnos/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar turno");
    return res.json();
  },

  async deleteTurno(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/turnos/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar turno");
    return true;
  },

  // ========================
  // DISPONIBILIDAD MEDICO
  // ========================
  async getDisponibilidad(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/disponibilidad/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener disponibilidad");
    return res.json();
  },

  async getMiDisponibilidad(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/disponibilidad/mi_disponibilidad/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener mi disponibilidad");
    return res.json();
  },

  async saveDisponibilidad(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/disponibilidad/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al guardar disponibilidad");
    }
    return res.json();
  },

  async updateDisponibilidad(id: string, data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/disponibilidad/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar disponibilidad");
    return res.json();
  },

  async deleteDisponibilidad(id: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/disponibilidad/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar disponibilidad");
    return true;
  },

  // ========================
  // SOLICITUDES CAMBIO TURNO
  // ========================
  async getSolicitudesCambio(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/solicitudes-cambio/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener solicitudes");
    return res.json();
  },

  async createSolicitudCambio(data: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/solicitudes-cambio/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al crear solicitud");
    }
    return res.json();
  },

  // ========================
  // DOCUMENTOS
  // ========================
  async getDocumentos(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/documentos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener documentos");
    return res.json();
  },

  async getDocumentosByPaciente(pacienteId: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/documentos/?paciente_id=${pacienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener documentos del paciente");
    return res.json();
  },

  async getMisDocumentos(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/documentos/mis_documentos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener mis documentos");
    return res.json();
  },

  async uploadDocumento(formData: FormData, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/documentos/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al subir documento");
    }
    return res.json();
  },

  // ========================
  // ESPECIALIDADES
  // ========================
  async getEspecialidades(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/especialidades/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      // Fallback si no existe el endpoint
      return [
        { id: 'medicina_general', nombre: 'Medicina General' },
        { id: 'cardiologia', nombre: 'Cardiología' },
        { id: 'pediatria', nombre: 'Pediatría' },
        { id: 'ginecologia', nombre: 'Ginecología' },
        { id: 'traumatologia', nombre: 'Traumatología' },
        { id: 'dermatologia', nombre: 'Dermatología' },
      ];
    }
    return res.json();
  },

  // ========================
  // HORARIOS DISPONIBLES
  // ========================
  async getHorariosDisponibles(medicoId: string, fecha: string, token: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/horarios-disponibles/?medico_id=${medicoId}&fecha=${fecha}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      // Fallback: horarios estándar
      return ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    }
    return res.json();
  },
};

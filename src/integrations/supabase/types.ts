export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cesfams: {
        Row: {
          comuna: string
          created_at: string | null
          direccion: string
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
          telefono: string
        }
        Insert: {
          comuna: string
          created_at?: string | null
          direccion: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
          telefono: string
        }
        Update: {
          comuna?: string
          created_at?: string | null
          direccion?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          telefono?: string
        }
        Relationships: []
      }
      citas: {
        Row: {
          created_at: string | null
          fecha: string
          hora: string
          id: string
          medico_id: string
          motivo: string | null
          notas: string | null
          paciente_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fecha: string
          hora: string
          id?: string
          medico_id: string
          motivo?: string | null
          notas?: string | null
          paciente_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fecha?: string
          hora?: string
          id?: string
          medico_id?: string
          motivo?: string | null
          notas?: string | null
          paciente_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citas_medico_id_fkey"
            columns: ["medico_id"]
            isOneToOne: false
            referencedRelation: "medicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      disponibilidad_medico: {
        Row: {
          activo: boolean | null
          created_at: string | null
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id: string
          medico_id: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id?: string
          medico_id: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          dia_semana?: number
          hora_fin?: string
          hora_inicio?: string
          id?: string
          medico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disponibilidad_medico_medico_id_fkey"
            columns: ["medico_id"]
            isOneToOne: false
            referencedRelation: "medicos"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          archivo_url: string | null
          cita_id: string
          contenido: string
          created_at: string | null
          id: string
          tipo_documento: string
        }
        Insert: {
          archivo_url?: string | null
          cita_id: string
          contenido: string
          created_at?: string | null
          id?: string
          tipo_documento: string
        }
        Update: {
          archivo_url?: string | null
          cita_id?: string
          contenido?: string
          created_at?: string | null
          id?: string
          tipo_documento?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "citas"
            referencedColumns: ["id"]
          },
        ]
      }
      medicos: {
        Row: {
          cesfam_id: string | null
          created_at: string | null
          especialidad: string
          id: string
          rut_profesional: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cesfam_id?: string | null
          created_at?: string | null
          especialidad: string
          id?: string
          rut_profesional: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cesfam_id?: string | null
          created_at?: string | null
          especialidad?: string
          id?: string
          rut_profesional?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicos_cesfam_id_fkey"
            columns: ["cesfam_id"]
            isOneToOne: false
            referencedRelation: "cesfams"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          alergias: string | null
          cesfam_id: string | null
          comuna: string
          created_at: string | null
          direccion: string
          enfermedades_cronicas: string | null
          grupo_sanguineo: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alergias?: string | null
          cesfam_id?: string | null
          comuna: string
          created_at?: string | null
          direccion: string
          enfermedades_cronicas?: string | null
          grupo_sanguineo?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alergias?: string | null
          cesfam_id?: string | null
          comuna?: string
          created_at?: string | null
          direccion?: string
          enfermedades_cronicas?: string | null
          grupo_sanguineo?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_cesfam_id_fkey"
            columns: ["cesfam_id"]
            isOneToOne: false
            referencedRelation: "cesfams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string
          celular: string
          created_at: string | null
          documento: string
          fecha_nacimiento: string
          id: string
          nombre: string
          tipo_documento: string
          updated_at: string | null
        }
        Insert: {
          apellido: string
          celular: string
          created_at?: string | null
          documento: string
          fecha_nacimiento: string
          id: string
          nombre: string
          tipo_documento: string
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          celular?: string
          created_at?: string | null
          documento?: string
          fecha_nacimiento?: string
          id?: string
          nombre?: string
          tipo_documento?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      solicitudes_cambio_turno: {
        Row: {
          created_at: string | null
          fecha_nueva: string
          hora_fin_nueva: string
          hora_inicio_nueva: string
          id: string
          medico_solicitante_id: string
          motivo: string
          respuesta: string | null
          status: string
          turno_original_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fecha_nueva: string
          hora_fin_nueva: string
          hora_inicio_nueva: string
          id?: string
          medico_solicitante_id: string
          motivo: string
          respuesta?: string | null
          status?: string
          turno_original_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fecha_nueva?: string
          hora_fin_nueva?: string
          hora_inicio_nueva?: string
          id?: string
          medico_solicitante_id?: string
          motivo?: string
          respuesta?: string | null
          status?: string
          turno_original_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_cambio_turno_medico_solicitante_id_fkey"
            columns: ["medico_solicitante_id"]
            isOneToOne: false
            referencedRelation: "medicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_cambio_turno_turno_original_id_fkey"
            columns: ["turno_original_id"]
            isOneToOne: false
            referencedRelation: "turnos"
            referencedColumns: ["id"]
          },
        ]
      }
      turnos: {
        Row: {
          area: string
          cargo: string
          created_at: string | null
          fecha: string
          hora_fin: string
          hora_inicio: string
          id: string
          medico_id: string
          observaciones: string | null
          status: string
          tipo_turno: string
          updated_at: string | null
        }
        Insert: {
          area: string
          cargo: string
          created_at?: string | null
          fecha: string
          hora_fin: string
          hora_inicio: string
          id?: string
          medico_id: string
          observaciones?: string | null
          status?: string
          tipo_turno: string
          updated_at?: string | null
        }
        Update: {
          area?: string
          cargo?: string
          created_at?: string | null
          fecha?: string
          hora_fin?: string
          hora_inicio?: string
          id?: string
          medico_id?: string
          observaciones?: string | null
          status?: string
          tipo_turno?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "turnos_medico_id_fkey"
            columns: ["medico_id"]
            isOneToOne: false
            referencedRelation: "medicos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "paciente" | "medico" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["paciente", "medico", "admin"],
    },
  },
} as const

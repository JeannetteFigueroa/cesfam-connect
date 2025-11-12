-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('rut', 'pasaporte')),
  documento TEXT NOT NULL UNIQUE,
  celular TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tipo enum para roles
CREATE TYPE public.app_role AS ENUM ('paciente', 'medico', 'admin');

-- Crear tabla de roles de usuario (seguridad crítica)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Función de seguridad para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Tabla de CESFAMs
CREATE TABLE public.cesfams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  comuna TEXT NOT NULL,
  telefono TEXT NOT NULL,
  latitud DECIMAL(10, 7),
  longitud DECIMAL(10, 7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cesfam_id UUID REFERENCES public.cesfams(id) ON DELETE SET NULL,
  comuna TEXT NOT NULL,
  direccion TEXT NOT NULL,
  grupo_sanguineo TEXT,
  alergias TEXT,
  enfermedades_cronicas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de médicos
CREATE TABLE public.medicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cesfam_id UUID REFERENCES public.cesfams(id) ON DELETE SET NULL,
  especialidad TEXT NOT NULL,
  rut_profesional TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de disponibilidad de médicos
CREATE TABLE public.disponibilidad_medico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medico_id UUID REFERENCES public.medicos(id) ON DELETE CASCADE NOT NULL,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (medico_id, dia_semana, hora_inicio)
);

-- Tabla de turnos
CREATE TABLE public.turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medico_id UUID REFERENCES public.medicos(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  tipo_turno TEXT NOT NULL CHECK (tipo_turno IN ('diurno', 'vespertino', 'nocturno')),
  cargo TEXT NOT NULL,
  area TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'programado' CHECK (status IN ('programado', 'en_curso', 'completado', 'cancelado')),
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de solicitudes de cambio de turno
CREATE TABLE public.solicitudes_cambio_turno (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turno_original_id UUID REFERENCES public.turnos(id) ON DELETE CASCADE NOT NULL,
  medico_solicitante_id UUID REFERENCES public.medicos(id) ON DELETE CASCADE NOT NULL,
  fecha_nueva DATE NOT NULL,
  hora_inicio_nueva TIME NOT NULL,
  hora_fin_nueva TIME NOT NULL,
  motivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobada', 'rechazada')),
  respuesta TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE public.citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  medico_id UUID REFERENCES public.medicos(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo TEXT,
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'confirmada', 'completada', 'cancelada')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de documentos médicos
CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cita_id UUID REFERENCES public.citas(id) ON DELETE CASCADE NOT NULL,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('receta', 'diagnostico', 'licencia', 'reporte')),
  contenido TEXT NOT NULL,
  archivo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cesfams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disponibilidad_medico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_cambio_turno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas RLS para user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para cesfams (público para lectura)
CREATE POLICY "Anyone can view cesfams"
  ON public.cesfams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage cesfams"
  ON public.cesfams FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para pacientes
CREATE POLICY "Patients can view own data"
  ON public.pacientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Patients can update own data"
  ON public.pacientes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view their patients"
  ON public.pacientes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.citas
      WHERE citas.paciente_id = pacientes.id
      AND citas.medico_id IN (
        SELECT id FROM public.medicos WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all patients"
  ON public.pacientes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para medicos
CREATE POLICY "Doctors can view own data"
  ON public.medicos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update own data"
  ON public.medicos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Patients can view their doctors"
  ON public.medicos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.citas
      WHERE citas.medico_id = medicos.id
      AND citas.paciente_id IN (
        SELECT id FROM public.pacientes WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all doctors"
  ON public.medicos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para disponibilidad_medico
CREATE POLICY "Anyone authenticated can view availability"
  ON public.disponibilidad_medico FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage own availability"
  ON public.disponibilidad_medico FOR ALL
  USING (
    medico_id IN (
      SELECT id FROM public.medicos WHERE user_id = auth.uid()
    )
  );

-- Políticas RLS para turnos
CREATE POLICY "Doctors can view own shifts"
  ON public.turnos FOR SELECT
  USING (
    medico_id IN (
      SELECT id FROM public.medicos WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all shifts"
  ON public.turnos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para solicitudes_cambio_turno
CREATE POLICY "Doctors can view own requests"
  ON public.solicitudes_cambio_turno FOR SELECT
  USING (
    medico_solicitante_id IN (
      SELECT id FROM public.medicos WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create requests"
  ON public.solicitudes_cambio_turno FOR INSERT
  WITH CHECK (
    medico_solicitante_id IN (
      SELECT id FROM public.medicos WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all requests"
  ON public.solicitudes_cambio_turno FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para citas
CREATE POLICY "Patients can view own appointments"
  ON public.citas FOR SELECT
  USING (
    paciente_id IN (
      SELECT id FROM public.pacientes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON public.citas FOR INSERT
  WITH CHECK (
    paciente_id IN (
      SELECT id FROM public.pacientes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their appointments"
  ON public.citas FOR SELECT
  USING (
    medico_id IN (
      SELECT id FROM public.medicos WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their appointments"
  ON public.citas FOR UPDATE
  USING (
    medico_id IN (
      SELECT id FROM public.medicos WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all appointments"
  ON public.citas FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para documentos
CREATE POLICY "Patients can view own documents"
  ON public.documentos FOR SELECT
  USING (
    cita_id IN (
      SELECT id FROM public.citas
      WHERE paciente_id IN (
        SELECT id FROM public.pacientes WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Doctors can manage documents for their appointments"
  ON public.documentos FOR ALL
  USING (
    cita_id IN (
      SELECT id FROM public.citas
      WHERE medico_id IN (
        SELECT id FROM public.medicos WHERE user_id = auth.uid()
      )
    )
  );

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, tipo_documento, documento, celular, fecha_nacimiento)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nombre',
    NEW.raw_user_meta_data->>'apellido',
    NEW.raw_user_meta_data->>'tipo_documento',
    NEW.raw_user_meta_data->>'documento',
    NEW.raw_user_meta_data->>'celular',
    (NEW.raw_user_meta_data->>'fecha_nacimiento')::DATE
  );
  
  -- Asignar rol por defecto (paciente)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pacientes_updated_at
  BEFORE UPDATE ON public.pacientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicos_updated_at
  BEFORE UPDATE ON public.medicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_turnos_updated_at
  BEFORE UPDATE ON public.turnos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solicitudes_cambio_turno_updated_at
  BEFORE UPDATE ON public.solicitudes_cambio_turno
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_citas_updated_at
  BEFORE UPDATE ON public.citas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar CESFAMs de Chile (algunos ejemplos)
INSERT INTO public.cesfams (nombre, direccion, comuna, telefono, latitud, longitud) VALUES
('CESFAM San Joaquín', 'Av. Santa Rosa 8851', 'San Joaquín', '+56223456789', -33.4986, -70.6317),
('CESFAM El Roble', 'Av. Independencia 1234', 'Independencia', '+56223456790', -33.4172, -70.6530),
('CESFAM La Faena', 'Av. La Faena 5678', 'Peñalolén', '+56223456791', -33.4950, -70.5450),
('CESFAM Carol Urzúa', 'Av. Vicuña Mackenna 8501', 'La Florida', '+56223456792', -33.5400, -70.5950),
('CESFAM Padre Damián de Molokai', 'Av. Ossa 0561', 'La Reina', '+56223456793', -33.4500, -70.5400);

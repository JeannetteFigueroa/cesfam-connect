# MICesfam Backend - Django REST API

Backend completo para la aplicación MICesfam con Django, MySQL y autenticación JWT.

## 📋 Requisitos

- Python 3.9+
- MySQL 8.0+
- pip

## 🚀 Instalación

### 1. Crear entorno virtual

```bash
cd backend
python -m venv venv

# Activar en Windows
venv\Scripts\activate

# Activar en Linux/Mac
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar base de datos MySQL

Crear la base de datos en MySQL:

```sql
CREATE DATABASE micesfam_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'micesfam_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON micesfam_db.* TO 'micesfam_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
DB_NAME=micesfam_db
DB_USER=micesfam_user
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=tu-secret-key-super-segura
```

### 5. Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear superusuario

```bash
python manage.py createsuperuser
```

### 7. Cargar datos iniciales (opcional)

```bash
python manage.py loaddata initial_cesfams.json
```

### 8. Ejecutar servidor

```bash
python manage.py runserver
```

El servidor estará disponible en `http://localhost:8000`

## 📚 Estructura del Proyecto

```
backend/
├── config/                 # Configuración de Django
│   ├── settings.py        # Settings principales
│   ├── urls.py            # URLs principales
│   └── wsgi.py            # WSGI config
├── apps/
│   ├── usuarios/          # Gestión de usuarios
│   ├── pacientes/         # Pacientes y CESFAMs
│   ├── medicos/           # Médicos y disponibilidad
│   ├── administradores/   # Administradores
│   ├── citas/             # Citas y historial clínico
│   ├── documentos/        # Recetas, diagnósticos, licencias
│   └── turnos/            # Gestión de turnos médicos
├── media/                 # Archivos subidos
├── requirements.txt       # Dependencias
├── manage.py             # CLI de Django
└── README.md             # Este archivo
```

## 🔐 API Endpoints

### Autenticación

- `POST /api/auth/login/` - Obtener token JWT
- `POST /api/auth/refresh/` - Refrescar token

### Usuarios

- `GET /api/usuarios/` - Listar usuarios
- `POST /api/usuarios/` - Crear usuario
- `GET /api/usuarios/me/` - Perfil actual
- `PUT /api/usuarios/update_profile/` - Actualizar perfil

### Pacientes

- `GET /api/pacientes/` - Listar pacientes
- `POST /api/pacientes/` - Registrar paciente
- `GET /api/pacientes/cesfams/` - Listar CESFAMs

### Médicos

- `GET /api/medicos/` - Listar médicos
- `GET /api/medicos/mi_perfil/` - Perfil del médico
- `GET /api/medicos/disponibilidad/` - Disponibilidades
- `POST /api/medicos/disponibilidad/` - Crear disponibilidad

### Turnos

- `GET /api/turnos/` - Listar turnos
- `GET /api/turnos/mis_turnos/` - Mis turnos
- `POST /api/turnos/solicitudes/` - Solicitar cambio de turno
- `POST /api/turnos/solicitudes/{id}/aprobar/` - Aprobar solicitud
- `POST /api/turnos/solicitudes/{id}/rechazar/` - Rechazar solicitud

### Citas

- `GET /api/citas/` - Listar citas
- `POST /api/citas/` - Crear cita
- `GET /api/citas/mis_citas/` - Mis citas
- `GET /api/citas/historial/` - Historial clínico

### Documentos

- `GET /api/documentos/recetas/` - Recetas
- `GET /api/documentos/diagnosticos/` - Diagnósticos
- `GET /api/documentos/licencias/` - Licencias médicas
- `GET /api/documentos/reportes/` - Reportes

### Administradores

- `GET /api/administradores/estadisticas/` - Estadísticas del sistema

## 🔑 Autenticación JWT

Obtener token:

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"correo": "usuario@ejemplo.com", "password": "password123"}'
```

Usar token en requests:

```bash
curl -X GET http://localhost:8000/api/usuarios/me/ \
  -H "Authorization: Bearer tu_access_token"
```

## 📝 Modelos Principales

### Usuario
- Correo, nombre, apellido, documento (RUT/Pasaporte)
- Roles: paciente, medico, admin

### Paciente
- Usuario + CESFAM, comuna, dirección
- Historial médico

### Médico
- Usuario + especialidad, RUT profesional
- Disponibilidad, turnos

### Cita
- Paciente, médico, fecha, hora
- Estados: agendada, confirmada, completada, cancelada

### Turno
- Médico, fecha, tipo (diurno/vespertino/nocturno)
- Cargo, área, estado

## 🚀 Deployment

### Gunicorn (Producción)

```bash
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /media/ {
        alias /ruta/al/backend/media/;
    }

    location /static/ {
        alias /ruta/al/backend/staticfiles/;
    }
}
```

### Variables de entorno en producción

```env
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
SECRET_KEY=clave-super-segura-generada-aleatoriamente
```

## 🧪 Testing

```bash
python manage.py test
```

## 📦 Backups

Backup de base de datos:

```bash
mysqldump -u micesfam_user -p micesfam_db > backup.sql
```

Restaurar:

```bash
mysql -u micesfam_user -p micesfam_db < backup.sql
```

## 🤝 Integración con Frontend React

El frontend debe configurar el baseURL de axios:

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 📄 Licencia

MIT License

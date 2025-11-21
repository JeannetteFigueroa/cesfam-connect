# Instrucciones para agentes AI — cesfam-connect

Estas instrucciones ayudan a un agente a ser productivo rápidamente en este repositorio (frontend React + backend Django REST).

- **Arquitectura general:** proyecto monorepo con frontend Vite + React (TypeScript) en `src/` y backend Django REST en `backend/`.
  - Frontend: `src/` (Vite, Tailwind, shadcn-ui). Componentes UI reutilizables en `src/components/ui/`.
  - Backend: `backend/` (Django 4.2, apps en `backend/apps/` como `usuarios`, `pacientes`, `medicos`, `citas`, `documentos`, `turnos`).

- **Puntos de integración clave:**
  - API base: `src/config/api.ts` define `API_BASE_URL` y `API_ENDPOINTS`. Prefiera usar `src/lib/api.ts` y `API_ENDPOINTS` cuando implemente llamadas HTTP.
  - Nota importante: algunos archivos (por ejemplo `src/pages/Registro.tsx`) usan `fetch('http://127.0.0.1:8000/...')` directamente. Si modifica/crea llamadas, unifique hacia `API_ENDPOINTS` o `import.meta.env.VITE_API_URL`.

- **Autenticación y tokens:** el backend usa JWT (`rest_framework_simplejwt`). Endpoints principales están documentados en `backend/README.md` (ej.: `/api/auth/login/`, `/api/usuarios/register/`, `/api/usuarios/me/`). Añade `Authorization: Bearer <token>` en cabeceras.

- **Configuración y variables:**
  - Frontend: `VITE_API_URL` controla el host del API. Vite lee `.env` o `import.meta.env`. Archivo de ejemplo: `src/config/api.ts`.
  - Backend: `backend/config/settings.py` usa `python-decouple` y variables como `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SECRET_KEY`, `CORS_ALLOWED_ORIGINS`.

- **Comandos de desarrollo (rápidos):**
  - Backend (Windows PowerShell):
    - `cd backend; python -m venv venv; .\venv\Scripts\Activate.ps1`
    - `pip install -r requirements.txt`
    - `python manage.py migrate; python manage.py createsuperuser; python manage.py runserver`
  - Frontend (desde la raíz):
    - `npm install` (o `pnpm`/`yarn` según preferencia)
    - Crear `.env` con `VITE_API_URL=http://localhost:8000` o en PowerShell: `$env:VITE_API_URL='http://localhost:8000'; npm run dev`
    - `npm run dev` para arrancar Vite, `npm run build` para producción.

- **Dependencias importantes:**
  - Frontend: `react`, `react-router-dom`, `@supabase/supabase-js` (aparece pero revisar uso), `@tanstack/react-query`, `shadcn-ui`-like components en `src/components/ui`.
  - Backend: `Django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `PyMySQL`, `python-decouple`.

- **Convenciones de código y patrones detectables:**
  - Formularios usan `zod` para validación en frontend (`src/pages/Registro.tsx` muestra `registroSchema`). Mantener validaciones coincidentes con back-end si modifica modelos.
  - UI: usar los componentes de `src/components/ui/*` (Button, Input, Card, etc.) en lugar de HTML crudo para consistencia.
  - Llamadas API: preferir `src/lib/api.ts` u otro wrapper para manejar errores y tokens; varios archivos aún usan `fetch` directo — busca `127.0.0.1:8000` al hacer cambios.

- **Dónde buscar cambios frecuentes / valores mágicos:**
  - Hardcoded API URLs: buscar `127.0.0.1:8000` o rutas `/api/usuarios/register/` (ej.: `grep -R "127.0.0.1:8000" -n`).
  - Modelos / serializadores / endpoints: `backend/apps/*/views.py` y `backend/apps/*/serializers.py`.

- **Testing / validación:**
  - Backend: `python manage.py test`.
  - Frontend: no hay tests automáticos detectados; cuando añadas tests, integrar `vitest` o `jest` según preferencia de equipo.

- **Sugerencias específicas para PRs de código:**
  - Si introduces llamadas al API, actualiza `src/config/api.ts` y evita cadenas de URL fijas en las páginas.
  - Si tocas modelos o endpoints, actualiza `backend/README.md` si cambia la API pública (rutas o parámetros).
  - Mantén la UI usando componentes en `src/components/ui/` y los hooks en `src/hooks/` (`use-toast`, `use-mobile`) para comportamiento y UX consistente.

Si algo en estas instrucciones está incompleto o quieres que añada ejemplos adicionales (p. ej. grep/PowerShell exactos para buscar URLs, o una lista de endpoints faltantes), dime y lo itero.

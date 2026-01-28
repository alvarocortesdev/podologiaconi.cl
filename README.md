# podologiaconi.cl

Sitio web para Podóloga Constanza Cortés: www.podologiaconi.cl

## Descripción del Proyecto

Aplicación web full-stack para la práctica podológica de Constanza Cortés. Incluye un sitio web público con información de servicios, casos de éxito y formulario de cotización, además de un panel administrativo para gestionar servicios.

## Stack Tecnológico

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Email**: Resend API
- **Deployment**: Vercel
- **Arquitectura**: Monorepo con workspaces

## Estructura del Proyecto

```
podologiaconi/
├── apps/
│   ├── client/          # Aplicación React (Frontend)
│   └── server/          # API Express (Backend)
├── packages/
│   ├── database/        # Configuración Prisma y modelos
│   └── config/          # Configuraciones compartidas
└── api/                 # Entry point para Vercel serverless
```

## Setup Local (Desarrollo)

### Prerrequisitos

- Node.js 18+ y npm
- PostgreSQL 14+
- Cuenta en Resend (para envío de emails)

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd podologiaconi
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env` en la raíz del proyecto
   - Completar con tus valores reales:
     - `DATABASE_URL`: String de conexión a PostgreSQL
     - `DIRECT_URL`: String de conexión directa (mismo valor que DATABASE_URL)
     - `RESEND_API_KEY`: API key de Resend
     - `SECRET_KEY`: Clave secreta para JWT (generar una aleatoria y segura)

4. Configurar base de datos:
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
cd packages/database
npx prisma migrate deploy

# (Opcional) Poblar con datos de ejemplo
npx prisma db seed
```

5. Ejecutar en desarrollo:
```bash
# Terminal 1: Frontend (puerto 5173)
cd apps/client
npm run dev

# Terminal 2: Backend (puerto 3000)
cd apps/server
npm run dev
```

## Variables de Entorno Requeridas

Ver archivo `.env.example` para el template completo. Variables necesarias:

- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: PostgreSQL direct connection string
- `RESEND_API_KEY`: API key de Resend para envío de emails
- `SECRET_KEY`: Clave secreta para firmar tokens JWT

## Deployment en Vercel

### Configuración Inicial

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno en el dashboard de Vercel:
   - Ir a Settings → Environment Variables
   - Agregar todas las variables del `.env.example`

### Build Settings

El proyecto está configurado para Vercel con:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `apps/client/dist`
- **Install Command**: `npm install`

### Configuración de Base de Datos

1. Crear base de datos PostgreSQL en Vercel Postgres o servicio externo
2. Obtener connection string y configurar `DATABASE_URL` y `DIRECT_URL`
3. Ejecutar migraciones después del primer deploy:
```bash
npx prisma migrate deploy
```

### API Routes

Las rutas de API están configuradas en `vercel.json`:
- `/api/*` → `api/index.js` (serverless functions)

Endpoints disponibles:
- `GET /api/services` - Listar servicios
- `POST /api/services` - Crear servicio (requiere auth)
- `PUT /api/services/:id` - Actualizar servicio (requiere auth)
- `DELETE /api/services/:id` - Eliminar servicio (requiere auth)
- `POST /api/login` - Autenticación admin
- `POST /api/quote` - Enviar cotización por email

## Scripts Disponibles

- `npm run build` - Build completo (genera Prisma client + build frontend)
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run dev` (en apps/client) - Servidor de desarrollo frontend
- `npm run dev` (en apps/server) - Servidor de desarrollo backend

## Notas Adicionales

- El panel admin está disponible en `/admin`
- Las imágenes de casos de éxito son referenciales (Unsplash)
- El sistema de autenticación usa JWT con expiración de 1 hora

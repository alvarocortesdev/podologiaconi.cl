# Reporte de Progreso y Contexto del Proyecto

**Fecha de actualización:** 28 de Enero, 2026
**Estado:** Funcional / En desarrollo

Este documento resume los cambios realizados, la arquitectura actual y las funcionalidades implementadas para mantener el contexto del proyecto "Podología Coni".

## 1. Resumen de Cambios Recientes

### A. Limpieza y Optimización
- Se eliminaron referencias a redes sociales no solicitadas (Facebook) y la dirección física en el panel de administración y el footer público.
- Se eliminaron imágenes locales no utilizadas (`vite.svg`, `react.svg`) y se limpió la carpeta `assets`.

### B. Panel de Administración (`/admin`)
- **Diseño Simplificado:**
  - Header limpio: Solo título "PodologíaConi" (izquierda) e iconos "Sitio Web" / "Cerrar Sesión" (derecha).
  - Sidebar fija (Sticky): Altura completa (`h-screen`), navegación vertical a la izquierda.
  - **Orden de Menú:** Configuración -> Casos de Éxito -> Servicios -> Perfil.
- **Gestión de Perfil:**
  - Nueva pestaña "Perfil".
  - Cambio de contraseña seguro.
  - Cambio de correo electrónico con **verificación de código de 8 dígitos** (enviado vía Resend).

### C. Integración de Cloudinary
- **Backend:**
  - Configuración de SDK `cloudinary` y `multer` (almacenamiento en memoria).
  - Endpoint `POST /api/upload`: Sube imágenes a carpeta `podologiaconi`.
  - Endpoint `POST /api/upload/delete`: Elimina imágenes de Cloudinary (usando `public_id` o URL).
  - **Automatización:** Al actualizar la configuración del sitio o editar/borrar casos de éxito, el backend elimina automáticamente las imágenes antiguas de Cloudinary para ahorrar espacio.
- **Frontend (`ImageUpload.jsx`):**
  - Componente reutilizable con Drag & Drop (`react-dropzone`).
  - Edición de imagen (`react-easy-crop`): Recorte con aspectos predefinidos (1:1, 16:9, Libre, etc.) y Zoom.
  - **Auto-Upload:** Al confirmar el recorte, la imagen se sube automáticamente.
  - Eliminación directa desde la interfaz.

### D. Mejoras de UX/UI en Admin
- **Sección Configuración (Sobre Mí):** Reemplazo de input de texto URL por componente `ImageUpload`.
- **Modal Casos de Éxito:**
  - Diseño a 2 columnas en escritorio (Info izquierda, Imágenes derecha).
  - Scroll interno para mejor visualización en móviles.
  - Ancho ampliado (`max-w-4xl`).

## 2. Estructura Técnica Clave

### Backend (`apps/server`)
- **Stack:** Node.js, Express, Prisma ORM.
- **Autenticación:** JWT, Bcrypt.
- **Servicios:** Resend (Emails), Cloudinary (Imágenes).
- **Archivos Clave:**
  - `src/index.js`: Lógica principal, rutas de API, configuración de Cloudinary.

### Frontend (`apps/client`)
- **Stack:** React, Tailwind CSS, Vite.
- **Componentes Clave:**
  - `src/pages/Admin.jsx`: Panel principal, gestión de estado, modales.
  - `src/components/ImageUpload.jsx`: Lógica de carga y recorte de imágenes.
  - `src/utils/canvasUtils.js`: Utilidad para procesar recortes de imágenes (Canvas API).
  - `src/layouts/Layout.jsx`: Layout público (header/footer del sitio web).

## 3. Pendientes / Próximos Pasos Sugeridos
- Validar despliegue en producción (Vercel/Render) asegurando que las variables de entorno (`CLOUDINARY_URL`, `RESEND_API_KEY`, etc.) estén configuradas.
- Revisar si se requiere paginación en "Casos de Éxito" si la lista crece mucho.
- Evaluar optimización de imágenes (formatos next-gen como WebP) si el tráfico aumenta (Cloudinary lo hace auto con `f_auto`, ya configurado implícitamente).

---
*Este archivo sirve como memoria para futuras sesiones de desarrollo con agentes de IA.*

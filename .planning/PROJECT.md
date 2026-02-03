# Podología Coni - Refactorización y Mejoras

## What This Is

Sitio web de clínica podológica con panel de administración para gestionar servicios, casos de éxito y contenido. El proyecto está en producción en Vercel con deployment automático desde GitHub.

Esta iniciativa busca refactorizar el código existente aplicando mejores prácticas, mejorar la seguridad, agregar tests, y optimizar el rendimiento manteniendo la lógica actual y el enfoque mobile-first.

## Core Value

El sitio web debe seguir funcionando sin interrupciones mientras mejoramos su calidad técnica, seguridad y mantenibilidad.

## Requirements

### Validated

- ✓ Sistema de autenticación con JWT y 2FA — existing
- ✓ Gestión de servicios (CRUD) — existing
- ✓ Casos de éxito con imágenes — existing
- ✓ Tarjetas "sobre nosotros" — existing
- ✓ Subida de imágenes a Cloudinary — existing
- ✓ Panel de administración funcional — existing
- ✓ Envío de emails vía Resend — existing
- ✓ Diseño responsive básico — existing

### Active

- [ ] Refactorizar Admin.jsx (2,153 líneas) en componentes modulares
- [ ] Modularizar servidor Express (862 líneas) en rutas separadas
- [ ] Implementar tests unitarios y de integración
- [ ] Agregar validación de inputs con Zod
- [ ] Implementar protección CSRF
- [ ] Mejorar rate limiting para serverless
- [ ] Agregar paginación en endpoints de listado
- [ ] Implementar lazy loading para componentes pesados
- [ ] Optimizar para mobile-first
- [ ] Eliminar console.logs y mejorar manejo de errores
- [ ] Agregar health check endpoint
- [ ] Documentar API con Swagger/OpenAPI

### Out of Scope

- Cambio de stack tecnológico — El proyecto usa React/Express/Prisma que funciona bien
- Rediseño completo de UI — Se mantiene el diseño actual, solo mejoras técnicas
- Nuevas features de negocio — Este es un proyecto de refactorización, no de nuevas funcionalidades
- Migración a TypeScript — Fuera del alcance actual, podría considerarse en futuro
- Cambio de base de datos — PostgreSQL con Prisma funciona correctamente

## Context

**Estado actual del codebase:**
- Monorepo con apps/client, apps/server, packages/database
- React 19 + Express 5 + Prisma 5 + PostgreSQL
- Deployment en Vercel con serverless functions
- Autenticación JWT con scopes (setup, 2fa, full)
- Sin tests actualmente
- Componentes monolíticos que dificultan mantenimiento
- Sin validación estructurada de inputs
- Rate limiting en memoria (no funciona bien en serverless)

**Deuda técnica identificada:**
- Admin.jsx: 2,153 líneas con 50+ variables de estado
- Server index.js: 862 líneas monolítico
- Múltiples console.log en producción
- Eslint-disable comments que ocultan problemas reales
- No hay manejo de errores estructurado

**Riesgos de seguridad:**
- Sin protección CSRF
- Sin validación de inputs con schemas
- Rate limiting no efectivo en serverless
- Sin headers de seguridad con Helmet

**Oportunidades de performance:**
- No hay paginación (carga todos los registros)
- Componentes pesados no usan lazy loading
- Sin optimización de imágenes

## Constraints

- **Tech stack:** Mantener React 19, Express 5, Prisma 5, PostgreSQL
- **Deployment:** Debe seguir funcionando en Vercel con GitHub
- **Mobile-first:** Todas las mejoras deben mantener/respetar diseño responsive
- **Backward compatibility:** No romper la API existente ni la base de datos
- **Timeline:** Sin prisa, calidad sobre velocidad
- **Fases:** Abordar por fases ordenadas, no todo a la vez

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mantener stack actual | Funciona bien, cambio sería costoso y riesgoso | — Pending |
| Fases ordenadas vs paralelo | Menor riesgo, permite validar cada mejora | — Pending |
| Priorizar seguridad y tests | Base sólida antes de refactorizar | — Pending |
| Mobile-first obligatorio | El tráfico mayoritario es móvil | — Pending |

---
*Last updated: 2026-02-03 after initialization*

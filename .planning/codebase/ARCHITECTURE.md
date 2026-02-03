# Architecture

**Analysis Date:** 2026-02-03

## Pattern Overview

**Overall:** Monolithic Full-Stack Application with Monorepo Structure

**Key Characteristics:**
- **Monorepo:** Workspaces-based organization with `apps/` and `packages/`
- **Separation of Concerns:** Clear split between frontend (React), backend (Express), and shared database layer
- **Serverless-Ready:** Backend designed for Vercel serverless functions via `api/` adapter
- **Single-Page Application (SPA):** React Router handles client-side routing
- **Flat Route Structure:** All API routes defined in single `index.js` file (not modularized)

## Layers

**Presentation Layer (Frontend):**
- Purpose: User interface and client-side state management
- Location: `apps/client/src/`
- Contains: React components, pages, layouts, context providers
- Depends on: Backend API via HTTP fetch, Cloudinary for image optimization
- Used by: Browser clients

**Application Layer (Backend):**
- Purpose: HTTP request handling, business logic, authentication
- Location: `apps/server/src/index.js` (monolithic)
- Contains: Express routes, middleware, service logic
- Depends on: Database layer (`@podologiaconi/database`), Cloudinary, Resend email
- Used by: Frontend via REST API

**Data Layer (Database):**
- Purpose: Data persistence and Prisma client
- Location: `packages/database/`
- Contains: Prisma schema, migrations, PrismaClient instance
- Depends on: PostgreSQL database
- Used by: Backend application layer

**Infrastructure Layer:**
- Purpose: External service integrations and deployment adapters
- Location: `api/index.js` (Vercel adapter), cloud utilities
- Contains: Vercel serverless adapter, Cloudinary utilities
- Depends on: Cloudinary, Resend

## Data Flow

**Client Request Flow:**

1. **Browser** requests page → Vite dev server (dev) or static files (production)
2. **React Router** matches route and renders appropriate page component
3. **ConfigProvider** fetches initial data (`/api/config`, `/api/success-cases`, `/api/about-cards`)
4. **Page components** display data from context or make additional API calls

**Admin API Flow:**

1. **Browser** sends request to `/api/*` → Vercel serverless function (via `api/index.js`)
2. **Express app** receives request, applies CORS and JSON parsing middleware
3. **Authentication middleware** validates JWT token from cookie or header
4. **Scope middleware** checks required permission scope (`setup`, `2fa`, `full`)
5. **Route handler** performs business logic and Prisma database operations
6. **Response** returned as JSON

**Image Upload Flow:**

1. **Client** selects image → `ImageUpload` component handles cropping
2. **Browser** sends file to `/api/upload` with auth token
3. **Server** validates file type/size, uploads to Cloudinary
4. **Cloudinary** returns URL → stored in database via Prisma
5. **Old images** automatically deleted from Cloudinary when replaced

**State Management:**
- **Global Config:** `ConfigContext` provides site-wide configuration, success cases, and about cards
- **Local State:** React `useState` for component-specific state
- **URL State:** React Router for navigation state
- **No State Library:** No Redux, Zustand, or Jotai detected

## Key Abstractions

**Context Pattern:**
- Purpose: Share global configuration and data across component tree
- Examples: `apps/client/src/context/ConfigContext.jsx`, `apps/client/src/context/IntroContext.jsx`
- Pattern: React Context API with custom provider components

**Middleware Pipeline:**
- Purpose: Cross-cutting concerns (auth, rate limiting)
- Examples: `authenticateToken`, `requireAuthScope`, `createRateLimiter` (all in `apps/server/src/index.js`)
- Pattern: Express middleware functions composed inline

**Prisma Client Singleton:**
- Purpose: Database access abstraction
- Location: `packages/database/src/index.js`
- Pattern: Single PrismaClient instance exported and shared

**Cloudinary Integration:**
- Purpose: Image storage and optimization
- Location: `apps/server/src/index.js` (upload), `apps/client/src/utils/cloudinary.js` (URL building)
- Pattern: Direct SDK usage on server, URL transformation utilities on client

## Entry Points

**Client Entry Point:**
- Location: `apps/client/src/main.jsx`
- Triggers: Browser page load
- Responsibilities: Mount React app to DOM, enable StrictMode

**Client Router Entry:**
- Location: `apps/client/src/App.jsx`
- Triggers: Client navigation
- Responsibilities: Define routes, wrap with ConfigProvider, lazy load heavy pages

**Server Entry Point:**
- Location: `apps/server/src/index.js`
- Triggers: HTTP request (local dev or Vercel serverless)
- Responsibilities: Configure Express, define routes, handle requests

**Vercel Serverless Entry:**
- Location: `api/index.js`
- Triggers: Vercel serverless function invocation
- Responsibilities: Import and export Express app for serverless environment

**Database Entry Point:**
- Location: `packages/database/src/index.js`
- Triggers: Server module import
- Responsibilities: Create PrismaClient instance

## Error Handling

**Strategy:** Try-catch blocks with JSON error responses

**Patterns:**
- Server: Wrap async handlers in try-catch, return `{ error: 'message' }` with 4xx/5xx status
- Client: Basic error handling in fetch calls, graceful fallbacks in ConfigContext with `safeJson` helper
- No centralized error handling middleware detected

## Cross-Cutting Concerns

**Logging:**
- Approach: `console.error` for server errors, no structured logging
- Locations: Error handlers in route functions

**Validation:**
- Approach: Manual validation in route handlers
- Patterns: Type checking, length validation, email format checking

**Authentication:**
- Approach: JWT tokens in cookies or Authorization header
- Scopes: `setup` (initial setup), `2fa` (two-factor pending), `full` (authenticated)
- Token expiration: 8 hours for full auth, 15 minutes for temporary tokens

**Rate Limiting:**
- Approach: In-memory Map-based rate limiting (not production-ready for multi-instance)
- Locations: Applied to login, auth, quote, and upload endpoints

---

*Architecture analysis: 2026-02-03*

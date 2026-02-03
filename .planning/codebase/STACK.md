# Technology Stack

**Analysis Date:** 2026-02-03

## Languages

**Primary:**
- JavaScript (ES2020+) - All application code
  - `apps/client/src/**/*.{js,jsx}` - Frontend React components
  - `apps/server/src/**/*.js` - Backend Express API
  - `packages/database/src/**/*.js` - Database client

**Configuration:**
- JSON - Package manifests and configuration files
- Prisma Schema - Database schema definition (`packages/database/prisma/schema.prisma`)

## Runtime

**Environment:**
- Node.js 18+ (verified v22.20.0 in environment)

**Package Manager:**
- npm (workspaces enabled)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.0 - Frontend UI library (`apps/client/package.json`)
- Express 5.2.1 - Backend API framework (`apps/server/package.json`)
- Prisma 5.10.0 - ORM and database client (`packages/database/package.json`)

**Build/Dev:**
- Vite 6.4.0 - Frontend build tool and dev server (`apps/client/vite.config.js`)
- @vitejs/plugin-react-swc - Fast React compilation with SWC
- Tailwind CSS 4.1.18 - Utility-first CSS framework (`apps/client/tailwind.config.cjs`)
- PostCSS 8.5.6 - CSS processing with autoprefixer

**UI/UX Libraries:**
- @dnd-kit/core 6.3.1 - Drag and drop interactions
- @dnd-kit/sortable 10.0.0 - Sortable lists
- react-quill-new 3.7.0 - Rich text editor
- react-easy-crop 5.5.6 - Image cropping
- react-dropzone 14.3.8 - File upload handling
- lucide-react 0.563.0 - Icon library
- react-toastify 11.0.5 - Toast notifications
- clsx 2.1.1 + tailwind-merge 3.4.0 - Conditional class merging
- dompurify 3.1.7 - XSS protection for HTML content

**Backend Libraries:**
- bcryptjs 3.0.3 - Password hashing
- jsonwebtoken 9.0.3 - JWT authentication
- cookie-parser 1.4.7 - Cookie handling
- cors 2.8.6 - Cross-origin resource sharing
- multer 2.0.2 - File upload middleware
- dotenv 17.2.3 - Environment variable management
- crypto (built-in) - Cryptographic functions

## Key Dependencies

**Critical:**
- @prisma/client 5.10.0 - Database ORM client
- react-router-dom 7.13.0 - Client-side routing
- resend 6.8.0 - Email service API
- cloudinary 2.9.0 - Image hosting and transformation

**Infrastructure:**
- PostgreSQL - Database (via Prisma)
- Vercel - Deployment platform

## Configuration

**Environment:**
- Configuration via `.env` files (not committed)
- Template provided in `.env.example`
- Required variables:
  - `DATABASE_URL` - PostgreSQL connection string
  - `DIRECT_URL` - PostgreSQL direct connection string
  - `RESEND_API_KEY` - Email service API key
  - `SECRET_KEY` - JWT signing secret
  - `MAIL_FROM` - Sender email address
  - `MAIL_TO` - Recipient email addresses (comma-separated)
  - `APP_ORIGINS` - Allowed CORS origins (comma-separated)
  - `CLOUDINARY_URL` - Cloudinary configuration (auto-loaded)

**Build:**
- `vercel.json` - Vercel deployment configuration
- `apps/client/vite.config.js` - Vite build settings
  - Chunk splitting: vendor (react, router), editor (quill)
  - Chunk size warning: 1500kb
- `apps/client/tailwind.config.cjs` - Tailwind customization
  - Custom colors: primary (#1c4d4d), secondary (#febc7c), background (#fcecd5)
  - Custom fonts: Lato (display), Inter (sans)
  - Custom animations: float, fade-in-up, slide-up
- `apps/client/eslint.config.js` - ESLint flat config
  - React Hooks and React Refresh plugins
  - Browser globals

**Package Scripts:**
- Root: `npm run build` - Full build (Prisma generate + client build)
- Root: `npm run prisma:generate` - Generate Prisma client
- Client: `npm run dev` - Vite dev server
- Client: `npm run build` - Production build
- Client: `npm run lint` - ESLint check
- Server: `npm run dev` - Node.js dev server

## Platform Requirements

**Development:**
- Node.js 18+
- npm with workspaces support
- PostgreSQL 14+ (local or remote)
- Resend account (for email testing)

**Production:**
- Vercel (configured in `vercel.json`)
- Vercel Postgres or external PostgreSQL
- Cloudinary account (for image storage)
- Resend account (for transactional emails)

**Security Headers (Vercel):**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restricted
- Strict-Transport-Security: HSTS enabled
- Content-Security-Policy: Strict CSP with defined sources

---

*Stack analysis: 2026-02-03*

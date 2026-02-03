# External Integrations

**Analysis Date:** 2026-02-03

## APIs & External Services

**Email Service:**
- Resend (resend.com)
  - Purpose: Transactional email delivery
  - SDK: `resend` npm package v6.8.0
  - Auth: `RESEND_API_KEY` environment variable
  - Usage: Quote form submissions (`apps/server/src/index.js`)
  - Sender: Configurable via `MAIL_FROM` env var
  - Recipients: Configurable via `MAIL_TO` env var

**Image Hosting & CDN:**
- Cloudinary (cloudinary.com)
  - Purpose: Image upload, storage, and on-the-fly transformations
  - SDK: `cloudinary` npm package v2.9.0
  - Auth: `CLOUDINARY_URL` environment variable (auto-loaded)
  - Features:
    - Image upload via API (`apps/server/src/index.js`)
    - Automatic image deletion when records removed
    - Responsive image generation with srcset
    - Transformations: format auto, quality auto, cropping
  - Client utilities: `apps/client/src/utils/cloudinary.js`
  - Domain: `res.cloudinary.com` (CSP and preconnect configured)

**Fonts:**
- Google Fonts
  - Families: Lato, Inter
  - Loading: Preconnect + font-loader.js script
  - CSP: `https://fonts.googleapis.com` (styles), `https://fonts.gstatic.com` (fonts)

## Data Storage

**Primary Database:**
- PostgreSQL
  - Connection: `DATABASE_URL` and `DIRECT_URL` env vars
  - ORM: Prisma Client v5.10.0
  - Schema: `packages/database/prisma/schema.prisma`
  - Models:
    - `Service` - Service catalog
    - `Admin` - Admin user accounts with 2FA
    - `Contact` - Contact form submissions
    - `SiteConfig` - Site configuration and content
    - `AboutCard` - About section cards
    - `SuccessCase` - Before/after case studies

**File Storage:**
- Cloudinary (primary for user-uploaded images)
- Local filesystem: Temporary file handling via multer memory storage

**Caching:**
- Vercel Edge Network caching (configured in `vercel.json`)
  - Assets: 1 year immutable cache
  - API: no-store (no caching)
  - Pages: 0 max-age, 60s s-maxage, 24h stale-while-revalidate

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication
  - Library: `jsonwebtoken` v9.0.3
  - Secret: `SECRET_KEY` environment variable
  - Cookie: `admin_token` HTTP-only cookie
  - Expiration: 1 hour
  - Password hashing: bcryptjs v3.0.3

**Two-Factor Authentication (2FA):**
- Email-based OTP
  - Verification codes sent via Resend
  - Code expiration managed in database
  - Default users: `dev` and `admin` (require setup on first login)

## Monitoring & Observability

**Error Tracking:**
- None detected (console.error used for logging)

**Logs:**
- Console logging to stdout/stderr
- Cloudinary operations logged
- No external log aggregation service

## CI/CD & Deployment

**Hosting:**
- Vercel (vercel.com)
  - Framework: Vite
  - Build command: `npm run build`
  - Output directory: `apps/client/dist`
  - Serverless functions: `api/index.js` (max duration: 10s)

**CI Pipeline:**
- None detected (manual deployment via Vercel)

**Git:**
- Repository tracked in Git
- `.gitignore` excludes: node_modules, .env files, dist

## Environment Configuration

**Required env vars:**
| Variable | Purpose | Location |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection | Root `.env` |
| `DIRECT_URL` | PostgreSQL direct connection | Root `.env` |
| `RESEND_API_KEY` | Email API authentication | Root `.env` |
| `SECRET_KEY` | JWT signing secret | Root `.env` |
| `MAIL_FROM` | Email sender address | Root `.env` |
| `MAIL_TO` | Email recipient(s) | Root `.env` |
| `APP_ORIGINS` | CORS allowed origins | Root `.env` |
| `CLOUDINARY_URL` | Cloudinary config (auto) | Environment |

**Secrets location:**
- Development: `.env` file (gitignored)
- Production: Vercel Environment Variables dashboard
- Never committed to repository

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## API Endpoints

**Public Endpoints:**
- `GET /api/services` - List all services
- `POST /api/quote` - Submit quote form (triggers Resend email)
- `GET /api/config` - Get site configuration

**Authenticated Endpoints (require JWT):**
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/upload` - Upload image to Cloudinary
- `POST /api/admin/setup` - Complete admin setup (2FA)
- `POST /api/admin/verify` - Verify OTP code
- `POST /api/admin/change-password` - Change password

**Authentication Endpoints:**
- `POST /api/login` - Authenticate and receive JWT cookie
- `POST /api/logout` - Clear authentication cookie

## Security Considerations

**CORS:**
- Configured via `APP_ORIGINS` environment variable
- Dynamic origin validation in Express middleware
- Credentials enabled for cookie transmission

**Content Security Policy:**
- Strict CSP configured in Vercel headers
- Allowed image sources: self, data, Cloudinary, placehold.co
- Allowed fonts: self, data, Google Fonts
- Allowed styles: self, unsafe-inline, Google Fonts
- Allowed scripts: self (with specific hash)
- Allowed connections: self, Resend API

**Authentication Flow:**
1. Login with username/password
2. On first login: Email verification + password change + 2FA setup
3. Subsequent logins: Username/password + 2FA code
4. JWT issued as HTTP-only cookie
5. Cookie validated on protected routes

---

*Integration audit: 2026-02-03*

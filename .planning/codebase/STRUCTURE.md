# Codebase Structure

**Analysis Date:** 2026-02-03

## Directory Layout

```
podologiaconi/
├── .planning/
│   └── codebase/           # Architecture documentation
├── api/
│   └── index.js            # Vercel serverless adapter
├── apps/
│   ├── client/             # React frontend
│   │   ├── public/         # Static assets (favicon, fonts)
│   │   └── src/
│   │       ├── assets/     # Images and static files
│   │       ├── components/ # Reusable UI components
│   │       ├── context/    # React context providers
│   │       ├── layouts/    # Page layout wrappers
│   │       ├── pages/      # Route-level page components
│   │       └── utils/      # Client-side utilities
│   └── server/
│       └── src/
│           ├── controllers/# Empty (logic in index.js)
│           ├── middleware/ # Empty (logic in index.js)
│           └── index.js    # Main Express application
├── packages/
│   └── database/
│       ├── prisma/
│       │   ├── migrations/ # Database migrations
│       │   └── schema.prisma
│       └── src/
│           └── index.js    # Prisma client export
├── .env                    # Environment variables (not committed)
├── package.json            # Root workspace configuration
└── README.md
```

## Directory Purposes

**`apps/client/src/components/`:**
- Purpose: Reusable UI components
- Contains: `ImageUpload.jsx`, `SortableCard.jsx`, `RichTextEditor.jsx`, `SkeletonCard.jsx`
- Key files: `ImageUpload.jsx` (complex image cropping/upload component)

**`apps/client/src/context/`:**
- Purpose: React Context API providers
- Contains: Global state providers
- Key files: `ConfigContext.jsx` (site config), `IntroContext.jsx` (animation state)

**`apps/client/src/layouts/`:**
- Purpose: Page layout wrappers
- Contains: Navigation, footer, shared structure
- Key files: `Layout.jsx` (main layout with nav, footer, intro animation)

**`apps/client/src/pages/`:**
- Purpose: Route-level components
- Contains: Page views
- Key files: `Home.jsx` (landing), `Services.jsx` (services list), `Admin.jsx` (admin dashboard)

**`apps/client/src/utils/`:**
- Purpose: Client-side helper functions
- Contains: Utility modules
- Key files: `cloudinary.js` (URL transformations), `canvasUtils.js` (image processing)

**`apps/server/src/`:**
- Purpose: Backend API
- Contains: Express application
- Key files: `index.js` (862 lines - all routes defined here)
- Note: `routes/` and `controllers/` directories exist but are empty

**`packages/database/prisma/`:**
- Purpose: Database schema and migrations
- Contains: Prisma schema, migration files
- Key files: `schema.prisma` (defines Service, Admin, Contact, SiteConfig, AboutCard, SuccessCase models)

**`api/`:**
- Purpose: Vercel serverless function adapter
- Contains: Entry point for Vercel deployment
- Key files: `index.js` (imports server app)

## Key File Locations

**Entry Points:**
- `apps/client/src/main.jsx`: React application mount point
- `apps/client/src/App.jsx`: React Router configuration
- `apps/server/src/index.js`: Express server application
- `api/index.js`: Vercel serverless adapter

**Configuration:**
- `apps/client/vite.config.js`: Vite build configuration
- `apps/client/tailwind.config.cjs`: Tailwind CSS configuration
- `apps/client/eslint.config.js`: ESLint rules
- `package.json` (root): Workspace configuration

**Core Logic:**
- `apps/server/src/index.js`: All API routes and middleware (monolithic)
- `apps/client/src/pages/Admin.jsx`: Admin dashboard (814 lines - heaviest component)
- `apps/client/src/layouts/Layout.jsx`: Main layout with navigation and intro animation

**Testing:**
- Not detected - no test files or test configuration found

## Naming Conventions

**Files:**
- Components: PascalCase (`Home.jsx`, `Admin.jsx`, `ImageUpload.jsx`)
- Utilities: camelCase (`cloudinary.js`, `canvasUtils.js`)
- Context: PascalCase with Context suffix (`ConfigContext.jsx`, `IntroContext.jsx`)
- Styles: camelCase (`index.css`, `App.css`)

**Directories:**
- Lowercase, plural (`components/`, `pages/`, `utils/`, `context/`)

**Database Models:**
- PascalCase singular (`Service`, `Admin`, `SiteConfig`, `AboutCard`, `SuccessCase`)

**API Routes:**
- Lowercase with hyphens (`/api/about-cards`, `/api/success-cases`)
- RESTful patterns (`GET /api/services`, `POST /api/services`, `PUT /api/services/:id`)

## Where to Add New Code

**New Feature (Client-Side):**
- Component: `apps/client/src/components/[ComponentName].jsx`
- Page: `apps/client/src/pages/[PageName].jsx`
- Utility: `apps/client/src/utils/[utilityName].js`
- Context: `apps/client/src/context/[Name]Context.jsx`
- Route: Register in `apps/client/src/App.jsx`

**New Feature (Server-Side):**
- Currently: Add to `apps/server/src/index.js` (existing pattern)
- Preferred: Create in `apps/server/src/routes/[resource].js` and import (directories exist but unused)

**New Database Model:**
- Schema: `packages/database/prisma/schema.prisma`
- Migration: Run `npm run prisma:generate` from root
- Usage: Available via `prisma` export from `@podologiaconi/database`

**New API Endpoint:**
- Location: `apps/server/src/index.js`
- Pattern: `app.[method]('/api/[path]', [middleware...], async (req, res) => { ... })`

**New Environment Variable:**
- Server: Add to `.env`, access via `process.env.VAR_NAME`
- Build-time: May need to expose in Vite config for client

## Special Directories

**`apps/client/dist/`:**
- Purpose: Production build output
- Generated: Yes (by `vite build`)
- Committed: No (in .gitignore)

**`apps/client/public/`:**
- Purpose: Static assets copied to dist root
- Contents: favicon files, `font-loader.js`, `robots.txt`, `sitemap.xml`
- Committed: Yes

**`packages/database/prisma/migrations/`:**
- Purpose: Database migration history
- Generated: Yes (by `prisma migrate`)
- Committed: Yes

**`node_modules/`:**
- Purpose: Dependencies
- Generated: Yes (by npm install)
- Committed: No

**`.opencode/`:**
- Purpose: OpenCode IDE configuration
- Generated: IDE-specific
- Committed: May contain personal settings

---

*Structure analysis: 2026-02-03*

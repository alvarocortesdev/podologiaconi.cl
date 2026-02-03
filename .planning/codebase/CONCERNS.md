# Codebase Concerns

**Analysis Date:** 2026-02-03

## Tech Debt

### Monolithic Components
- **Issue:** `Admin.jsx` is 2,153 lines with 50+ state variables, mixing auth flows, CRUD operations, and UI rendering
- **Files:** `apps/client/src/pages/Admin.jsx`
- **Impact:** Difficult to maintain, test, and modify safely. High risk of introducing bugs when changing functionality
- **Fix approach:** Split into separate components: `LoginForm`, `SetupForm`, `TwoFactorForm`, `ServicesManager`, `SuccessCasesManager`, `AboutCardsManager`, `ProfileManager`

### Monolithic Server
- **Issue:** `index.js` is 862 lines with all routes, middleware, and business logic in one file
- **Files:** `apps/server/src/index.js`
- **Impact:** Hard to navigate, no separation of concerns, difficult to test individual endpoints
- **Fix approach:** Organize into route modules (`routes/services.js`, `routes/auth.js`, `routes/config.js`, etc.) with controller separation

### Console Logging in Production
- **Issue:** Multiple `console.log` statements throughout client and server code
- **Files:** `apps/client/src/components/ImageUpload.jsx` (lines 29, 35, 42, 50, 66, 106, 111), `apps/server/src/index.js` (lines 550, 574)
- **Impact:** Information leakage, performance overhead, cluttered production logs
- **Fix approach:** Replace with proper logging framework (pino/winston) with log levels, or remove debug logs before deployment

### Eslint Disable Comments
- **Issue:** Multiple `eslint-disable-next-line react-hooks/exhaustive-deps` comments bypassing React best practices
- **Files:** `apps/client/src/layouts/Layout.jsx` (lines 82, 111), `apps/client/src/pages/Admin.jsx`
- **Impact:** Missing dependencies can cause stale closures and bugs
- **Fix approach:** Properly declare all dependencies or extract logic into stable references

## Security Considerations

### In-Memory Rate Limiting
- **Risk:** Rate limiting uses in-memory Map (`hits`) which won't persist across serverless function invocations on Vercel
- **Files:** `apps/server/src/index.js` (lines 132-149)
- **Current mitigation:** Basic per-IP tracking within single instance
- **Recommendations:** Use Redis or database-backed rate limiting for serverless environments, or configure Vercel Edge Config

### No CSRF Protection
- **Risk:** State-changing endpoints don't verify request origin
- **Files:** All POST/PUT/DELETE endpoints in `apps/server/src/index.js`
- **Current mitigation:** CORS configured but not sufficient for CSRF
- **Recommendations:** Implement CSRF tokens for cookie-based auth, or use double-submit cookie pattern

### No Helmet Middleware
- **Risk:** Missing security headers middleware could expose to common attacks
- **Files:** `apps/server/src/index.js`
- **Current mitigation:** Some headers set in `vercel.json`
- **Recommendations:** Add `helmet` middleware for comprehensive security headers

### JWT Secret in Example File
- **Risk:** `.env.example` contains placeholder secret that could be accidentally committed
- **Files:** `.env.example` (line 18)
- **Current mitigation:** Just a placeholder value
- **Recommendations:** Add comment warning about generating secure random string, or leave blank with validation

### Input Validation Gaps
- **Risk:** No schema validation library used; manual validation only checks presence
- **Files:** All API endpoints in `apps/server/src/index.js`
- **Current mitigation:** Basic type checking and presence validation
- **Recommendations:** Implement Zod or Joi for comprehensive request validation

## Performance Bottlenecks

### No Database Connection Pooling Config
- **Problem:** Default Prisma connection settings may not be optimal for serverless
- **Files:** `packages/database/prisma/schema.prisma`
- **Cause:** No explicit connection pool size or timeout configuration
- **Improvement path:** Add `connection_limit` and `pool_timeout` to datasource configuration

### Large Bundle Size Risk
- **Problem:** Admin component imports heavy libraries (react-quill-new, react-easy-crop, @dnd-kit) even for public pages
- **Files:** `apps/client/src/pages/Admin.jsx`
- **Cause:** No route-based code splitting for heavy dependencies
- **Improvement path:** Lazy load heavy editor and cropper components, split admin bundle

### No Pagination
- **Problem:** All services, cases, and cards fetched at once
- **Files:** `apps/server/src/index.js` (lines 323-330, 615-622)
- **Cause:** No pagination implemented on list endpoints
- **Impact:** Will degrade as data grows; all records loaded into memory
- **Improvement path:** Add pagination parameters to all list endpoints

## Fragile Areas

### Cloudinary URL Parsing
- **Files:** `apps/server/src/index.js` (lines 50-69)
- **Why fragile:** String manipulation assumes specific URL structure; will break if Cloudinary changes format or if different folder structures used
- **Safe modification:** Add comprehensive URL format tests before modifying
- **Test coverage:** No tests exist for this critical utility

### Optimistic Updates Without Rollback
- **Files:** `apps/client/src/pages/Admin.jsx` (lines 744-796)
- **Why fragile:** UI state updated before API confirmation, but rollback only happens on catch - network errors may leave UI out of sync
- **Safe modification:** Use React Query or SWR for proper caching and synchronization
- **Test coverage:** No integration tests for update flows

### Prisma Transaction Usage
- **Files:** `apps/server/src/index.js` (lines 563-570)
- **Why fragile:** About card reordering uses `$transaction` but no rollback handling if individual updates fail mid-transaction
- **Safe modification:** Wrap in try-catch with explicit rollback logic or use interactive transactions

### Hardcoded SiteConfig ID
- **Files:** `apps/server/src/index.js` (lines 554, 585, 492), `packages/database/prisma/schema.prisma` (line 76)
- **Why fragile:** Assumes single site config with ID=1; won't scale to multi-tenant
- **Safe modification:** Make siteConfigId dynamic or remove hardcoding

## Scaling Limits

### Database: Single SiteConfig Record
- **Current capacity:** Single record with ID=1 for all site configuration
- **Limit:** Cannot support multiple locations or tenants
- **Scaling path:** Refactor to support multiple site configs or add tenant_id to all models

### Rate Limiting Storage
- **Current capacity:** In-memory Map with 15-minute window
- **Limit:** Resets on every serverless cold start; ineffective under load
- **Scaling path:** Implement Redis-backed rate limiting

### Image Storage
- **Current capacity:** Cloudinary free tier (25GB storage, 25K transformations/month)
- **Limit:** Will hit limits with high traffic or many success cases
- **Scaling path:** Monitor usage, implement image compression/optimization, consider CDN caching strategy

## Dependencies at Risk

### react-quill-new
- **Risk:** Wrapper around Quill editor which has had maintenance issues; "new" fork may not have long-term support
- **Impact:** Rich text editor is critical for case descriptions
- **Migration plan:** Consider migrating to TipTap or Lexical if maintenance issues arise

### Prisma on Serverless
- **Risk:** Connection management challenges with serverless functions
- **Impact:** Database connection exhaustion under load
- **Migration plan:** Use Prisma Accelerate (connection pooling service) or migrate to Drizzle with better serverless support

## Missing Critical Features

### Test Coverage
- **What's missing:** No test files found in entire codebase
- **Blocks:** Safe refactoring, CI/CD confidence, regression prevention
- **Priority:** HIGH - Add Jest/Vitest with React Testing Library for components, Supertest for API

### Error Tracking
- **What's missing:** No Sentry, LogRocket, or similar error monitoring
- **Blocks:** Production debugging, knowing when users encounter errors
- **Priority:** HIGH - Add Sentry integration for both client and server

### Health Check Endpoint
- **What's missing:** No `/health` or `/status` endpoint for monitoring
- **Blocks:** Deployment health checks, load balancer configuration
- **Priority:** MEDIUM - Add simple health endpoint that checks database connectivity

### Backup Strategy
- **What's missing:** No automated database backup configuration documented
- **Blocks:** Disaster recovery, data loss protection
- **Priority:** HIGH - Configure automated PostgreSQL backups (daily minimum)

### API Documentation
- **What's missing:** No OpenAPI/Swagger documentation for endpoints
- **Blocks:** API discoverability, client generation, testing
- **Priority:** MEDIUM - Add Swagger UI or generate docs from code

### Form Validation Library
- **What's missing:** No client-side form validation library (Formik, React Hook Form + Zod)
- **Blocks:** Consistent validation, error messaging, form state management
- **Priority:** MEDIUM - Implement React Hook Form with Zod resolver

## Test Coverage Gaps

### Authentication Flows
- **What's not tested:** Login, 2FA, setup, password change, email change
- **Files:** `apps/server/src/index.js` (lines 156-318), `apps/client/src/pages/Admin.jsx`
- **Risk:** Security vulnerabilities, broken auth flows
- **Priority:** CRITICAL

### CRUD Operations
- **What's not tested:** Services, success cases, about cards, site config
- **Files:** All API endpoints and admin forms
- **Risk:** Data corruption, accidental deletion
- **Priority:** HIGH

### Image Upload Pipeline
- **What's not tested:** Cropping, Cloudinary upload, deletion, URL parsing
- **Files:** `apps/client/src/components/ImageUpload.jsx`, `apps/server/src/index.js` (lines 702-752)
- **Risk:** Failed uploads, orphaned images, broken image URLs
- **Priority:** MEDIUM

---

*Concerns audit: 2026-02-03*

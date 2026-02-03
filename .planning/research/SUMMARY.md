# Project Research Summary

**Project:** Podología Coni Website Refactor  
**Domain:** Healthcare clinic website with React 19 + Express 5 + Prisma 5 + PostgreSQL  
**Researched:** 2026-02-03  
**Confidence:** HIGH

## Executive Summary

This research covers the refactoring of a podiatry clinic website from monolithic components (2,153-line Admin.jsx, 862-line server) to a modular, tested, and secure architecture. The project uses React 19.2 with Express 5.2, Prisma 5.10, and PostgreSQL, deployed on Vercel serverless infrastructure.

Based on current best practices (React 19 stable release Dec 2024, Express 5 migration patterns, Vitest 4.x ecosystem), the recommended approach is **incremental refactoring with tests first**. The codebase currently has zero tests, making any refactoring risky. The strategy should follow the Strangler Fig Pattern: build new modular components alongside the monolithic ones, gradually migrating functionality while maintaining backward compatibility. Security hardening with Helmet, Zod validation, and proper CSRF protection (without the archived `csurf` package) is essential for healthcare data compliance.

Key risks include the "Big Bang" refactor trap (attempting to rewrite everything at once), state management explosion during component extraction, Vercel serverless timeouts (10s limit), and breaking mobile-first responsiveness that affects 60%+ of users. These can be mitigated through incremental commits, establishing state ownership patterns early, keeping requests under 5s, and mobile testing every extracted component.

## Key Findings

### Recommended Stack

The stack research identifies modern, Vite-native tools that integrate seamlessly with the existing React 19 + Express 5 architecture. **Vitest 4.x** is the clear choice for testing—it's 10x faster than Jest, has native ESM/TypeScript support, and reuses the existing Vite configuration. For validation, **Zod 4.3.6** (released January 2025) provides TypeScript-first runtime validation with JSON Schema conversion and better error customization. Security relies on **Helmet 8.x** for HTTP headers, **express-rate-limit** for DDoS protection, and a custom double-submit cookie pattern for CSRF protection (the `csurf` package was archived in May 2025 with known vulnerabilities).

**Core technologies:**
- **Vitest 4.0.17**: Test runner — Vite-native, Jest-compatible API, fastest option for React 19
- **@testing-library/react 16.2.0**: Component testing — Industry standard, behavior-focused testing
- **Zod 4.3.6**: Schema validation — TypeScript-first, 2kb core, static type inference, JSON Schema support
- **Helmet 8.0.0**: HTTP security headers — Sets 13 security headers including CSP, HSTS, X-Frame-Options
- **express-rate-limit 7.5.0**: Rate limiting — Critical for API endpoints, serverless-compatible
- **TypeScript 5.7.3 + ESLint 9.18.0 + Prettier 3.4.2**: Code quality — Strict mode required for Zod, flat config standard

### Expected Features

**Table stakes (must-have for production healthcare app):**
- **Testing Infrastructure (Vitest + RTL)** — Critical for safe refactoring; zero tests currently
- **Input Validation (Zod)** — No schema validation currently; security risk for healthcare data
- **Helmet Middleware** — Missing security headers in current app
- **CSRF Protection** — State-changing endpoints vulnerable; implement double-submit cookie pattern
- **Modular Components** — Admin.jsx has 2,153 lines with 50+ state variables
- **Modular Server Routes** — 862-line server monolith needs separation
- **Lazy Loading** — Admin loads heavy libraries for all users
- **Error Handling** — No structured error handling currently

**Differentiators (competitive advantage):**
- **E2E Tests (Playwright)** — Full user journey testing for booking flow
- **React Compiler** — Automatic memoization; 12% performance improvement, v1.0 stable (Oct 2025)
- **Strict Content Security Policy** — Healthcare data requires strict CSP
- **Visual Regression Tests** — Prevent UI regressions in mobile-first design
- **Health Check Endpoint** — Monitoring and deployment checks

**Defer to v2+:**
- **Server Components** — Requires significant architecture changes
- **Service Worker** — Offline capability nice-to-have
- **Storybook** — Component documentation for growing library
- **GraphQL** — REST is sufficient for this use case
- **Microservices** — Overkill for single clinic

### Architecture Approach

The recommended architecture follows **feature-based organization** with clear separation of concerns. The client uses a layered approach: Pages (route-level composition), Features (domain-specific UI + logic like Auth, Services, Cases), Shared (reusable UI primitives), and Context (global state). The server follows Express best practices with Routes (URL mapping), Controllers (request/response handling), Services (business logic), and Middleware (auth, error handling, uploads). This structure eliminates the current monolithic files while maintaining clear boundaries and testability.

**Major components:**
1. **Pages** — Route-level components, composition root (Admin page assembled from features)
2. **Features** — Domain-specific UI + logic (auth/, services/, cases/, config/)
3. **Shared/UI** — Reusable primitives (Button, Card, Modal, Input)
4. **Routes** — Express Router modules by domain (/api/auth, /api/services)
5. **Controllers** — Request handling, input validation
6. **Services** — Business logic, external API calls (Cloudinary, Resend)

### Critical Pitfalls

**1. The "Big Bang" Refactor** — Attempting to refactor entire 2,153-line Admin.jsx or 862-line server in one PR causes production outages. **Prevention:** Use Strangler Fig Pattern, feature flags, parallel routes, incremental commits.

**2. State Management Explosion** — Current Admin.jsx has 40+ `useState` calls. Extracting components without identifying state ownership creates prop drilling hell. **Prevention:** Apply React's "Thinking in React" principles, use Context only for truly global data (auth), co-locate state with consumers.

**3. Express 5 Async Error Handling** — Express 5 handles Promise rejections automatically. Adding try/catch without passing to `next()` breaks error handling. **Prevention:** Let async errors bubble up; only catch when transforming errors; always pass to `next(err)`.

**4. Vercel Serverless Timeout Traps** — `maxDuration: 10s` in vercel.json. Database queries or image processing that work locally timeout in production. **Prevention:** Keep requests under 5s, use Cloudinary direct upload, test on Vercel preview deployments.

**5. Security Gaps During Transition** — New endpoints added without auth middleware, CORS misconfigured. **Prevention:** Security-first approach, auth middleware before route handlers, maintain strict CORS whitelist.

**6. No Tests Confidence Trap** — Zero tests currently. "I'll add tests after refactoring" never happens. **Prevention:** Add characterization tests BEFORE refactoring; each refactored component must have tests before merge.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Testing Infrastructure
**Rationale:** Testing must come first—cannot safely refactor without tests. Also establishes Vercel-compatible architecture and prevents "Big Bang" approach.  
**Delivers:** Vitest setup, test database configuration, API client utilities, UI primitive extraction, project structure reorganization  
**Addresses:** Testing Infrastructure (FEATURES.md Table Stakes), prevents Big Bang Refactor (PITFALLS.md #1)  
**Avoids:** No Tests Confidence Trap (PITFALLS.md #6), Vercel Timeout Traps (PITFALLS.md #4)  
**Research Flag:** LOW — Standard patterns, well-documented in Vitest/RTL docs

### Phase 2: Server Modularization & Security
**Rationale:** Server has clearer boundaries than client; establishes patterns before client refactor. Security hardening is essential before touching auth flows.  
**Delivers:** Route modules (auth, services, cases, config), Controllers, Services layer, Helmet middleware, Zod validation, rate limiting  
**Addresses:** Modular Server Routes, Helmet Middleware, Input Validation, Security Hardening  
**Avoids:** Express 5 Async Errors (PITFALLS.md #3), Security Gaps (PITFALLS.md #5)  
**Research Flag:** LOW — Express 5 patterns are well-documented

### Phase 3: Client Auth Feature Extraction
**Rationale:** Auth is the most isolated feature with clear boundaries (Login, Setup, 2FA). Lower risk than services/cases.  
**Delivers:** AuthContext, LoginForm, SetupForm, TwoFactorForm, useAuth hook  
**Addresses:** Modular Components start, React 19 Actions with Zod validation  
**Avoids:** State Management Explosion (PITFALLS.md #2), Mobile Breakage (PITFALLS.md #7)  
**Research Flag:** LOW — Auth patterns are standard

### Phase 4: Client Services & Cases Features
**Rationale:** Services and Cases have similar patterns (CRUD, modals, drag-and-drop). Grouping them leverages learned patterns.  
**Delivers:** Services feature (ServiceList, ServiceModal, ServiceCard), Cases feature (CaseList, CaseModal, CaseCard), DnD integration  
**Addresses:** Remaining Modular Components, Lazy Loading, React Compiler preparation  
**Avoids:** State Management Explosion, Mobile Breakage, Performance Traps (PITFALLS.md)  
**Research Flag:** MEDIUM — Drag-and-drop with @dnd-kit needs validation

### Phase 5: Polish & Performance
**Rationale:** Final integration, mobile testing, performance optimization. React Compiler requires clean component structure (achieved in Phases 3-4).  
**Delivers:** React Compiler integration, pagination, image optimization, E2E tests with Playwright, error boundaries  
**Addresses:** React Compiler, E2E Tests, Performance Enhancements, Visual Regression  
**Avoids:** Mobile Breakage, Performance Traps  
**Research Flag:** MEDIUM — React Compiler integration may need specific tuning

### Phase Ordering Rationale

The order follows **dependency chains** discovered in research:
1. Testing enables everything else—without tests, refactoring is dangerous
2. Server is simpler than client—establish patterns on clearer boundaries first
3. Auth is isolated—lower risk than complex CRUD features
4. Services/Cases are similar—group to leverage learning
5. React Compiler requires clean code—must come after modularization

This grouping **avoids pitfalls** by:
- Phase 1 prevents Big Bang and No Tests traps
- Phase 2 prevents Express async errors and security gaps
- Phases 3-4 prevent state management explosion through careful extraction
- Phase 5 addresses mobile-first requirements after extraction

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4:** Drag-and-drop integration with @dnd-kit in new component structure
- **Phase 5:** React Compiler configuration with existing codebase

Phases with standard patterns (skip research-phase):
- **Phase 1:** Vitest + RTL setup is well-documented, industry standard
- **Phase 2:** Express 5 Router patterns are established
- **Phase 3:** Auth patterns are standard across React apps

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official Vitest 4.x, Zod 4.x, Helmet 8.x docs; verified versions compatible with React 19 + Express 5 |
| Features | HIGH | Based on official React 19, Express 5 docs; project context from code analysis; OWASP standards for healthcare |
| Architecture | HIGH | React and Express official documentation; feature-based organization is industry consensus |
| Pitfalls | HIGH | Direct code analysis of Admin.jsx (2,153 lines) and server/index.js (862 lines); official Express 5 error handling docs |

**Overall confidence:** HIGH

All research is based on official documentation (React 19 release notes Dec 2024, Express 5 migration guide, Vitest official docs), direct code analysis, and established industry patterns. No gaps requiring significant additional research were identified.

### Gaps to Address

- **TypeScript Migration:** Explicitly out of scope per PROJECT.md. If scope changes, requires additional research on migration path from JavaScript.
- **Cloudinary Integration Patterns:** Current usage works but optimization (direct browser upload vs server proxy) should be validated during Phase 2.
- **Prisma Connection Pooling:** Works in serverless but should verify configuration during Phase 1 testing setup.

## Sources

### Primary (HIGH confidence)
- **Vitest v4.0.17** — https://vitest.dev/ — Test runner configuration, coverage setup
- **Zod v4.3.6** — https://zod.dev/ — Schema validation, TypeScript integration
- **React 19 Release Notes** — https://react.dev/blog/2024/12/05/react-19 — Actions, useActionState, useOptimistic
- **React Compiler 1.0** — https://react.dev/blog/2025/10/07/react-compiler-1 — Automatic memoization
- **Express 5 Migration Guide** — https://expressjs.com/en/guide/migrating-5.html — Async error handling, Router patterns
- **Express Security Best Practices** — https://expressjs.com/en/advanced/best-practice-security.html — Helmet, rate limiting
- **Helmet.js v8.x** — https://helmetjs.github.io/ — Security headers configuration
- **React Testing Library** — https://testing-library.com/docs/react-testing-library/intro/ — Component testing patterns

### Secondary (MEDIUM confidence)
- **csurf Archive Notice** — https://github.com/expressjs/csurf — Repository archived May 2025, security vulnerabilities
- **React Documentation - Thinking in React** — https://react.dev/learn/thinking-in-react — State ownership patterns
- **React Documentation - Scaling with Context** — https://react.dev/learn/scaling-up-with-reducer-and-context — State management
- **OWASP Top 10** — Healthcare web application security standards
- **@dnd-kit Documentation** — Drag-and-drop patterns for sortable lists

### Project Context (HIGH confidence)
- **Code Analysis:** `/apps/client/src/pages/Admin.jsx` (2,153 lines) — direct observation of monolithic structure
- **Code Analysis:** `/apps/server/src/index.js` (862 lines) — direct observation of server monolith
- **Configuration:** `/vercel.json` — deployment configuration, maxDuration: 10s
- **PROJECT.md** — Scope constraints, TypeScript out of scope

---

*Research completed: 2026-02-03*  
*Ready for roadmap: yes*

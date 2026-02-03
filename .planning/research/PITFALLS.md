# Domain Pitfalls: React/Express Refactoring

**Domain:** React 19 + Express 5 Monolithic Refactoring  
**Project:** Podología Coni Clinic Website  
**Researched:** 2026-02-03  
**Confidence:** HIGH (based on official docs + code analysis)

---

## Critical Pitfalls

Mistakes that cause rewrites, production outages, or security vulnerabilities.

### Pitfall 1: The "Big Bang" Refactor

**What goes wrong:**
Attempting to refactor the entire 2,153-line Admin.jsx or 861-line server in a single PR. The app breaks, rollback is impossible, and the clinic loses appointment booking capability.

**Why it happens:**
Developers see the mess and want to fix it all at once. "While I'm touching this file anyway..." mentality. Underestimating hidden dependencies in monolithic code.

**Consequences:**
- Production outages during deployment
- Impossible to rollback (database migrations + code changes coupled)
- Lost patient appointment data
- Reputation damage to clinic

**Prevention:**
- **Strangler Fig Pattern**: Build new components alongside old ones
- **Feature Flags**: Hide new code behind flags until verified
- **Parallel Routes**: Keep old endpoints working while adding new ones
- **Incremental commits**: Each commit must leave the app in working state

**Warning signs:**
- PR with >50 files changed
- "This changes everything" commit messages
- Database schema changes + UI changes in same PR
- No clear rollback plan

**Phase to address:** Phase 1 (Foundation) - Establish incremental refactoring strategy before touching any code

---

### Pitfall 2: State Management Explosion

**What goes wrong:**
Current Admin.jsx has 40+ `useState` calls. During refactoring, developers extract components but pass 15+ props down 5 levels, creating "prop drilling hell" or alternatively, everything becomes global state.

**Why it happens:**
- Not identifying state ownership during component extraction
- Fear of "too many re-renders" leads to premature optimization
- Copy-pasting state patterns without understanding data flow

**Consequences:**
- Components become tightly coupled to parent state
- Impossible to test components in isolation
- Performance degradation from unnecessary re-renders
- Bugs when state gets out of sync across components

**Prevention:**
- Apply React's "Thinking in React" principles (verified from react.dev):
  1. Identify minimal state representation
  2. Find common parent for shared state
  3. Use lifting state up, not prop drilling
- Use React Context for auth state (already partially done) but NOT for all state
- Keep form state local to form components
- Co-locate state with the components that use it

**Warning signs:**
- Components with >8 props
- Props named `initialX` that then get synced to local state
- `useEffect` syncing props to state
- "God components" that know about everything

**Phase to address:** Phase 2 (Component Architecture) - Establish state ownership patterns before extracting components

---

### Pitfall 3: Breaking Express 5 Async Error Handling

**What goes wrong:**
Current server uses Express 5's automatic Promise rejection handling (verified from expressjs.com). During refactoring, developers add try/catch blocks that swallow errors or don't pass to `next()`, breaking Express 5's built-in error handling.

**Why it happens:**
- Old Express 4 habits (manual error passing required)
- Not understanding Express 5's automatic `next(err)` on Promise rejection
- Adding unnecessary error handling that conflicts with framework

**Consequences:**
- Silent failures where errors disappear
- Request timeouts instead of error responses
- Memory leaks from hanging requests
- Broken error logging/monitoring

**Prevention:**
- **Express 5 Rule**: Let async errors bubble up automatically
- Only use try/catch when you need to transform the error or recover
- Always pass errors to `next()` if catching: `catch (err) => next(err)`
- Test error scenarios explicitly

**Warning signs:**
- `try { await something() } catch (e) { console.log(e) }` without `next(e)`
- Async route handlers with no error handling at all
- Error handlers that don't check `res.headersSent`

**Phase to address:** Phase 3 (API Layer) - Establish error handling patterns when extracting routes

---

### Pitfall 4: Vercel Serverless Timeout Traps

**What goes wrong:**
Current `vercel.json` sets `maxDuration: 10` seconds. During refactoring, database queries or image processing that worked in dev (local server) timeout in production (Vercel serverless).

**Why it happens:**
- Local dev uses persistent Node server, Vercel uses ephemeral functions
- Cold starts add 1-3 seconds to each request
- Database connection pooling doesn't work the same in serverless
- Image uploads/processing exceed 10s limit

**Consequences:**
- Intermittent 504 errors in production
- Failed patient appointment submissions
- Image uploads that work locally fail in production
- Database connections exhausted

**Prevention:**
- Keep all requests under 5s to account for cold starts
- Use streaming for large uploads (Cloudinary direct upload)
- Implement connection pooling carefully (Prisma already handles this)
- Add request timeouts and graceful degradation
- Test on Vercel preview deployments, not just local

**Warning signs:**
- `await` chains with multiple database calls
- Synchronous image processing (sharp, canvas)
- No loading states for long operations
- Assumption that "it works on my machine" = works in production

**Phase to address:** Phase 1 (Foundation) - Set up Vercel-compatible architecture from start

---

### Pitfall 5: Security Gaps During Transition

**What goes wrong:**
Current auth uses JWT + cookies with rate limiting. During refactoring, new endpoints get added without auth middleware, or CORS gets misconfigured when splitting frontend/backend.

**Why it happens:**
- Focus on functionality over security during "rapid refactoring"
- Auth middleware not properly extracted and applied to new routes
- Environment variables missing in new deployment configs
- CORS origins not updated for new frontend URLs

**Consequences:**
- Unauthorized admin access
- Patient data exposure
- CSRF/XSS vulnerabilities
- Compliance violations (healthcare data)

**Prevention:**
- **Security-first approach**: Auth middleware must be applied BEFORE route handlers
- Extract auth middleware to reusable functions early (already partially done)
- Maintain strict CORS whitelist (currently uses `APP_ORIGINS` env var)
- Verify all existing security headers in `vercel.json` remain intact
- Security audit checklist for each refactored endpoint

**Warning signs:**
- Routes without `authenticateToken` middleware
- `cors: true` (allow all origins) in dev that slips to production
- Hardcoded secrets in refactored code
- Missing rate limiting on new endpoints

**Phase to address:** Phase 3 (API Layer) - Security audit all endpoints during route extraction

---

### Pitfall 6: The "No Tests" Confidence Trap

**What goes wrong:**
Current codebase has ZERO tests. During refactoring, developers make changes "that should work" but break critical paths (login, appointment booking, admin functions).

**Why it happens:**
- "I'll add tests after refactoring" (never happens)
- Not knowing what the current code actually does
- Assuming manual testing is sufficient
- Time pressure to "just ship it"

**Consequences:**
- Production bugs discovered by users
- Fear of future refactoring ("don't touch it, it works")
- Inability to upgrade dependencies safely
- Technical debt compounds

**Prevention:**
- **Test BEFORE refactor**: Add characterization tests to capture current behavior
- Use React Testing Library for components (already in devDependencies)
- Use Vitest (comes with Vite) for unit tests
- Add E2E tests for critical user flows (login → booking → admin)
- Each refactored component must have tests BEFORE merge

**Warning signs:**
- "I'll test it manually"
- No test infrastructure in CI/CD
- "Testing takes too long"
- Refactoring without understanding current behavior

**Phase to address:** Phase 1 (Foundation) - Test infrastructure must be in place before any refactoring

---

### Pitfall 7: Mobile-First Breakage

**What goes wrong:**
Current UI uses Tailwind responsive classes (`sm:`, `md:`). During component extraction, responsive styles get lost or mobile navigation breaks.

**Why it happens:**
- Testing only on desktop during development
- Extracting components without preserving responsive classes
- Modal/dialog components not tested on small screens
- Touch interactions not considered

**Consequences:**
- 60%+ of users (mobile) get broken experience
- Admin functions unusable on tablet/phone
- Patient appointment form broken on mobile
- SEO impact (Google mobile-first indexing)

**Prevention:**
- Mobile-first testing: Dev tools mobile view for every component
- Preserve Tailwind responsive prefixes during extraction
- Test touch interactions (drag-and-drop for service ordering)
- Verify modals work on 320px width screens

**Warning signs:**
- Components with fixed widths (`w-96`)
- No `sm:`, `md:` breakpoints in extracted components
- Hover-only interactions (no touch equivalent)
- Horizontal scroll on mobile

**Phase to address:** Phase 2 (Component Architecture) - Mobile testing for every extracted component

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copy-paste code from old component | Fast extraction | Duplication, drift between copies | **Never** - always extract to shared utility |
| `// TODO: clean this up later` | Ship faster | TODOs accumulate, never addressed | Only in Phase 1 with tracking ticket |
| Skip prop-types/TypeScript | Faster coding | Runtime errors, no IntelliSense | **Never** - use JSDoc at minimum |
| Keep all API calls in components | Easier to move | No API layer abstraction | Only during Phase 2 extraction, move to hooks in Phase 4 |
| Inline styles for "quick fix" | Immediate visual fix | Inconsistent design system | **Never** - use Tailwind classes only |
| Disable ESLint for a file | Bypass errors | Code quality degrades | **Never** - fix the underlying issue |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Cloudinary** | Deleting old images before confirming new upload succeeds | Upload new → update DB → delete old (transaction-like) |
| **Resend Email** | Not handling rate limits (1 req/sec free tier) | Queue emails, implement retry with exponential backoff |
| **Prisma** | Creating new connection per request in serverless | Use connection pooling, singleton Prisma instance |
| **JWT Auth** | Changing secret key during refactor (invalidates all sessions) | Maintain backward compatibility or force re-login |
| **Vercel API** | Using Node.js streaming in serverless functions | Buffer small responses, use Edge functions for streaming |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **N+1 Queries** | Slow dashboard load, many DB queries | Use Prisma `include` to fetch related data | >50 services/cases |
| **No Pagination** | Admin page loads all 2000 success cases | Implement cursor-based pagination | >100 items |
| **Client-side Sorting** | Lag when dragging to reorder 50+ items | Optimistic UI + async update | >30 sortable items |
| **Image Base64** | Large bundle size, slow upload | Use direct Cloudinary upload from browser | Any image >500KB |
| **No Memoization** | Admin form re-renders entire app | Use `React.memo`, `useMemo`, `useCallback` for large lists | >20 list items |

---

## Security Mistakes

Domain-specific security issues for healthcare clinic websites.

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Exposing patient data in logs** | HIPAA violation, privacy breach | Sanitize logs, never log `req.body` with patient info |
| **Missing rate limiting on public endpoints** | DDoS, abuse of quote form | Keep existing rate limiters, apply to all new routes |
| **Storing JWT in localStorage** | XSS vulnerability | Keep current httpOnly cookie approach |
| **SQL injection via Prisma** | Data breach | Use parameterized queries (Prisma does this by default) |
| **No input validation** | Malformed data, injection attacks | Add Zod validation for all API inputs |
| **CORS allowing all origins in prod** | CSRF attacks | Strict whitelist in `APP_ORIGINS` env var |

---

## UX Pitfalls

Common user experience mistakes during refactoring.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **No loading states during refactor** | Users think app is frozen | Preserve existing `Loader2` spinners, add skeleton screens |
| **Breaking existing URL routes** | Bookmarks break, SEO loss | Maintain route compatibility, use redirects if needed |
| **Changing auth flow without notice** | Users can't log in | Keep existing auth states (LOGIN/SETUP/2FA/DASHBOARD) |
| **Removing optimistic updates** | UI feels slower | Preserve optimistic patterns in success cases visibility |
| **Modal focus trap loss** | Accessibility regression | Maintain focus management when extracting modals |
| **Touch target size reduction** | Hard to tap on mobile | Maintain 44px minimum touch targets |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Component extracted:** Often missing error boundaries — verify ErrorBoundary wraps new components
- [ ] **Route extracted:** Often missing error handler — verify 404/500 handling
- [ ] **API endpoint moved:** Often missing rate limiting — verify limiters applied
- [ ] **State lifted up:** Often missing cleanup — verify `useEffect` cleanup functions
- [ ] **Image upload refactored:** Often missing error handling — verify upload failure UX
- [ ] **Auth flow touched:** Often missing session persistence — verify remember me still works
- [ ] **Database query optimized:** Often missing transaction — verify atomic operations
- [ ] **Mobile responsive:** Often missing tablet view — verify iPad/medium breakpoints
- [ ] **Form refactored:** Often missing validation — verify error messages display
- [ ] **Test added:** Often missing assertions — verify test actually tests something

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Big Bang Refactor breaks production | **HIGH** | 1. Immediate rollback to last stable commit<br>2. Enable feature flags to disable new code<br>3. Fix forward only if rollback impossible |
| State management chaos | **MEDIUM** | 1. Identify state ownership violations<br>2. Co-locate state with consumers<br>3. Add tests to prevent regression |
| Express errors not handled | **MEDIUM** | 1. Add global error handler as safety net<br>2. Audit all routes for proper error passing<br>3. Add error monitoring (Sentry) |
| Vercel timeouts | **LOW** | 1. Identify slow operations via logs<br>2. Move to background jobs or streaming<br>3. Increase `maxDuration` temporarily |
| Security vulnerability exposed | **HIGH** | 1. Immediate patch deployment<br>2. Force password resets if auth affected<br>3. Security audit of all endpoints |
| Tests missing critical path | **MEDIUM** | 1. Add characterization tests immediately<br>2. Identify gaps via code coverage<br>3. Prioritize E2E tests for booking flow |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Big Bang Refactor | Phase 1 (Foundation) | Each PR <20 files, incremental deployment working |
| State Management Explosion | Phase 2 (Component Architecture) | Component tree depth <4, props per component <6 |
| Express 5 Async Errors | Phase 3 (API Layer) | All async routes tested with error scenarios |
| Vercel Timeouts | Phase 1 (Foundation) | All API calls <5s in Vercel preview deployment |
| Security Gaps | Phase 3 (API Layer) | Security audit checklist completed for all endpoints |
| No Tests | Phase 1 (Foundation) | Test coverage >0% before any refactoring begins |
| Mobile Breakage | Phase 2 (Component Architecture) | Mobile testing pass for each extracted component |

---

## Sources

- React 19 Documentation: https://react.dev/learn/thinking-in-react (HIGH confidence - official)
- Express 5 Error Handling: https://expressjs.com/en/guide/error-handling.html (HIGH confidence - official)
- Code Analysis: `/apps/client/src/pages/Admin.jsx` (2,153 lines) - direct observation
- Code Analysis: `/apps/server/src/index.js` (861 lines) - direct observation
- Vercel Configuration: `/vercel.json` - direct observation
- Package Analysis: React 19.2.0, Express 5.2.1, Vite 6.4.0 - verified versions

---

*Pitfalls research for: React/Express Monolithic Refactoring*  
*Researched: 2026-02-03*

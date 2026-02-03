# Technology Stack

**Project:** Podiatry Clinic Website Refactor  
**Researched:** 2026-02-03  
**Confidence:** HIGH

## Recommended Stack

### Core Testing Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vitest** | ^4.0.17 | Test runner | Vite-native, 10x faster than Jest, Jest-compatible API, native ESM/TypeScript support, works with React 19. The modern standard for 2025. |
| **@testing-library/react** | ^16.2.0 | React component testing | Industry standard for testing React components. Encourages testing behavior not implementation. Works seamlessly with Vitest. |
| **@testing-library/jest-dom** | ^6.6.3 | DOM assertions | Provides custom matchers like `toBeInTheDocument()`, `toHaveClass()`. Works with Vitest via `vitest.config.ts` setup. |
| **@testing-library/user-event** | ^14.6.0 | User interaction simulation | Simulates real user events (click, type, tab) better than fireEvent. Essential for accessibility testing. |

### Validation Libraries

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Zod** | ^4.3.6 | Schema validation | TypeScript-first, 2kb core, static type inference. Zod 4 (released Jan 2025) adds `fromJSONSchema()`, `xor()`, `looseRecord()`, and better error customization. The 2025 standard for runtime validation. |
| **@zod/mini** | ^4.3.6 | Tree-shakeable validation | Use for client-side only validation where bundle size matters. Same API, smaller footprint. |

### Security Middleware

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **helmet** | ^8.0.0 | HTTP security headers | Sets 13 security headers by default (CSP, HSTS, X-Frame-Options, etc.). Essential baseline security for Express. |
| **express-rate-limit** | ^7.5.0 | Rate limiting | Prevents brute-force and DDoS attacks. Critical for API endpoints. Configurable per-route. |
| **cors** | ^2.8.5 | Cross-origin resource sharing | Required for Vercel serverless deployment. Configure strict origin whitelist for production. |

### Code Quality & Linting

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **TypeScript** | ^5.7.3 | Type safety | React 19 and Express 5 both fully support TS 5.7. Strict mode required for Zod. |
| **ESLint** | ^9.18.0 | Linting | Use with `@eslint/js`, `typescript-eslint`, and `eslint-plugin-react-hooks`. Flat config (eslint.config.js) is now standard. |
| **Prettier** | ^3.4.2 | Code formatting | Consistent formatting across team. Integrate with ESLint via `eslint-config-prettier`. |
| **husky** | ^9.1.7 | Git hooks | Run linting/tests before commits. Lightweight, zero-config option available. |
| **lint-staged** | ^15.4.0 | Staged file linting | Run linters only on git staged files. Fast feedback, no full-project linting on every commit. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@vitejs/plugin-react** | ^4.3.4 | Vite React plugin | Required for React 19 Fast Refresh and JSX transform. |
| **jsdom** | ^26.0.0 | DOM environment for tests | Vitest's default browser environment for component testing. |
| **@vitest/coverage-v8** | ^4.0.17 | Code coverage | Native V8 coverage provider for Vitest. Faster than Istanbul. |
| **msw** | ^2.7.0 | API mocking | Mock HTTP requests in tests and development. Essential for testing components that fetch data. |

## Installation

```bash
# Core testing
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom

# Validation
npm install zod

# Security (Express)
npm install helmet express-rate-limit cors

# Code quality
npm install -D typescript eslint prettier @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-config-prettier husky lint-staged

# Supporting tools
npm install -D @vitejs/plugin-react jsdom @vitest/coverage-v8 msw
```

## Alternatives Considered

| Category | Recommended | Alternative | When to Use Alternative |
|----------|-------------|-------------|-------------------------|
| Test Runner | **Vitest** | Jest 30.x | Use Jest only if you have extensive existing Jest config that can't migrate. Jest is slower and requires more setup for ESM/TypeScript. |
| Validation | **Zod 4** | Valibot, Yup | Valibot is smaller (tree-shakeable) but Zod has better ecosystem (tRPC, React Hook Form). Yup is more mature but not TypeScript-first. |
| CSRF Protection | **Custom implementation** | csurf | csurf was archived May 2025 and has security vulnerabilities. Implement double-submit cookie pattern manually or use SameSite cookies + CSP. |
| React Testing | **RTL + Vitest** | Cypress Component Testing | Cypress for E2E testing, but RTL + Vitest is faster and better for unit/component tests. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **csurf** | Archived May 2025, security vulnerabilities, no longer maintained | Implement double-submit cookie pattern manually with `cookie-parser` or rely on SameSite=Lax cookies + CSP |
| **Jest 29.x** | ESM support requires experimental flags, slower than Vitest | Vitest 4.x (native ESM, faster, compatible API) |
| **Zod 3.x** | Zod 4 is stable with major improvements (JSON Schema conversion, better errors) | Zod 4.3.x |
| **express-validator** | Runtime validation without type inference | Zod (TypeScript-first, type inference, smaller bundle) |
| **Enzyme** | Officially deprecated, doesn't support React 18+ | React Testing Library |
| **@types/jest with Vitest** | Type conflicts | Use Vitest's built-in types (`vitest/globals`) |

## Version Compatibility

| Package | Compatible With | Notes |
|---------|---------------|-------|
| vitest@4.x | vite@6.x, @vitejs/plugin-react@4.x | Vitest reuses Vite config. Must align Vite and Vitest versions. |
| zod@4.x | TypeScript 5.5+ | Requires strict mode in tsconfig.json. Tested against TS 5.5+. |
| helmet@8.x | express@5.x | Helmet 8 supports Express 5's new middleware signature. |
| @testing-library/react@16.x | react@19.x, react-dom@19.x | RTL 16+ is required for React 19 support. |
| msw@2.x | vitest@4.x, @testing-library/react@16.x | MSW 2 uses native fetch. Requires Node 18+. |

## Configuration Templates

### Vitest Config (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
})
```

### Test Setup (src/test/setup.ts)

```typescript
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

### Zod Validation Pattern

```typescript
import * as z from 'zod'

// Define schema
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
})

// Type inference
type User = z.infer<typeof UserSchema>

// Validation
const result = UserSchema.safeParse(data)
if (!result.success) {
  // Handle ZodError
  console.error(result.error.flatten())
}
```

### Express Security Setup

```typescript
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'

const app = express()

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust for your needs
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// CORS - configure strictly for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:5173',
  credentials: true,
}))
```

## React 19 Specific Patterns

### Actions with Zod Validation

```typescript
'use server'

import * as z from 'zod'

const AppointmentSchema = z.object({
  patientName: z.string().min(2),
  date: z.string().datetime(),
  service: z.enum(['consultation', 'treatment', 'followup']),
})

export async function createAppointment(formData: FormData) {
  const rawData = {
    patientName: formData.get('patientName'),
    date: formData.get('date'),
    service: formData.get('service'),
  }
  
  const validated = AppointmentSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }
  
  // Process validated data
  // ...
}
```

### useActionState Hook (React 19)

```typescript
import { useActionState } from 'react'

function AppointmentForm() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await createAppointment(formData)
      if (result.error) return result.error
      return null
    },
    null
  )

  return (
    <form action={submitAction}>
      <input name="patientName" />
      {state?.patientName && <span>{state.patientName}</span>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Book Appointment'}
      </button>
    </form>
  )
}
```

## Mobile-First Testing Strategy

### Viewport Testing with Vitest Browser Mode

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('Mobile Navigation', () => {
  it('shows hamburger menu on mobile viewport', async () => {
    // Set mobile viewport
    window.innerWidth = 375
    window.innerHeight = 667
    window.dispatchEvent(new Event('resize'))
    
    render(<App />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeInTheDocument()
    
    // Test interaction
    const user = userEvent.setup()
    await user.click(menuButton)
    
    expect(screen.getByRole('navigation')).toBeVisible()
  })
})
```

### Responsive Testing with CSS Media Queries

```typescript
// Test responsive behavior
import { describe, it, expect, vi } from 'vitest'

describe('Responsive Layout', () => {
  it('adapts grid columns based on viewport', () => {
    // Mock matchMedia for testing responsive hooks
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
      matches: query === '(min-width: 768px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
  
    // Test component behavior
    const { container } = render(<GridComponent />)
    expect(container.firstChild).toHaveClass('grid-cols-2')
  })
})
```

## CSRF Protection Strategy (Without csurf)

Since `csurf` is archived and has vulnerabilities, implement this pattern:

### Double-Submit Cookie Pattern

```typescript
import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'

// Generate CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Middleware to set CSRF cookie
export function csrfCookieMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.cookies['csrf-token']) {
    const token = generateCsrfToken()
    res.cookie('csrf-token', token, {
      httpOnly: false, // Must be readable by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
    res.locals.csrfToken = token
  } else {
    res.locals.csrfToken = req.cookies['csrf-token']
  }
  next()
}

// Validation middleware
export function validateCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['x-csrf-token'] || req.body._csrf
  const cookieToken = req.cookies['csrf-token']
  
  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' })
  }
  
  next()
}
```

### Frontend CSRF Integration

```typescript
// API client with CSRF token
async function fetchWithCsrf(url: string, options: RequestInit = {}) {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf-token='))
    ?.split('=')[1]
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken || '',
    },
    credentials: 'include',
  })
}
```

## Sources

- **Vitest v4.0.17** — https://vitest.dev/ — Official docs, verified current version
- **Zod v4.3.6** — https://zod.dev/ — Official docs, verified stable release Jan 22 2025
- **Zod v4 Release Notes** — https://github.com/colinhacks/zod/releases — GitHub releases
- **Helmet.js** — https://helmetjs.github.io/ — Official docs, v8.x current
- **React 19** — https://react.dev/blog/2024/12/05/react-19 — Official release notes Dec 5 2024
- **React Testing Library** — https://testing-library.com/docs/react-testing-library/intro/ — Official docs
- **Express 5 Migration** — https://expressjs.com/en/guide/migrating-5.html — Official migration guide
- **csurf Archive Notice** — https://github.com/expressjs/csurf — Repository archived May 14 2025
- **Vitest Config** — https://vitest.dev/config/ — Official configuration reference

---

*Stack research for: React 19 + Express 5 + Prisma 5 + PostgreSQL testing, validation, and security stack.*
*Researched: 2026-02-03*

# Testing Patterns

**Analysis Date:** 2026-02-03

## Test Framework

**Status:** Not Configured

No testing framework is currently set up in this codebase. This represents a significant gap in the development workflow.

**Missing Infrastructure:**
- No test runner (Jest, Vitest, Mocha)
- No assertion library
- No test scripts in package.json files
- No test configuration files
- No CI test pipeline

**Current package.json Scripts:**
```json
// apps/client/package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}

// apps/server/package.json
"scripts": {
  "dev": "node src/index.js"
}
```

## Test File Organization

**Status:** Not Applicable

No test files exist in the codebase:
- No `*.test.js` or `*.test.jsx` files
- No `*.spec.js` or `*.spec.jsx` files
- No `__tests__` directories
- No test fixtures or mocks

## Testing Recommendations

Given the current architecture, the following testing setup is recommended:

### Recommended Framework: Vitest

**Rationale:**
- Vite is already used as the build tool
- Native ESM support (matches client-side code)
- Fast execution
- Jest-compatible API
- Built-in coverage

### Recommended Test Structure

**Location:** Co-located with source files or in `__tests__` directories

```
apps/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   └── ImageUpload.test.jsx
│   │   └── utils/
│   │       ├── cloudinary.js
│   │       └── cloudinary.test.js
│   └── __tests__/
│       └── integration/
├── server/
│   ├── src/
│   │   └── index.js
│   └── __tests__/
│       ├── unit/
│       └── integration/
```

### Critical Areas Needing Tests

**1. Server API Routes (`apps/server/src/index.js`):**
- Authentication endpoints (`/api/login`, `/api/auth/*`)
- Service CRUD operations (`/api/services`)
- File upload endpoints (`/api/upload`)
- Rate limiting middleware
- JWT token validation

**2. Cloudinary Utilities (`apps/client/src/utils/cloudinary.js`):**
- URL transformation logic
- srcSet generation
- Edge cases for malformed URLs

**3. Image Processing (`apps/client/src/utils/canvasUtils.js`):**
- Canvas manipulation functions
- Image rotation calculations
- Error handling for invalid inputs

**4. React Components:**
- `ImageUpload.jsx` - Upload flow, crop functionality
- `SortableCard.jsx` - Drag and drop behavior
- `ConfigContext.jsx` - Data fetching and caching

## Mocking Strategy

**External Services to Mock:**
- Cloudinary API (image upload/delete)
- Resend API (email sending)
- Prisma database client
- fetch API for client-side requests

**Example Mock Pattern:**
```javascript
// Mock Cloudinary upload
vi.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn()
    }
  }
}));

// Mock fetch for API calls
global.fetch = vi.fn();
```

## Coverage Targets

**Recommended Minimums:**
- Unit tests: 70% coverage
- API routes: 80% coverage
- Critical paths: 90% coverage

**Priority Order:**
1. Authentication flows (security critical)
2. File upload/delete operations (data integrity)
3. Database operations via Prisma
4. Form validation logic
5. UI component rendering

## Testing Commands to Add

```json
// Add to package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test"
}
```

## Manual Testing Evidence

The codebase relies on manual testing as evidenced by:
- Console.log statements throughout (`console.log("Starting upload...")`)
- Debug alerts: `alert("Error al subir la imagen: " + error.message)`
- Commented code sections
- Extensive mock/fallback data in components

**Example from `apps/client/src/pages/Services.jsx`:**
```javascript
// Fallback mock data in case API fails
const mockServices = [
  { id: 1, name: "Atención Podológica General", ... },
  // ...
];
```

## Test Environment Configuration

**Required Environment Variables for Testing:**
```
# .env.test
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
SECRET_KEY=test-secret-key
CLOUDINARY_URL=cloudinary://test:test@test
RESEND_API_KEY=test-key
```

**Test Database Setup:**
- Use separate test database
- Reset database before each test suite
- Use Prisma migrations for schema

## Testing Gaps by Severity

**High Risk (No Tests):**
- `apps/server/src/index.js` (861 lines) - All API routes
- Authentication and authorization logic
- File upload with multer
- JWT token handling

**Medium Risk:**
- `apps/client/src/pages/Admin.jsx` (2153 lines) - Admin dashboard
- Complex form handling
- Drag and drop sorting
- Image cropping functionality

**Lower Risk:**
- Static components
- Utility functions with simple logic
- CSS/styling

## Recommended Testing Libraries

**Unit Testing:**
- `vitest` - Test runner
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - DOM assertions

**Integration Testing:**
- `supertest` - HTTP assertions for server
- `@testing-library/user-event` - User interactions

**E2E Testing:**
- `playwright` - Full browser automation

**Coverage:**
- `@vitest/coverage-v8` - Code coverage

---

*Testing analysis: 2026-02-03*

**Action Required:** Set up testing infrastructure before adding new features.

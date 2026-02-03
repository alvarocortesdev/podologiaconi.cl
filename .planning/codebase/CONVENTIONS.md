# Coding Conventions

**Analysis Date:** 2026-02-03

## Naming Patterns

**Files:**
- Components: PascalCase with `.jsx` extension (e.g., `ImageUpload.jsx`, `SortableCard.jsx`)
- Utilities: camelCase with `.js` extension (e.g., `canvasUtils.js`, `cloudinary.js`)
- Pages: PascalCase with `.jsx` extension (e.g., `Home.jsx`, `Admin.jsx`, `Services.jsx`)
- Context: PascalCase with `.jsx` for providers, camelCase with `.js` for base exports
- Configuration files: camelCase or kebab-case (e.g., `tailwind.config.cjs`, `vite.config.js`)

**Functions:**
- React components: PascalCase (e.g., `function App()`, `export default function Layout()`)
- Utility functions: camelCase (e.g., `getCroppedImg()`, `buildCloudinaryUrl()`)
- Helper functions: camelCase with descriptive verbs (e.g., `createImage()`, `rotateSize()`)
- Async handlers: camelCase prefixed with handle (e.g., `handleUpload()`, `handleCropConfirm()`)

**Variables:**
- State variables: camelCase (e.g., `const [isOpen, setIsOpen]`, `const [loading, setLoading]`)
- Constants: UPPER_SNAKE_CASE for true constants (e.g., `const SA_COUNTRY_CODES`, `const COOKIE_NAME`)
- Boolean states: prefixed with "is" (e.g., `isCropping`, `isVisible`, `uploading`)
- Props: camelCase destructured (e.g., `{ value, onChange, label }`)

**Types:**
- No TypeScript detected - using JSDoc sparingly
- Prop types not enforced (using vanilla React)

## Code Style

**Formatting:**
- Indentation: 2 spaces
- Quotes: Double quotes for JSX, mixed for JavaScript
- Semicolons: Used consistently
- Trailing commas: Used in objects and arrays
- Max line length: ~100 characters

**Linting:**
- Tool: ESLint 9.x with flat config (`eslint.config.js`)
- Config location: `apps/client/eslint.config.js`
- Rules: `no-unused-vars` with exception for capitalized vars (`varsIgnorePattern: '^[A-Z_]'`)
- Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Ignored directories: `dist`

**Key ESLint Configuration (`apps/client/eslint.config.js`):**
```javascript
rules: {
  'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
}
```

## Import Organization

**Order:**
1. React and React hooks
2. Third-party libraries (alphabetically grouped)
3. Internal components (relative imports)
4. Utilities and helpers
5. CSS/styles

**Example from `apps/client/src/pages/Admin.jsx`:**
```javascript
import React, { useState, useEffect, useCallback } from "react";
import ImageUpload from "../components/ImageUpload";
import SortableCard from "../components/SortableCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { Lock, Plus, Pencil } from "lucide-react";
import clsx from "clsx";
```

**Path Aliases:**
- Not configured - using relative imports (`../components/`, `../utils/`)

## Module Systems

**Client (`apps/client`):**
- ES modules: `"type": "module"` in package.json
- Import syntax: `import` / `export`

**Server (`apps/server`):**
- CommonJS: `"type": "commonjs"` in package.json
- Require syntax: `const express = require('express')`
- Exports: `module.exports = { prisma }`

**Database Package (`packages/database`):**
- CommonJS for Node.js compatibility

## Error Handling

**Patterns:**
- Try-catch blocks for async operations
- Console logging of errors with context (e.g., `console.error("Upload error:", error)`)
- User-facing error messages in Spanish
- Graceful fallbacks (empty arrays, null checks)

**Example from `apps/client/src/context/ConfigContext.jsx`:**
```javascript
const safeJson = async (res, fallback) => {
  if (!res.ok) return fallback;
  const type = res.headers.get("content-type") || "";
  if (!type.includes("application/json")) return fallback;
  try {
    return await res.json();
  } catch {
    return fallback;
  }
};
```

**Server Error Pattern:**
```javascript
try {
  // operation
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Descriptive error message' });
}
```

## Logging

**Framework:** Console (no structured logging library)

**Patterns:**
- Debug logs: `console.log("Starting upload...")`
- Error logs: `console.error("Upload error:", error)`
- Spanish messages for user-facing errors

**Development vs Production:**
- No conditional logging detected
- Debug logs present in production code

## Comments

**When to Comment:**
- File headers indicating location (e.g., `// client/src/App.jsx`)
- Complex logic explanations
- Section dividers in large files
- TODO-style comments for context

**Examples:**
```javascript
// Helper to extract public_id from Cloudinary URL
// Create a service (Protected)
// Fallback mock data in case API fails
```

## Function Design

**Size:**
- No strict limits observed
- Large files exist: `Admin.jsx` (2153 lines), `index.js` server (861 lines)
- Component functions can be 100+ lines

**Parameters:**
- Destructuring preferred for props and options
- Named parameters via object destructuring

**Example:**
```javascript
export const buildCloudinaryUrl = (url, options = {}) => {
  const { width, quality = "auto", format = "auto" } = options;
  // ...
};
```

**Return Values:**
- Explicit returns for clarity
- Early returns for guard clauses
- Null/undefined returns for error cases

## Module Design

**Exports:**
- Default exports for main components: `export default function Component()`
- Named exports for utilities: `export const util = () => {}`
- Re-exports from index files

**Barrel Files:**
- `packages/database/src/index.js` exports Prisma client
- Context base exports in separate files

**Example from `packages/database/src/index.js`:**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = { prisma };
```

## React Patterns

**Component Structure:**
- Functional components with hooks
- Custom hooks for shared logic (via context)
- Lazy loading for routes: `const Services = lazy(() => import("./pages/Services"))`

**State Management:**
- React Context for global state (`ConfigContext`, `IntroContext`)
- useState for local component state
- No Redux or Zustand detected

**Hook Patterns:**
- useEffect for side effects with cleanup functions
- useCallback for memoized callbacks
- Custom hook pattern: `useConfig()` from context

**Styling:**
- Tailwind CSS utility classes
- clsx for conditional classes
- Custom CSS in `index.css` for animations

## Security Practices

**CSP Headers:** Configured in `vercel.json`
**Cookie Settings:** httpOnly, secure in production, sameSite: 'strict'
**CORS:** Origin validation with allowed origins list
**Input Validation:** Manual validation in route handlers

## Language Standards

**JavaScript Features:**
- ES2020 syntax (async/await, optional chaining, nullish coalescing)
- Object shorthand: `{ prisma }`
- Spread operator for objects and arrays
- Template literals

**Not Used:**
- TypeScript
- Flow
- PropTypes

---

*Convention analysis: 2026-02-03*

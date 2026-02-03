# Architecture Patterns: React/Express Modularization

**Domain:** Podiatry Clinic Website (React 19 + Express 5)
**Researched:** 2026-02-03
**Confidence:** HIGH (based on official React and Express documentation)

## Current State Analysis

The project has two critical monolithic components that need refactoring:

| File | Lines | Concerns |
|------|-------|----------|
| `Admin.jsx` | 2,153 | Auth state, dashboard tabs, multiple modals, data management, DnD logic all in one component |
| `server/index.js` | 862 | Routes, middleware, helpers, business logic all in one file |

## Recommended Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Pages      │  │  Features    │  │   Shared     │  │   Context    │    │
│  │  (Admin)     │  │  (Auth,      │  │ (UI, Utils)  │  │  (State)     │    │
│  │              │  │  Services)   │  │              │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  └──────┬───────┘    │
│         │                 │                                   │             │
│         └─────────────────┴───────────────────────────────────┘             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              API LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Routes     │  │ Controllers  │  │  Services    │  │  Middleware  │    │
│  │  (Routers)   │  │ (Handlers)   │  │ (Business)   │  │  (Auth, etc) │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                 │                 │                              │
│         └─────────────────┴─────────────────┘                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                                         │
│  │   Prisma     │  │  Database    │                                         │
│  │   Client     │  │  (SQLite)    │                                         │
│  └──────────────┘  └──────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Pages** | Route-level components, composition root | Features, Context |
| **Features** | Domain-specific UI + logic (Auth, Services, Cases) | Shared components, Context |
| **Shared** | Reusable UI primitives (Button, Card, Modal) | No one (pure presentational) |
| **Context** | Global state management (Auth, Config) | Features, Pages |
| **Routes** | URL mapping, middleware mounting | Controllers |
| **Controllers** | Request/response handling, validation | Services |
| **Services** | Business logic, external API calls (Cloudinary, Resend) | Prisma |
| **Middleware** | Auth, CORS, error handling, file upload | Routes |

## Recommended Project Structure

### Client (React)

```
apps/client/src/
├── pages/
│   └── Admin/
│       ├── index.jsx           # Main page composition
│       ├── Admin.test.jsx      # Page-level tests
│       └── README.md           # Feature documentation
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SetupForm.jsx
│   │   │   └── TwoFactorForm.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── index.js            # Public API exports
│   ├── services/
│   │   ├── components/
│   │   │   ├── ServiceList.jsx
│   │   │   ├── ServiceModal.jsx
│   │   │   └── ServiceCard.jsx
│   │   ├── hooks/
│   │   │   └── useServices.js
│   │   └── index.js
│   ├── cases/
│   │   ├── components/
│   │   │   ├── CaseList.jsx
│   │   │   ├── CaseModal.jsx
│   │   │   └── CaseCard.jsx
│   │   ├── hooks/
│   │   │   └── useCases.js
│   │   └── index.js
│   └── config/
│       ├── components/
│       │   └── ConfigForm.jsx
│       ├── hooks/
│       │   └── useConfig.js
│       └── index.js
├── components/
│   ├── ui/                     # Primitive UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Input.jsx
│   │   └── index.js
│   └── shared/                 # Domain-agnostic shared
│       ├── ImageUpload.jsx
│       ├── RichTextEditor.jsx
│       ├── SortableCard.jsx
│       └── SkeletonCard.jsx
├── hooks/
│   ├── useApi.js               # API call abstraction
│   ├── useToast.js             # Notification system
│   └── useMediaQuery.js        # Responsive hooks
├── utils/
│   ├── api.js                  # API client setup
│   ├── cloudinary.js
│   └── canvasUtils.js
└── context/
    ├── ConfigContext.jsx
    └── IntroContext.jsx
```

### Server (Express)

```
apps/server/src/
├── index.js                    # App initialization only
├── routes/
│   ├── index.js                # Route aggregator
│   ├── auth.routes.js          # /api/auth/*
│   ├── services.routes.js      # /api/services/*
│   ├── cases.routes.js         # /api/cases/*
│   └── config.routes.js        # /api/config/*
├── controllers/
│   ├── auth.controller.js
│   ├── services.controller.js
│   ├── cases.controller.js
│   └── config.controller.js
├── services/
│   ├── auth.service.js         # Business logic
│   ├── email.service.js        # Resend integration
│   ├── cloudinary.service.js   # Image handling
│   └── token.service.js        # JWT operations
├── middleware/
│   ├── auth.middleware.js      # JWT verification
│   ├── error.middleware.js     # Error handling
│   ├── upload.middleware.js    # Multer configuration
│   └── cors.middleware.js      # CORS setup
├── utils/
│   ├── helpers.js              # Shared utilities
│   └── validators.js           # Input validation
└── config/
    └── index.js                # Environment config
```

## Architectural Patterns

### Pattern 1: Feature-Based Component Organization

**What:** Co-locate all code for a feature (components, hooks, context) in a single directory

**When to use:** When a feature has multiple components that work together (like Auth with Login, Setup, 2FA forms)

**Trade-offs:**
- ✅ Easier to find related code
- ✅ Clear feature boundaries
- ✅ Easy to delete/move features
- ⚠️ May duplicate some shared utilities

**Example:**
```jsx
// features/auth/components/LoginForm.jsx
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';

export function LoginForm() {
  const { login } = useAuth();
  // Component logic
}
```

### Pattern 2: Compound Components for Complex UI

**What:** Parent component that manages state, children that consume context

**When to use:** When multiple components need to share implicit state (like Admin dashboard tabs)

**Trade-offs:**
- ✅ Reduces prop drilling
- ✅ Clear parent-child relationship
- ⚠️ Less explicit than props

**Example:**
```jsx
// Admin.jsx refactored
import { AdminProvider } from './context/AdminContext';
import { AuthSection } from './features/auth';
import { ServicesSection } from './features/services';
import { CasesSection } from './features/cases';

export default function Admin() {
  return (
    <AdminProvider>
      <AuthSection />
      <ServicesSection />
      <CasesSection />
    </AdminProvider>
  );
}
```

### Pattern 3: Custom Hooks for Data Logic

**What:** Extract data fetching and state into reusable hooks

**When to use:** When multiple components need the same data operations

**Trade-offs:**
- ✅ Separates UI from data logic
- ✅ Easy to test
- ✅ Reusable across components

**Example:**
```jsx
// features/services/hooks/useServices.js
export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateService = useCallback(async (id, data) => {
    // Update logic
  }, []);
  
  return { services, loading, fetchServices, updateService };
}
```

### Pattern 4: Express Router Modularization

**What:** Split routes by domain using Express.Router

**When to use:** When server/index.js grows beyond 200-300 lines

**Trade-offs:**
- ✅ Clear route organization
- ✅ Domain-specific middleware
- ✅ Easier testing

**Example:**
```javascript
// routes/services.routes.js
const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', servicesController.getAll);
router.post('/', authenticate, servicesController.create);
router.put('/:id', authenticate, servicesController.update);
router.delete('/:id', authenticate, servicesController.remove);

module.exports = router;

// index.js
const servicesRoutes = require('./routes/services.routes');
app.use('/api/services', servicesRoutes);
```

### Pattern 5: Service Layer Pattern

**What:** Separate business logic from controllers

**When to use:** When controllers become complex or when business logic is reused

**Trade-offs:**
- ✅ Controllers stay thin
- ✅ Business logic is testable
- ✅ Can reuse logic across routes

**Example:**
```javascript
// services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('@database');

class AuthService {
  async login(username, password) {
    const user = await prisma.admin.findUnique({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      throw new Error('Invalid credentials');
    }
    return this.generateTokens(user);
  }
  
  generateTokens(user) {
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
    return { token };
  }
}

module.exports = new AuthService();
```

## Data Flow

### Client-Side Data Flow

```
User Action
    ↓
Component calls hook method
    ↓
Hook calls API utility
    ↓
API makes HTTP request
    ↓
Response updates Context/State
    ↓
React re-renders components
```

### Server-Side Request Flow

```
HTTP Request
    ↓
CORS Middleware
    ↓
Auth Middleware (if protected)
    ↓
Route Handler
    ↓
Controller (validate input)
    ↓
Service (business logic)
    ↓
Prisma Client
    ↓
Database
    ↓
Response (JSON)
```

### Key Data Flows

1. **Authentication Flow:**
   - Login form → Auth hook → POST /api/auth/login → Auth service → JWT token → Cookie set → Context updated

2. **Service Management Flow:**
   - Admin tab switch → Services hook → GET /api/services → Services controller → Prisma → Render list

3. **Image Upload Flow:**
   - File select → ImageUpload component → Cloudinary service → URL returned → Form state updated

## React Context Strategy

Given the project uses React Context (not Redux), here's the recommended pattern:

### Context Organization

| Context | Purpose | Scope |
|---------|---------|-------|
| `AuthContext` | User authentication state | App-wide |
| `ConfigContext` | Site configuration | App-wide |
| `AdminContext` | Admin dashboard state | Admin page only |
| `ToastContext` | Notifications | App-wide |

### Context + Reducer Pattern

For complex state (like Admin with multiple tabs and modals), combine Context with useReducer:

```jsx
// features/admin/context/AdminContext.jsx
const AdminContext = createContext(null);
const AdminDispatchContext = createContext(null);

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'OPEN_MODAL':
      return { ...state, modal: { type: action.modalType, data: action.data } };
    case 'CLOSE_MODAL':
      return { ...state, modal: null };
    // ... more cases
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  
  return (
    <AdminContext.Provider value={state}>
      <AdminDispatchContext.Provider value={dispatch}>
        {children}
      </AdminDispatchContext.Provider>
    </AdminContext.Provider>
  );
}
```

## Mobile-First Patterns

### Responsive Component Structure

```jsx
// components/ui/Modal.jsx
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function Modal({ children, isOpen, onClose }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={clsx(
      'fixed inset-0 z-50 flex items-center justify-center',
      isMobile ? 'p-0' : 'p-4 bg-black/50'
    )}>
      <div className={clsx(
        'bg-white rounded-lg',
        isMobile ? 'w-full h-full rounded-none' : 'w-full max-w-lg'
      )}>
        {children}
      </div>
    </div>
  );
}
```

### Touch-Friendly Interactions

- Minimum touch target: 44x44px
- Use `@dnd-kit` for drag-and-drop (already in use)
- Swipe gestures for mobile navigation
- Bottom sheets instead of modals on mobile

## Build Order (Dependencies)

Based on the architecture, here's the suggested refactoring order:

### Phase 1: Foundation (Week 1)
1. **Setup project structure** - Create folders, no code changes
2. **Extract UI primitives** - Button, Card, Modal, Input components
3. **Create API utility** - Centralized fetch with error handling

### Phase 2: Server Modularization (Week 1-2)
1. **Extract middleware** - Move auth, error, upload, CORS to separate files
2. **Create route modules** - Split routes by domain (auth, services, cases, config)
3. **Extract services** - Move business logic from controllers
4. **Update server/index.js** - Should be <100 lines after refactoring

### Phase 3: Client Auth Feature (Week 2)
1. **Create AuthContext** - Login state, user info
2. **Extract auth components** - LoginForm, SetupForm, TwoFactorForm
3. **Create useAuth hook** - Login, logout, token refresh
4. **Test auth flow** - Ensure no regression

### Phase 4: Client Services Feature (Week 3)
1. **Create ServicesContext** - Services list, loading states
2. **Extract service components** - ServiceList, ServiceModal, ServiceCard
3. **Create useServices hook** - CRUD operations
4. **Integrate DnD** - Move sortable logic to hook

### Phase 5: Client Cases & Config (Week 3-4)
1. **Extract cases feature** - Similar to services
2. **Extract config feature** - Site settings form
3. **Compose Admin page** - Assemble from feature components
4. **Delete old Admin.jsx** - Should be replaced by composition

### Phase 6: Polish (Week 4)
1. **Mobile responsiveness** - Test all breakpoints
2. **Error boundaries** - Add React error boundaries
3. **Loading states** - Skeleton screens
4. **E2E testing** - Critical user flows

## Anti-Patterns to Avoid

### Anti-Pattern 1: Prop Drilling Through Many Layers

**What people do:** Pass props through 5+ component layers

**Why it's wrong:** Creates brittle dependencies, hard to refactor

**Do this instead:** Use Context for truly global data, or component composition

```jsx
// Bad: Drilling through layers
<Layout user={user}><Dashboard user={user}><Sidebar user={user} /></Dashboard></Layout>

// Good: Context for global, composition for local
<AuthContext.Provider value={user}>
  <Layout><Dashboard><Sidebar /></Dashboard></Layout>
</AuthContext.Provider>
```

### Anti-Pattern 2: Giant useEffect Hooks

**What people do:** Single useEffect that does everything

**Why it's wrong:** Hard to test, unclear dependencies, race conditions

**Do this instead:** Split by concern, use custom hooks

```jsx
// Bad: Everything in one effect
useEffect(() => {
  fetchData();
  setupListeners();
  trackAnalytics();
}, [id]);

// Good: Separate hooks
useFetchData(id);
useEventListeners();
useAnalytics('page_view');
```

### Anti-Pattern 3: Server Business Logic in Routes

**What people do:** Put all logic in route handlers

**Why it's wrong:** Can't reuse, hard to test, route file grows huge

**Do this instead:** Service layer with clear responsibilities

```javascript
// Bad: Logic in route
app.post('/services', async (req, res) => {
  const { title, description } = req.body;
  // 50 lines of validation and business logic
  const service = await prisma.service.create({ data: { title, description } });
  res.json(service);
});

// Good: Delegated to service
app.post('/services', servicesController.create);
// Controller validates, service handles business logic
```

### Anti-Pattern 4: Premature Abstraction

**What people do:** Create shared utilities that are only used once

**Why it's wrong:** Adds indirection without value

**Do this instead:** Wait for 2-3 uses before extracting

**Rule of Three:**
- First use: Write it inline
- Second use: Copy/paste and modify
- Third use: Now extract to shared utility

## Sources

- [React Documentation - Thinking in React](https://react.dev/learn/thinking-in-react) - Component composition patterns
- [React Documentation - Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context) - State management patterns
- [React Documentation - Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) - Context best practices
- [Express Documentation - Routing](https://expressjs.com/en/guide/routing.html) - Router patterns
- [Express Documentation - Writing Middleware](https://expressjs.com/en/guide/writing-middleware.html) - Middleware architecture
- [Express Documentation - Using Middleware](https://expressjs.com/en/guide/using-middleware.html) - Middleware organization

---

*Architecture research for: Podiatry Clinic Website Refactoring*
*Researched: 2026-02-03*

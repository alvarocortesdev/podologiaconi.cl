# Phase 1: Foundation & Testing Infrastructure - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish testing infrastructure (Vitest, React Testing Library), test database configuration, API client utilities, and project structure reorganization. This phase enables safe refactoring of monolithic components by providing test coverage before code changes. Critical for preventing "Big Bang" refactor trap.

**Deliverables:**
- Vitest configuration with coverage reporting
- React Testing Library setup for components
- API test utilities and client mocks
- Test database configuration (Vitest + Prisma)
- Project structure preparation for modular components

</domain>

<decisions>
## Implementation Decisions

### Coverage Threshold
- **Claude's discretion:** Use standard industry practices (70-80% overall, no strict per-file thresholds initially)
- Start with reporting only, enforce thresholds after baseline established

### Test Type Prioritization
- **Claude's discretion:** Use balanced approach (50% unit, 40% integration, 10% E2E)
- Prioritize API integration tests given Express server refactor in Phase 2
- Unit tests for pure utility functions and hooks

### Test Data Strategy
- **Claude's discretion:** Use factories for dynamic test data generation
- Fixtures for static reference data
- Database transactions for test isolation (rollback after each test)

### Testing Libraries
- Vitest 4.x (already determined from research)
- React Testing Library 16.x (already determined from research)
- MSW (Mock Service Worker) for API mocking
- @testing-library/user-event for interaction testing

</decisions>

<specifics>
## Specific Ideas

**References from research:**
- Vitest is Vite-native, reuses existing Vite config
- Characterization tests first for existing components (capture current behavior)
- Prisma test client for database operations in tests

**No specific user requirements beyond research findings.**

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-testing*
*Context gathered: 2026-02-03*

# Frontend Architecture

## Purpose
This document defines the frontend architecture for Fiber Control.

The frontend must translate backend capabilities into an operational interface with clear hierarchy and high daily usability.

Fiber Control is not:
- a decorative dashboard
- an AI-style website
- a landing page
- a marketing-first SaaS shell

The frontend must help the user make daily decisions with speed and confidence.

---

## 1. Frontend Mission

The frontend must provide a practical operational interface for recurring-service businesses.

It must help the user:
- understand who paid and who did not
- identify overdue and suspended customers
- register payments quickly
- track revenue changes
- view financial health
- monitor alerts and fiscal deadlines
- understand regional performance
- plan routes and operations
- export and review reports

The frontend must turn backend data into useful action.

---

## 2. Official Frontend Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form for forms
- Zod where useful for client-side validation
- TanStack Query or equivalent data-fetching strategy if adopted
- Lucide icons
- charting only when there is a real operational need

Rules:
- prefer internal components over imported UI kits
- do not adopt `shadcn/ui` by default
- do not introduce visual libraries without explicit documented need

---

## 3. Frontend Design Principles

- operational clarity over decoration
- dense but ordered information
- clean layout with strong information hierarchy
- consistency across pages
- reusable design language
- fast recognition of critical states
- responsive behavior
- predictable navigation
- easy daily operation

---

## 4. Architectural Style

The frontend should be organized by feature and shared UI layers.

Avoid giant page files containing:
- data fetching
- business mapping
- form logic
- presentational markup
- helper utilities

Use separation between:
- route/page entry
- feature containers
- reusable UI components
- API client layer
- hooks
- schemas
- types

---

## 5. Core Frontend Structure

Recommended structure:

```txt
apps/web/
  src/
    app/
    components/
    features/
    lib/
    hooks/
    services/
    config/
    types/
    styles/
```

---

## 6. Responsibilities by Layer

### app/

Contains:
- Next.js route structure
- layouts
- page entry points
- route groups
- auth boundaries

Keep this layer thin.

### components/

Contains reusable shared UI building blocks.

Examples:
- app shell
- sidebar
- topbar
- tables
- filters
- status badges
- compact summary blocks
- empty states
- loading states
- dialogs
- form primitives

### features/

Contains feature-specific modules.

Examples:
- auth
- dashboard
- customers
- payments
- finance
- alerts
- regions
- routes
- reports
- settings

### services/

Contains communication with backend APIs.

### hooks/

Contains reusable React hooks.

### lib/

Contains shared helpers and infrastructure.

### config/

Contains client-side config and environment-related helpers.

### types/

Contains truly shared types only.

---

## 7. Feature Structure

Recommended pattern per feature:

```txt
features/customers/
  components/
  hooks/
  schemas/
  types/
  utils/
  index.ts
```

---

## 8. Routing Architecture

Recommended main navigation routes:
- /login
- /dashboard
- /customers
- /customers/[id]
- /payments
- /finance
- /alerts
- /regions
- /routes
- /reports
- /settings

Alternative approach:
Use drawers or dialogs for create/edit actions when this improves operational flow.

---

## 9. Layout Architecture

### Public layout

Used for login and future auth support pages.

### Authenticated app layout

Must include:
- sidebar
- topbar
- content container
- consistent spacing
- responsive collapse behavior

---

## 10. UI System Architecture

The frontend must behave like one coherent product.

### Reusable primitives

- button
- input
- select
- textarea
- checkbox
- badge
- table
- tabs
- dialog
- drawer
- tooltip
- empty state
- skeleton
- alert box

### Reusable product patterns

- status chips
- filter bars
- summary sections
- action panels
- page headers
- metric blocks
- chart sections

---

## 11. Data Fetching Architecture

Frontend data fetching must be predictable and isolated.

Recommended approach:
- page or feature container calls service hook
- service hook calls API layer
- UI components receive already shaped data

---

## 12. API Integration Principles

The frontend must trust the backend as source of truth.

Rules:
- never hardcode business values that should come from the API
- keep response handling explicit
- adapt backend data for display, not for redefining rules

---

## 13. Authentication Architecture

Authentication logic should be centralized.

Recommended structure:
- features/auth
- auth provider or auth store
- protected route or layout logic
- token handling in one place

---

## 14. Page Architecture by Module

Future modules must support:
- dashboard
- customers
- payments
- finance
- alerts
- regions
- routes
- reports

But foundation work must stop before implementing full business pages.

---

## 15. Form Architecture

Use consistent form handling across the app.

Rules:
- shared form components
- explicit validation
- clear error messages
- inline feedback where useful
- disabled and loading submit states

---

## 16. State Management Principles

Prefer:
- local state for local UI
- feature hooks for feature concerns
- query or cache layer for server data
- centralized auth state only where necessary

Avoid giant global stores.

---

## 17. UX State Architecture

Every significant screen should define:
- loading state
- empty state
- error state
- success feedback
- actionable next step

These states must be operational, not decorative.

---

## 18. Visual Consistency Rules

The frontend must maintain consistency in:
- spacing
- radius
- shadows
- typography
- icon usage
- badge colors
- status meaning
- page section rhythm

Suggested visual tone:
- neutral backgrounds
- restrained surfaces
- blue or indigo primary actions
- green success
- red danger
- amber warning

Avoid:
- hero sections
- glassmorphism
- glow and blur styling
- inflated cards
- marketing-first composition

---

## 19. Chart Architecture

Charts must provide useful business insight, not decoration.

Recommended chart uses:
- revenue trend by month
- expected vs received
- customer status distribution
- regional performance comparison
- overdue concentration

Use charts only when they improve operation.

---

## 20. Table Architecture

Tables are critical for:
- customers
- payments
- reports
- alerts
- regional lists

Tables must support:
- readable columns
- filters
- sorting where useful
- status visibility
- actions
- mobile fallback behavior when needed

---

## 21. Frontend Development Order

Recommended order:

### Phase 1 Foundation
- Next.js setup
- Tailwind
- app shell
- route structure
- API client
- navigation model
- own operational primitives

### Phase 2 Auth
- login page
- protected layout
- logout flow

### Phase 3 and beyond
- dashboard
- customers
- payments
- finance
- alerts
- regions
- routes
- reports
- settings

---

## 22. Definition of Frontend Done

A frontend task is done only when:
- UI is implemented
- loading, empty, and error states exist
- API integration is real
- no fake hardcoded business data remains
- design is consistent with the product language
- accessibility and usability are acceptable
- the page supports real user action

Before business screens, the foundation must also respect `docs/rules/frontend-operational-rule.md`.

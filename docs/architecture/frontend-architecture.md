# Frontend Architecture

## Purpose
This document defines the frontend architecture for Fiber Control.

The frontend must translate the backend capabilities into a premium, clear, and operational SaaS experience.

Fiber Control is not a decorative dashboard.
The frontend must help the user make daily decisions with speed and confidence.

The architecture must support:
- clarity
- maintainability
- consistent UI
- safe API integration
- feature scalability
- reusable components
- premium product perception

---

## 1. Frontend Mission
The frontend must provide a professional operational interface for recurring-service businesses.

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
- shadcn/ui
- Recharts or equivalent charting solution
- React Hook Form for forms
- Zod where useful for client-side validation
- TanStack Query or equivalent data-fetching strategy if adopted
- Lucide icons

---

## 3. Frontend Design Principles
- Premium and sellable SaaS feel
- Clean layout with strong information hierarchy
- Operational clarity before decoration
- Consistency across pages
- Reusable design language
- Fast recognition of critical states
- Responsive behavior
- Predictable navigation

The product should feel:
- modern
- trustworthy
- professional
- intelligent
- easy to operate daily

---

## 4. Architectural Style
The frontend should be organized by feature and shared UI layers.

Avoid giant page files containing:
- data fetching
- business mapping
- form logic
- presentational markup
- helper utilities
all mixed together.

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
- authentication boundaries

This layer should stay thin.
Page files should orchestrate sections, not contain all UI logic.

### components/

Contains reusable shared UI building blocks.

Examples:
- app shell
- sidebar
- topbar
- cards
- tables
- filters
- status badges
- charts wrappers
- empty states
- loading states
- dialogs
- form primitives

These components should be generic and reusable across features.

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

Each feature may contain:
- components
- hooks
- forms
- mappers
- schemas
- types

This is the main product-oriented organization layer.

### services/

Contains communication with backend APIs.

Responsibilities:
- API client configuration
- endpoint calls
- request helpers
- response mapping when needed

This layer must isolate backend communication from page rendering.

### hooks/

Contains reusable React hooks.

Examples:
- auth hooks
- UI state hooks
- filter hooks
- query parameter hooks
- table state hooks

Avoid duplicating page-specific state logic across multiple screens.

### lib/

Contains shared helpers and infrastructure.

Examples:
- API client
- token storage helpers
- formatting utilities
- date utilities
- currency formatting
- class utilities
- constants

### config/

Contains client-side config and environment-related helpers.

Examples:
- base API URL
- feature flags
- app metadata
- route constants

### types/

Contains shared types that are useful across the frontend.

Types should not become a dumping ground.
Prefer feature-local types unless they are genuinely shared.

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

Examples:
- features/dashboard
- features/customers
- features/payments
- features/finance

This keeps product logic close to the feature it belongs to.

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

Optional support routes:
- /customers/new
- /customers/[id]/edit
- /payments/new

Alternative approach:
Use drawers/modals for create/edit actions while keeping list pages stable.

---

## 9. Layout Architecture

### Public layout

Used for:
- login
- future password recovery or public auth screens

Must be simpler and focused.

### Authenticated app layout

Used for:
- dashboard
- internal modules

Must include:
- sidebar
- topbar
- content container
- consistent spacing
- responsive collapse behavior

This layout should be shared by all authenticated pages.

---

## 10. UI System Architecture

The frontend must behave like one coherent product.

Use a consistent design system with:

### Reusable primitives
- card
- button
- input
- select
- table
- badge
- tabs
- modal
- drawer
- tooltip
- empty state
- skeleton
- alert box

### Reusable product patterns
- KPI cards
- analytics cards
- status chips
- filter bars
- summary sections
- action panels
- page headers
- metric grids
- chart sections

Every page should reuse the same visual language.

---

## 11. Data Fetching Architecture

Frontend data fetching must be predictable and isolated.

Recommended principles:
- keep requests out of random component trees
- centralize endpoint calls in services
- standardize loading, error, and empty states
- avoid scattering fetch logic across dozens of files

Recommended approach:
- page or feature container calls service hook
- service hook calls API layer
- UI components receive already shaped data

Examples:
- useDashboardSummary
- useCustomersList
- useFinanceSummary
- useAlerts

---

## 12. API Integration Principles

The frontend must trust the backend as source of truth.

Rules:
- never hardcode business values that should come from the API
- keep response handling explicit
- normalize status labels where helpful for UI
- maintain consistency with Swagger contracts

The frontend should adapt backend data for display, not redefine business rules.

---

## 13. Authentication Architecture

The frontend must support backend authentication cleanly.

Responsibilities:
- login form
- token/session persistence
- route protection
- logout flow
- protected app shell

Authentication logic should be centralized.

Recommended structure:
- features/auth
- auth provider or auth store
- protected route/layout logic
- token handling in one place

Do not spread auth checks randomly across unrelated components.

---

## 14. Page Architecture by Module

### Dashboard

Must show:
- revenue this month
- expected revenue
- overdue customers
- active customers
- paid vs pending signals
- alert preview
- regional performance
- route preview
- insight cards

### Customers

Must support:
- list
- filters
- search
- detail
- create/edit
- clear status visibility

### Payments

Must support:
- payment list
- register payment
- reference month
- status visibility
- payment detail if needed

### Finance

Must support:
- monthly summary
- yearly summary
- previous year
- expected vs received
- estimated tax
- fiscal reminders
- reconciliation summary

### Alerts

Must feel like an operational control center.

### Regions

Must support regional comparison and growth insight.

### Routes

Must support practical field planning.

### Reports

Must support executive summary and export-oriented viewing.

---

## 15. Form Architecture

Use consistent form handling across the app.

Rules:
- shared form components
- explicit validation
- clear error messages
- inline feedback where helpful
- disabled/loading submit states
- do not mix raw API payload construction directly inside presentational input blocks

Recommended use:
- React Hook Form
- Zod where needed

Important forms:
- login
- create customer
- edit customer
- register payment
- tax config
- fiscal reminder
- settings

---

## 16. State Management Principles

Do not introduce heavy global state unless clearly needed.

Prefer:
- local state for local UI
- feature hooks for feature concerns
- query/cache layer for server data
- centralized auth state only where necessary

Avoid:
- giant global stores for everything
- duplicating server state in many places
- overengineering state too early

---

## 17. UX State Architecture

Every significant screen should define:
- loading state
- empty state
- error state
- success feedback
- actionable next step

Examples:
- customers list with no customers
- payments list with no results
- finance module with no data yet
- alerts panel with no active alerts

Premium SaaS products feel polished because these states are handled well.

---

## 18. Visual Consistency Rules

The frontend must maintain consistency in:
- spacing
- radius
- shadows
- typography
- icon usage
- chart language
- badge colors
- status meaning
- page section rhythm

Suggested visual tone:
- soft cool gray backgrounds
- white cards
- blue/indigo primary
- green success
- red danger
- amber warning
- lime accent for premium highlights

Do not let each page feel like a different app.

---

## 19. Chart Architecture

Charts must provide useful business insight, not decoration.

Recommended chart uses:
- revenue trend by month
- expected vs received
- paid vs overdue ratio
- customer growth vs churn
- regional performance comparison
- overdue concentration
- financial health indicators

Charts should:
- be readable
- match card language
- be visually lightweight
- support premium perception

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

Tables should feel refined, not generic.

---

## 21. Frontend Development Order

Recommended order:

### Phase 1 Foundation
- Next.js setup
- Tailwind
- shadcn/ui
- app shell
- route structure
- API client
- auth base

### Phase 2 Auth
- login page
- protected layout
- logout flow

### Phase 3 Dashboard
- dashboard page
- KPI cards
- charts
- alerts preview
- regional summary

### Phase 4 Customers
- list
- details
- create/edit flow

### Phase 5 Payments
- list
- register payment
- payment states

### Phase 6 Finance
- summaries
- tax area
- fiscal reminders
- reconciliation summary

### Phase 7 Alerts / Regions / Routes
- alerts center
- regions performance
- routes planning

### Phase 8 Reports / Settings
- report views
- settings and company configuration

---

## 22. Definition of Frontend Done

A frontend task is done only when:
- UI is implemented
- loading/empty/error states exist
- API integration is real
- no fake hardcoded business data remains
- design is consistent with the product language
- accessibility/basic usability is acceptable
- the page supports real user action

---

## 23. Long-Term Direction

The frontend should remain capable of evolving into:
- multi-role dashboards
- richer analytics
- mobile-adaptive operational flows
- more advanced filtering
- export and automation flows
- team collaboration features

The initial architecture must stay simple, but strong enough to scale.

# Frontend Feature Map

## Purpose
This document maps the Fiber Control frontend features and their responsibilities.

The goal is to help development stay organized by product domain instead of by random UI files.

Each feature should have clear purpose, pages, components, hooks, and API dependencies.

---

## 1. Auth

### Purpose
Handle authentication and protected access.

### Main pages
- `/login`

### Responsibilities
- login form
- credential submission
- auth state
- token/session handling
- protected layout access
- logout flow

### Possible structure
```txt
features/auth/
  components/
  hooks/
  schemas/
  types/
  utils/
```

---

## 2. Dashboard

### Purpose
Show business overview and daily priorities.

### Main pages
- `/dashboard`

### Responsibilities
- KPI summary cards
- revenue trends
- customer status overview
- alerts preview
- regional performance preview
- route preview
- quick insights

### Main backend dependencies
- finance summary
- alerts
- region performance
- customer counts
- payments/activity

---

## 3. Customers

### Purpose
Manage customers and their operational state.

### Main pages
- `/customers`
- `/customers/new`
- `/customers/[id]`
- `/customers/[id]/edit`

### Responsibilities
- customers list
- filters and search
- status visibility
- create customer
- edit customer
- customer details
- payment history preview
- operational actions

### Main backend dependencies
- customers endpoints
- regions list
- payments history per customer

---

## 4. Payments

### Purpose
Track, inspect, and register payments.

### Main pages
- `/payments`
- `/payments/new`

### Responsibilities
- payments list
- filters by month/status/method
- register payment
- show payment status
- support operational reconciliation view later

### Main backend dependencies
- payments endpoints
- customer reference data

---

## 5. Finance

### Purpose
Provide financial visibility and recurring business diagnostics.

### Main pages
- `/finance`

### Responsibilities
- monthly summary
- yearly summary
- previous year summary
- expected vs received
- overdue amount
- pending amount
- estimated tax
- fiscal reminders preview
- reconciliation preview

### Main backend dependencies
- finance summary endpoints
- tax config
- fiscal reminders
- reconciliation summary

---

## 6. Alerts

### Purpose
Act as an operational control center for important issues.

### Main pages
- `/alerts`

### Responsibilities
- show critical alerts
- group alerts by severity/type
- display overdue warnings
- show suspension-related alerts
- show fiscal warnings
- show unmatched payment warnings

### Main backend dependencies
- alerts endpoint

---

## 7. Regions

### Purpose
Support regional diagnosis and expansion analysis.

### Main pages
- `/regions`

### Responsibilities
- compare regional performance
- customer count by region
- overdue by region
- revenue by region
- growth/decline by region
- best and worst region insights

### Main backend dependencies
- region performance endpoints
- regions list
- region customer list

---

## 8. Routes

### Purpose
Support field operation and visit planning.

### Main pages
- `/routes`

### Responsibilities
- group customers by region
- prioritize visits
- route planning visualization
- route summary cards
- daily operational planning

### Main backend dependencies
- region customer data
- customer status data

---

## 9. Reports

### Purpose
Present executive and export-oriented views of the business.

### Main pages
- `/reports`

### Responsibilities
- monthly reports
- customer reports
- region reports
- financial reports
- date filtering
- export entry points

### Main backend dependencies
- reports endpoints
- finance data
- region data
- customer data

---

## 10. Settings

### Purpose
Handle configuration and account/business preferences.

### Main pages
- `/settings`

### Responsibilities
- company information
- tax configuration
- notification preferences
- profile basics
- product preferences
- future branding settings

### Main backend dependencies
- tax config
- user/account settings endpoints when available

---

## 11. Shared App Shell

### Purpose
Provide the main authenticated experience.

### Responsibilities
- sidebar
- topbar
- navigation state
- quick actions
- notifications entry
- profile menu
- layout consistency

### Suggested placement
```txt
components/layout/
```

---

## 12. Shared UI Library

### Purpose
Provide reusable primitives and patterns.

### Responsibilities
- cards
- badges
- tables
- filters
- dialogs
- drawers
- skeletons
- empty states
- form controls
- chart wrappers

### Suggested placement
```txt
components/ui/
components/shared/
```

---

## 13. Suggested Frontend Build Order

### Phase 1
- auth
- app shell
- dashboard

### Phase 2
- customers

### Phase 3
- payments

### Phase 4
- finance

### Phase 5
- alerts
- regions
- routes

### Phase 6
- reports
- settings

---

## 14. Feature Map Definition of Done

The feature map is being respected when:
- each feature owns its own logic
- pages are not giant mixed files
- API integration stays isolated
- UI patterns are reused
- frontend growth remains organized

# Frontend Routing

## Purpose
This document defines the routing architecture for Fiber Control frontend.

The routing structure must be:
- predictable
- scalable
- easy to navigate
- aligned with the product modules
- compatible with authenticated and public areas

The goal is to make the app feel coherent and operational.

---

## 1. Routing Principles
- keep route names simple
- use feature-oriented paths
- avoid deeply nested confusing structures
- separate public routes from authenticated routes
- keep URL structure stable and readable
- route organization must reflect product modules

---

## 2. Main Route Groups

### Public Routes
These routes do not require authentication.

Examples:
- `/login`

Future optional examples:
- `/forgot-password`
- `/reset-password`

### Authenticated Routes
These routes require a valid authenticated session.

Examples:
- `/dashboard`
- `/customers`
- `/customers/new`
- `/customers/[id]`
- `/customers/[id]/edit`
- `/payments`
- `/payments/new`
- `/finance`
- `/alerts`
- `/regions`
- `/routes`
- `/reports`
- `/settings`

---

## 3. Recommended App Router Structure

```txt
src/app/
  (public)/
    login/
      page.tsx
  (app)/
    layout.tsx
    dashboard/
      page.tsx
    customers/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
        edit/
          page.tsx
    payments/
      page.tsx
      new/
        page.tsx
    finance/
      page.tsx
    alerts/
      page.tsx
    regions/
      page.tsx
    routes/
      page.tsx
    reports/
      page.tsx
    settings/
      page.tsx
  page.tsx
```

---

## 4. Route Responsibilities

### /login

Purpose:
- authenticate the user
- handle invalid credentials
- redirect to dashboard after success

### /dashboard

Purpose:
- provide operational overview
- show revenue, alerts, regional performance, route preview, and insights

### /customers

Purpose:
- list customers
- filter by status, region, due day
- search customers
- trigger create flow

### /customers/new

Purpose:
- create a new customer

Alternative:
- may become a modal/drawer in the future, but page route should still be architecturally supported

### /customers/[id]

Purpose:
- show customer details
- show customer status
- show payment history
- allow fast actions

### /customers/[id]/edit

Purpose:
- edit customer information

### /payments

Purpose:
- list payments
- filter by month, status, customer, method
- inspect payment states

### /payments/new

Purpose:
- register a payment

Alternative:
- may later be implemented as a modal, but route support is still useful

### /finance

Purpose:
- show financial summaries
- expected vs received
- estimated tax
- fiscal reminders
- reconciliation summary

### /alerts

Purpose:
- centralize operational alerts
- help the user act quickly

### /regions

Purpose:
- compare regional performance
- support growth and diagnosis

### /routes

Purpose:
- plan field visits
- show route groupings
- support operational planning

### /reports

Purpose:
- show summaries and export-ready report views

### /settings

Purpose:
- manage company, user, tax, notifications, and basic preferences

---

## 5. Navigation Rules

Sidebar should link to:
- Dashboard
- Customers
- Payments
- Finance
- Alerts
- Regions
- Routes
- Reports
- Settings

Topbar may include:
- search
- notifications
- quick actions
- profile menu

---

## 6. Protected Routing Rules

Authenticated routes must be protected by layout or route guard logic.

Rules:
- unauthenticated users must be redirected to `/login`
- authenticated users should not be sent back to login unnecessarily
- token/session validation should happen before rendering protected content

---

## 7. Create/Edit Flow Recommendation

Support both approaches architecturally:

### Dedicated route approach

Good for:
- clarity
- direct links
- browser navigation
- future complexity

Examples:
- `/customers/new`
- `/customers/[id]/edit`
- `/payments/new`

### Drawer/modal approach

Good for:
- faster workflows
- list-context editing
- premium operational UX

Recommended:
- keep route support even if UI later uses drawers/modals

---

## 8. Route Naming Rules

- use lowercase
- use English
- use nouns for modules
- avoid technical or vague names
- keep paths short and clear

Good:
- `/customers`
- `/payments`
- `/finance`

Avoid:
- `/customer-management-center`
- `/money-panel`
- `/smart-analytics-overview`

---

## 9. Default Route Behavior

- `/` should redirect to `/dashboard` if authenticated
- `/` should redirect to `/login` if not authenticated

---

## 10. Future Route Extensions

Possible future additions:
- `/bank-entries`
- `/reconciliation`
- `/reports/monthly`
- `/reports/customers`
- `/settings/team`
- `/settings/security`

Do not create these until needed.

---

## 11. Routing Definition of Done

Routing is correct when:
- routes reflect product modules
- public and protected areas are clearly separated
- route names are stable and readable
- create and edit flows are supported
- the default route behavior is defined
- navigation is coherent with the product

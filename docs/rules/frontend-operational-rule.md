# Frontend Operational Rule

## Purpose
This document defines the mandatory frontend direction for Fiber Control before any business screen is implemented.

Fiber Control is an operational and financial system.
It must not be converted into:
- AI-style website
- generic marketing landing page
- decorative SaaS dashboard template
- visually inflated interface that reduces operational clarity

Frontend must serve operation first.

---

## 1. Product Positioning

Fiber Control frontend must look and behave like:
- operational software
- dense but ordered business interface
- system for daily work
- interface for control, review, and action

It must not behave like:
- marketing-first website
- hero-driven product showcase
- trend-driven AI product shell
- ornamental admin template

---

## 2. Mandatory UI Direction

Prioritize:
- tables
- filters
- search
- status chips
- compact summary blocks
- objective forms
- explicit navigation
- high-signal dashboards
- dense information with visual order

Operational clarity wins over visual flourish.

If there is a conflict between beauty and operation, operation wins.

---

## 3. Visual Restraint Rules

Avoid by default:
- hero sections
- landing page structures
- glassmorphism
- glow effects
- heavy blur
- oversized gradients
- inflated cards
- decorative motion
- empty whitespace used only for style

Use visual emphasis only when it improves:
- scanning
- error recognition
- status recognition
- action hierarchy

---

## 4. Official Frontend Baseline

Default baseline:
- Next.js
- React
- TypeScript
- Tailwind CSS
- own components first

Rules:
- do not use `shadcn/ui` by default
- do not add visual libraries without explicit need
- prefer simple internal primitives over imported UI kits
- introduce third-party UI abstractions only when the project has a documented justification

---

## 5. Layout Rules

Frontend foundation must start with:
- app shell
- sidebar or primary navigation
- top bar
- content container
- page header pattern
- filter bar pattern
- table pattern
- form pattern
- status chip pattern

The foundation must be reusable and operational before any feature page is expanded.

---

## 6. Page Behavior Rules

Every future screen should be able to support:
- loading state
- empty state
- error state
- filter state
- actionable next step

These states must be operational, not decorative.

---

## 7. Frontend Foundation Before Business Screens

Before implementing full business pages such as:
- customers
- payments
- alerts
- fiscal reminders
- reconciliation

the project must first formalize:
- route skeleton
- shared layout
- shared operational primitives
- navigation model
- visual hierarchy rules
- API integration boundary on the frontend

---

## 8. Definition of Frontend Foundation Done

Frontend foundation is considered ready only when:
- operational direction is documented
- the stack is explicit
- the forbidden visual shortcuts are explicit
- the base app structure is explicit
- the reusable primitives are defined
- no business screen was expanded beyond foundation scope

---

## 9. Governance Rule

If any frontend proposal conflicts with this document, the agent must:
1. stop implementation
2. update governance documentation first if the change is intentional
3. only then implement code

# Frontend Design System

## Purpose
This document defines the design system principles for Fiber Control frontend.

The design system must create a consistent, premium, and operational SaaS experience.

Fiber Control should feel:
- modern
- trustworthy
- clear
- premium
- actionable

This is not a playful UI.
This is a business control product.

---

## 1. Design Goals
The design system must support:
- operational clarity
- premium perception
- consistency across pages
- fast recognition of important data
- visual hierarchy
- reusable components
- scalable UI implementation

---

## 2. Visual Tone
Fiber Control should feel like:
- a premium SaaS
- a product people trust with business operations
- a system built for daily use
- a clear and smart operational tool

Avoid:
- playful consumer-app look
- overdecorated dashboards
- aggressive fintech styling
- visually noisy enterprise UI

---

## 3. Color System

### Core palette behavior
- background: soft cool gray
- cards/surfaces: white
- primary brand: deep blue or indigo
- premium accent: lime or yellow-green for active states and highlights
- success: green
- warning: amber/yellow
- danger: red
- muted text and borders: cool grays

### Semantic usage
- green = paid, healthy, positive growth
- red = overdue, suspended, failed, critical
- amber = warning, due today, upcoming reminder
- blue/indigo = main navigation, trusted actions, charts
- lime accent = active tabs, selected filters, modern premium detail

### Rule
Semantic colors must stay consistent across all pages.

---

## 4. Typography
Use a modern sans-serif typeface.

Typography hierarchy should support:
- strong KPI emphasis
- readable section titles
- subtle labels
- compact but comfortable tables

Suggested hierarchy:
- Page title
- Section title
- KPI value
- Card label
- Body text
- Metadata text

Rules:
- KPI values should be bold and easy to scan
- labels should be quieter
- avoid overly tiny text in operational areas

---

## 5. Spacing
The app must feel spacious and premium.

Rules:
- use consistent spacing scale
- allow breathing room between cards and sections
- avoid cramped tables and forms
- preserve rhythm across page sections

Spacing should communicate product maturity.

---

## 6. Radius and Surfaces
Cards and major surfaces should use soft rounded corners.

Suggested behavior:
- cards: rounded 2xl feel
- inputs and selects: refined rounded shape
- modals and drawers: soft premium corners

Cards must feel elegant, not bulky.

---

## 7. Shadows and Borders
Use:
- subtle shadows
- soft borders
- low-noise elevation

Avoid:
- heavy shadows
- dark harsh borders
- too much visual layering

The interface should feel refined, not loud.

---

## 8. Core UI Primitives
The design system should define reusable primitives such as:
- Button
- Input
- Select
- Textarea
- Checkbox
- Radio
- Badge
- Card
- Table
- Tabs
- Dialog
- Drawer
- Tooltip
- Empty state
- Skeleton
- Alert box

These primitives should be reused everywhere.

---

## 9. Product UI Patterns
In addition to primitives, define product-level patterns:

### KPI Cards
Used in:
- dashboard
- finance
- reports

Must contain:
- label
- main value
- trend/variation
- optional micro chart

### Summary Cards
Used for:
- tax status
- reconciliation summary
- region performance snapshots
- payment status overviews

### Status Badges
Must support:
- active
- due today
- overdue
- suspended
- inactive
- paid
- pending
- partial
- failed
- unmatched

Badges must be visually distinct and semantically consistent.

### Filter Bars
Used in:
- customers
- payments
- reports
- alerts
- regions

They should feel:
- clean
- compact
- premium
- usable without clutter

### Section Headers
Each page should use reusable section header patterns with:
- title
- subtitle if useful
- contextual action
- optional filters/tabs

---

## 10. Table Design
Tables are a major part of Fiber Control.

Tables must:
- feel polished
- show status clearly
- support filters
- support row actions
- remain readable

Use:
- soft row separators
- compact but comfortable density
- clear column labels
- strong status visibility
- action menus where useful

Avoid:
- overcrowded columns
- tiny action icons with no context
- unstructured tables

---

## 11. Form Design
Forms must feel premium and operational.

Rules:
- generous spacing
- strong labels
- useful placeholders
- inline validation states
- success/error feedback
- clear CTA buttons
- disabled/loading states

Important forms:
- login
- create customer
- edit customer
- register payment
- tax config
- fiscal reminder
- settings

---

## 12. Chart Language
Charts must communicate business insight clearly.

Use charts for:
- revenue over time
- expected vs received
- growth vs decline
- customer status distribution
- regional performance
- overdue concentration

Rules:
- charts must not feel decorative
- curves and bars should be clean
- axes and legends should be readable
- use consistent color semantics
- avoid visual overload

---

## 13. Layout Patterns

### App Shell
Shared authenticated layout with:
- sidebar
- topbar
- content wrapper

### Page Header
Reusable header with:
- title
- subtitle
- primary action
- optional filters

### Content Grid
Use card grids that remain consistent between pages.

---

## 14. States
Every important component/page must define:
- loading state
- empty state
- error state
- success state
- warning/attention state

These states should feel polished and intentional.

---

## 15. Interaction Design
Micro-interactions should be subtle and premium.

Examples:
- hover on cards
- active tab highlights
- button loading feedback
- table row hover
- modal/drawer transitions

Avoid:
- excessive motion
- flashy animations
- distracting behavior

---

## 16. Icons
Use a consistent icon family such as Lucide.

Rules:
- icons should support meaning, not replace labels
- use icons sparingly in tables
- maintain similar stroke weight and visual style across the app

---

## 17. Responsive Behavior
The app should be responsive, but optimized for business desktop/tablet use first.

Rules:
- sidebar should collapse elegantly
- cards should stack cleanly
- tables need fallback patterns on smaller screens
- forms should remain usable on smaller widths

---

## 18. Design System Definition of Done
The design system is being followed when:
- pages feel visually connected
- semantic colors stay consistent
- spacing/radius/shadows follow one language
- components are reused
- states are polished
- the app looks premium and sellable

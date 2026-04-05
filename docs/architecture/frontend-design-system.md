# Frontend Design System

## Purpose

This document defines the design system principles for Fiber Control frontend.

The design system must create a consistent and operational interface for daily business use.

Fiber Control should feel:
- trustworthy
- clear
- operational
- actionable

This is not a playful UI.
This is a business control product.

---

## 1. Design Goals

The design system must support:
- operational clarity
- consistency across pages
- fast recognition of important data
- visual hierarchy
- reusable components
- scalable UI implementation

---

## 2. Visual Tone

Fiber Control should feel like:
- a product people trust with business operations
- a system built for daily use
- a clear operational tool

Avoid:
- overdecorated dashboards
- aggressive fintech styling
- visually noisy enterprise UI
- AI landing page patterns
- marketing-first layout composition

---

## 3. Color System

### Core palette behavior
- background: neutral light surfaces
- cards and surfaces: restrained white or gray surfaces
- primary brand: deep blue or indigo
- success: green
- warning: amber or yellow
- danger: red
- muted text and borders: cool grays

### Semantic usage
- green = paid, healthy, positive
- red = overdue, suspended, failed, critical
- amber = warning, due today, upcoming reminder
- blue or indigo = trusted actions and navigation

### Rule

Semantic colors must stay consistent across all pages.

---

## 4. Typography

Use a modern sans-serif typeface.

Typography hierarchy should support:
- readable section titles
- strong KPI emphasis when needed
- subtle labels
- compact but comfortable tables

Rules:
- values should be easy to scan
- labels should be quieter
- avoid overly tiny text in operational areas

---

## 5. Spacing

The app must feel ordered and efficient.

Rules:
- use a consistent spacing scale
- avoid cramped tables and forms
- preserve rhythm across page sections
- do not create empty space only for style

---

## 6. Radius and Surfaces

Suggested behavior:
- restrained corner radius
- inputs and selects with clear hit area
- dialogs and drawers only when operationally justified

Surfaces must feel controlled, not bulky.

---

## 7. Shadows and Borders

Use:
- subtle shadows
- soft borders
- low-noise elevation

Avoid:
- heavy shadows
- harsh borders
- too much visual layering

---

## 8. Core UI Primitives

The design system should define reusable primitives such as:
- Button
- Input
- Select
- Textarea
- Checkbox
- Badge
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

Define product-level patterns:

### Status Chips

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

### Filter Bars

Must feel:
- clean
- compact
- direct
- usable without clutter

### Summary Blocks

Use for:
- operational counts
- financial snapshots
- tax state
- reconciliation summary

### Section Headers

Each page should use reusable section header patterns with:
- title
- subtitle when useful
- contextual action
- optional filters or tabs

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

Avoid:
- overcrowded columns
- tiny action icons with no context
- inflated card wrappers around every table

---

## 11. Form Design

Forms must feel operational and explicit.

Rules:
- generous spacing
- strong labels
- useful placeholders
- inline validation states
- success and error feedback
- clear CTA buttons
- disabled and loading states

---

## 12. Chart Language

Charts must communicate business insight clearly.

Use charts for:
- revenue over time
- expected vs received
- customer status distribution
- regional performance
- overdue concentration

Rules:
- charts must not feel decorative
- use consistent semantic colors
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

Use restrained grids that preserve order and scanability.

---

## 14. States

Every important component or page must define:
- loading state
- empty state
- error state
- success state
- warning state

These states should feel intentional, not decorative.

---

## 15. Interaction Design

Micro-interactions should be subtle and functional.

Examples:
- active tab highlight
- button loading feedback
- row hover
- focus states

Avoid:
- excessive motion
- flashy animations
- distracting transitions

---

## 16. Icons

Use a consistent icon family such as Lucide.

Rules:
- icons should support meaning, not replace labels
- use icons sparingly in tables
- keep stroke weight and visual style consistent

---

## 17. Responsive Behavior

The app should be responsive, but optimized for business desktop and tablet use first.

Rules:
- sidebar should collapse cleanly
- tables need fallback patterns on smaller screens
- forms should remain usable on smaller widths

---

## 18. Design System Definition of Done

The design system is being followed when:
- pages feel visually connected
- semantic colors stay consistent
- spacing, radius, and shadows follow one language
- components are reused
- states are polished
- the app remains operational-first and avoids template aesthetics

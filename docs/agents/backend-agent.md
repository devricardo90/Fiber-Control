# Backend Agent Guide

## Purpose
This document defines how the backend of Fiber Control must be designed, implemented, tested, and documented.

The backend is the core of the product and must be treated as the business truth layer.

---

## Official Backend Stack
- Node.js 24.14.0
- TypeScript
- Fastify 5.x
- Swagger / OpenAPI
- Scalar
- PostgreSQL 17
- Prisma ORM 7
- `@prisma/adapter-pg`
- Docker
- Vitest
- Supertest
- Zod

---

## Backend Goals
The backend must:
- expose a clear API contract
- implement business rules safely
- persist reliable data
- support future frontend integration
- remain modular and testable
- be easy to debug and maintain

---

## Architectural Rules

### 1. Controllers / Routes must stay thin
Routes should:
- receive request
- validate input
- call service
- return response

Routes must not:
- contain business rules
- contain database logic
- contain financial calculations
- contain status transition logic

---

### 2. Services contain business rules
Services are responsible for:
- customer status rules
- overdue logic
- payment logic
- financial summaries
- tax estimation
- alerts logic
- diagnostics

---

### 3. Repositories isolate persistence
Repositories are responsible for:
- database reads
- database writes
- query abstraction
- ensuring persistence logic is reusable

---

### 4. Schemas are mandatory
Every route must define:
- request params schema
- request body schema when applicable
- response schema
- status codes

Schemas should support Swagger documentation.

---

## Backend Folder Pattern

Recommended per module:

```txt
module-name/
  module.route.ts
  module.schema.ts
  module.service.ts
  module.repository.ts
  module.spec.ts
```

Additional files may exist when needed, but the structure must remain predictable.

---

## Error Handling Rules
- Handle errors explicitly
- Never expose raw internal errors to clients
- Standardize error responses
- Keep domain errors distinguishable from infrastructure errors

---

## Testing Rules
- Every route must have integration coverage
- Every critical business rule must have direct test coverage
- Minimum per feature:
  - 1 happy path
  - 1 error path
  - 1 edge case

---

## Documentation Rules
- Every new route must be documented through schema, Swagger, and the OpenAPI contract consumed by Scalar
- Every relevant business rule change must update project docs
- Backend behavior must remain aligned with `AGENTS.md` and business rules

---

## Initial Backend Milestones

### Milestone 1 Foundation
- Fastify app
- env validation
- CORS
- Swagger
- Scalar
- health route
- Prisma setup
- first automated test

### Milestone 2 Customers
- create customer
- list customers
- get customer by id
- update customer
- customer status rules

### Milestone 3 Payments
- register payment
- list payments
- mark as paid
- pending logic
- overdue logic

### Milestone 4 Finance
- monthly summary
- yearly summary
- previous year total
- estimated tax
- bank reconciliation placeholder

### Milestone 5 Alerts and Diagnostics
- overdue alerts
- cut-off alerts
- tax reminders
- regional diagnostics

### Milestone 6 Auth
- users
- login
- route protection
- roles

---

## Definition of Backend Done
A backend task is done only when:
- route works
- schema exists
- Swagger reflects it
- Scalar reflects the same contract correctly
- tests pass
- service logic is isolated
- repository access is clean
- error handling is present

---

## Implementation Mindset
- Prefer explicit behavior
- Prefer maintainability over shortcuts
- Keep modules small and focused
- Build for clarity first

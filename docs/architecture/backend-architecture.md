# Backend Architecture

## Purpose
This document defines the backend architecture for Fiber Control.

The backend is the core operational layer of the product and must be designed for:
- clarity
- modularity
- testability
- business correctness
- future scalability

It is the source of truth for business behavior.

---

## 1. Backend Mission
The backend must centralize and protect the business logic of Fiber Control.

It must be responsible for:
- customer lifecycle
- payment tracking
- overdue and suspension logic
- financial summaries
- alerts and diagnostics
- route-supporting data
- future authentication and authorization

The backend must not be treated as a thin data proxy.
It must enforce business rules consistently.

---

## 2. Official Backend Stack
- Node.js 24
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

## 3. Architectural Style
Fiber Control backend follows a modular service-oriented structure.

Each module should contain:
- route/controller layer
- schema layer
- service layer
- repository layer
- tests

This is not a full DDD implementation, but it follows strong separation of concerns.

---

## 4. Layer Responsibilities

### Route Layer
Responsible for:
- receiving HTTP requests
- validating input
- calling services
- returning HTTP responses
- exposing route schema to Swagger

Must not contain:
- business calculations
- direct Prisma queries
- status transition rules
- financial logic

### Schema Layer
Responsible for:
- request validation structures
- response schema
- Swagger contract definitions
- OpenAPI contract compatibility for Scalar
- route-level typing support

Must keep API contracts explicit and stable.

### Service Layer
Responsible for:
- business rules
- orchestration between repositories
- financial calculations
- customer status transitions
- alert generation logic
- diagnostics logic

This is the main decision-making layer of the backend.

### Repository Layer
Responsible for:
- database access
- encapsulating Prisma operations
- persistence reads and writes
- query reuse

Repositories must not contain route logic.
Repositories should stay close to data access concerns.

---

## 5. Core Backend Structure

Recommended structure:

```txt
apps/api/
  src/
    app.ts
    server.ts
    config/
    lib/
    plugins/
    modules/
    shared/
    tests/
  prisma/
  docker/
  docs/
```

---

## 6. Module Structure

Recommended per module:

```txt
module-name/
  module.route.ts
  module.schema.ts
  module.service.ts
  module.repository.ts
  module.spec.ts
```

Examples:
- customers
- payments
- finance
- alerts
- auth

---

## 7. Shared Infrastructure

### `app.ts`
Creates and configures the Fastify app.

Responsibilities:
- register plugins
- register routes
- centralize app construction

### `server.ts`
Responsible for:
- bootstrapping the server
- reading environment config
- starting the HTTP listener

### `config/`
Contains:
- env parsing
- constants
- runtime configuration helpers

### `lib/`
Contains:
- Prisma client
- custom errors
- low-level utilities

### `plugins/`
Contains Fastify plugin registration such as:
- CORS
- Swagger
- Scalar or Scalar-compatible API reference integration
- security-related plugins later

### `shared/`
Contains:
- reusable types
- reusable schemas
- helpers
- utility functions

---

## 8. API Design Principles

### Explicit contracts
Every route must have:
- input schema
- output schema
- status codes
- meaningful naming

### Predictable responses
Responses should be easy to consume in the frontend.

Recommended success shape:

```json
{
  "data": {}
}
```

Recommended error shape:

```json
{
  "error": {
    "code": "SOME_ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Stable naming
Use English in:
- routes
- code
- database models
- DTO-like structures
- schema keys

---

## 9. Database Architecture

### Official database
PostgreSQL 17

### ORM
Prisma ORM 7

`@prisma/adapter-pg`

### Data principles
- migrations are mandatory
- no manual schema drift
- relationships must be explicit
- financial data must stay auditable
- status changes must be deterministic

### Early core entities
- User
- Customer
- Payment
- BankEntry
- TaxConfig
- Alert

---

## 10. Status-Oriented Business Model

Fiber Control depends heavily on status transitions.

Examples:
- customer `active`
- customer `due_today`
- customer `overdue`
- customer `suspended`

Because of this:
- status logic must stay in services
- date calculations must be testable
- transitions must be deterministic
- services must not rely on vague implicit rules

---

## 11. Documentation Architecture

Swagger and Scalar are part of the API documentation architecture, not optional extras.

Requirements:
- every route must be documented through schema
- docs must stay aligned with implementation
- new modules must appear in docs as soon as they exist
- route examples should be added when useful

Primary docs entry:
- `/docs`
- a Scalar-based API reference entry should also exist in the backend foundation

---

## 12. Testing Architecture

Testing is required at architectural level.

### Foundation tests
Protect:
- app boot
- `/health`
- Swagger availability
- Scalar availability or OpenAPI compatibility for Scalar

### Integration tests
Protect:
- route contracts
- service + repository integration
- database interaction

### Service tests
Protect:
- payment rules
- overdue logic
- suspension logic
- financial summaries
- tax calculations

---

## 13. Error Architecture

Errors must be controlled and explicit.

### Internal errors
Handled internally and logged safely.

### Public errors
Must:
- use stable error codes
- avoid leaking internals
- map properly to HTTP status codes

Suggested categories:
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `INTERNAL_ERROR`

---

## 14. Security-Oriented Architecture

Security must exist in the architecture from day one.

This includes:
- validated env config
- validated request input
- safe logs
- explicit CORS config
- future auth-friendly route structure
- no hardcoded secrets
- safe response payloads

---

## 15. Configuration Architecture

Environment config must be:
- centralized
- validated at startup
- strongly typed
- required for critical values

Must validate:
- app environment
- port
- database url
- app url
- cors origin

The app must fail fast on invalid config.

---

## 16. Backend Development Phases

### Phase 1 Foundation
- Fastify app
- env validation
- CORS
- Swagger
- Scalar
- health route
- Prisma setup
- first tests

### Phase 2 Customers
- create customer
- list customers
- get by id
- update customer
- status logic foundation

### Phase 3 Payments
- register payment
- list payments
- reference month logic
- customer payment updates

### Phase 4 Finance
- monthly totals
- yearly totals
- previous year totals
- estimated tax

### Phase 5 Alerts and Diagnostics
- overdue alerts
- cut-off alerts
- tax reminders
- regional performance

### Phase 6 Auth
- users
- login
- protected routes
- role control

---

## 17. Definition of Architectural Compliance

A backend implementation is compliant when:
- responsibilities are separated correctly
- route contracts are explicit
- business rules live in services
- persistence is isolated
- tests exist
- documentation is aligned
- naming is consistent
- no critical shortcut breaks the architectural direction

---

## 18. Long-Term Direction

This backend should remain capable of evolving into:
- multi-tenant business control
- richer analytics
- automatic bank reconciliation
- webhook-driven payment recognition
- stronger auth and permissions
- operational dashboards for teams

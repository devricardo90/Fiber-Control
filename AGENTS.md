# AGENTS.md

## Project Name
Fiber Control

## Project Type
SaaS / Business Management Platform for recurring-service businesses

## Product Vision
Fiber Control is a business management platform built for small recurring-service providers, especially rural internet businesses and local subscription-based service operations.

The platform centralizes:
- customer management
- recurring billing control
- payment status tracking
- basic financial diagnostics
- route planning by region
- operational alerts
- business growth visibility

The goal is to give the business owner full control of the operation in one place.

---

## Main Problem Being Solved
Small service providers usually manage customers, payments, overdue accounts, field visits, and tax reminders through WhatsApp, bank apps, notebooks, spreadsheets, and memory.

This creates:
- missed payments
- weak tracking of overdue customers
- difficulty reconciling bank income
- poor route organization
- lack of business visibility
- no structured data for decisions

Fiber Control exists to solve this.

---

## Official Stack

### Backend
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

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Architecture Principles
- The backend is the source of truth.
- Business rules must live in services, never in controllers.
- Database access must be isolated in repositories.
- Every route must have request/response schema.
- Every completed technical feature must include automated tests.
- Documentation is part of the product, not an afterthought.
- Clarity is preferred over cleverness.
- Predictability is preferred over magic behavior.

---

## Development Order
1. Core documentation
2. Backend foundation
3. Database modeling
4. Customers module
5. Payments module
6. Financial module
7. Alerts and diagnostics
8. Authentication and authorization
9. Frontend implementation
10. API integration with frontend

---

## Core Product Modules
- Customers
- Payments
- Financial Overview
- Tax Reminder / Fiscal Agenda
- Alerts
- Route Planning
- Reports
- Authentication

---

## Coding Rules
- Use TypeScript everywhere
- Use English for code, folders, variables, database models, and API contracts
- Use Portuguese or English in docs only when useful for the team
- Avoid large files with mixed responsibilities
- Keep controllers thin
- Validate all external input
- Handle errors explicitly
- Avoid silent failures
- Never hardcode secrets
- Never skip tests for critical flows

---

## Folder Strategy
The project should be organized in a modular way.

Recommended top-level structure:

- `docs/`
- `apps/api`
- `apps/web`
- `packages/` (future shared packages if needed)

---

## Documentation Rules
Every important implementation should update documentation when relevant.

Required docs:
- PRD
- Business rules
- Backend architecture
- Security rules
- Testing rules
- API standards

---

## Testing Standard
A technical task is not considered complete unless:
- implementation exists
- tests pass
- route contract is documented
- error handling exists
- naming follows project standard

Minimum expectation per feature:
- 1 happy path test
- 1 error path test
- 1 edge case test

---

## Security Baseline
- Validate all input
- Never expose internal errors directly
- Protect secrets in environment variables
- Avoid sensitive data in logs
- Prepare for rate-limiting and auth hardening
- Apply least privilege principles

---

## Definition of Done
A task is done only when:
- code is implemented
- automated tests are passing
- docs are updated if needed
- API contract is documented
- code follows project structure and naming conventions
- no critical warning is left unresolved

---

## Product Mindset
Fiber Control is not just a CRUD app.

It is an operational system that should help the business owner:
- know who paid
- know who did not pay
- understand revenue movement
- organize field work
- detect losses and opportunities
- make faster and safer decisions

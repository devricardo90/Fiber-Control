# Fiber Control

Fiber Control is a portfolio-grade MVP for ISP operational and financial management.

The project is intentionally scoped to show real software delivery discipline: backend-first execution, documented API contracts, authenticated flows, PostgreSQL persistence, public staging validation, and explicit operational governance. It is not presented as a finished enterprise SaaS.

## Project Overview

Fiber Control addresses a practical operational problem: small and mid-sized ISPs often need one place to handle customers, payments, alerts, finance visibility, regional performance, and route-oriented operations without depending on disconnected spreadsheets and ad hoc workflows.

This repository demonstrates the minimum viable version of that idea:
- a real API
- a real authenticated web shell
- documented MVP boundaries
- live staging deployment
- evidence-based execution records

Operational source of truth:
- [STATUS.md](./STATUS.md)
- [backlog.md](./backlog.md)
- [MVP scope](./docs/product/mvp-scope.md)
- [Recruiter evidence pack](./docs/project/recruiter-evidence-pack.md)
- [Staging runbook](./docs/ops/staging-runbook.md)

## Live Staging

Public staging currently runs on a real provider chain:
- Web staging: `https://app-fiber-control-web-staging.vercel.app`
- API docs: `https://app-fiber-control-api-staging.onrender.com/docs`
- API health: `https://app-fiber-control-api-staging.onrender.com/health`
- API OpenAPI document: `https://app-fiber-control-api-staging.onrender.com/openapi.json`

Deployment baseline:
- Neon Postgres
- Render API
- Vercel Web

## Product Preview

Visual product preview is prepared but intentionally not fabricated.

Current status:
- live public staging exists
- screenshot structure exists under `docs/assets/screenshots/`
- GitHub polish guidance exists in [docs/project/github-polish-checklist.md](./docs/project/github-polish-checklist.md)
- real screenshots still need to be captured manually from the live staging environment

Until those captures exist, this README keeps text-first evidence instead of fake image placeholders.

## Product Problem

The product problem is not "build every ISP feature at once." The real problem is to create a coherent operational baseline that can support:
- authenticated access
- customer and payment handling
- operational visibility across alerts, finance, reports, regions, and routes
- a deployment and documentation trail that can be reviewed technically

This MVP deliberately solves the first credible layer of that problem instead of pretending to be production-complete.

## MVP Scope

Included in the current public MVP:
- login and authenticated access
- dashboard overview
- customers list and create
- payments list and create
- alerts overview
- finance overview
- reports overview
- regions overview
- routes overview
- API health and authenticated user retrieval

Explicitly out of scope for the public MVP:
- customer detail and edit
- payment reconciliation
- full alert lifecycle actions
- advanced fiscal settings
- report drilldowns
- route planning and field operations
- live maps
- advanced analytics
- enterprise hardening beyond the documented baseline

Full scope reference:
- [docs/product/mvp-scope.md](./docs/product/mvp-scope.md)

## Demo Flow

The current demo flow is intentionally simple and verifiable:

1. Open the public web staging URL.
2. Register a user through the staging auth flow.
3. Log in and reach the protected application shell.
4. Confirm authenticated API access through `GET /auth/me`.
5. Navigate the MVP surfaces: dashboard, customers, payments, alerts, finance, reports, regions, and routes.
6. Create a customer and return to the list.
7. Register a payment and return to the list.

This flow is aligned with the public staging validation already recorded in project operations docs.

## Demo Evidence

Documented evidence already available:
- live public web staging
- live API docs
- live API health endpoint
- authenticated smoke validation recorded in project operations docs
- versioned runbook for staging reproduction

Planned visual evidence:
- login or register screen
- authenticated dashboard
- one representative MVP business screen
- API docs screenshot

Capture guidance:
- use the real public staging environment
- do not simulate screenshots
- do not publish images with tokens, personal emails, passwords, or browser-private data visible

## Authentication Flow

The current auth baseline covers:
- user registration
- user login
- token-based authenticated API access
- protected access to the operational web shell

Validated public staging auth checks:
- `POST /auth/register`: PASS
- `POST /auth/login`: PASS
- `GET /auth/me`: PASS `200`

## Architecture

Monorepo structure:

```text
apps/
  api/   Fastify + Prisma + PostgreSQL
  web/   Next.js operational frontend
packages/
  config/
  types/
  utils/
docs/
  architecture/
  product/
  ops/
  rules/
```

Core stack:
- API: Fastify, Prisma 7, PostgreSQL, Zod, Vitest
- Web: Next.js 15, React 19, TypeScript, TanStack Query
- Tooling: pnpm, ESLint, TypeScript

## API / Web Split

The repository is intentionally split into two applications:
- `apps/api`: backend contracts, auth, persistence, validation, and runtime behavior
- `apps/web`: authenticated operational frontend that consumes the API

This separation matters because the project is not a frontend mock. The web exists on top of a real backend contract and a real database-backed runtime.

## Deployment Baseline

The current staging deployment follows this simple provider chain:
- Neon Postgres for the managed staging database
- Render for the public API service
- Vercel for the public web application

Operational notes:
- application runtime uses Neon pooled `DATABASE_URL`
- Prisma CLI and migrations use Neon direct `DIRECT_URL` through `apps/api/prisma.config.ts`
- real secrets stay outside the repository

Related references:
- [docs/ops/staging-runbook.md](./docs/ops/staging-runbook.md)
- [docs/ops/fc-023-staging-baseline.md](./docs/ops/fc-023-staging-baseline.md)

## Operational Discipline

Fiber Control is governed by Protocolo Rick. In practice, that means:
- tasks move through explicit backlog states
- `DONE` requires evidence, not intention
- staging validation is recorded instead of assumed
- documentation is treated as part of delivery
- secrets are not committed

Project discipline visible in the repository:
- evidence-based `DONE`
- public staging validation
- smoke-tested auth flow
- versioned runbook for staging reproducibility
- tracked execution log and session handoff

## Smoke Validation

The current public staging baseline has already passed:
- `GET /health`
- `/docs`
- `/openapi.json`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Related evidence:
- [docs/ops/done/FC-025A.done.md](./docs/ops/done/FC-025A.done.md)
- [docs/ops/staging-runbook.md](./docs/ops/staging-runbook.md)
- [docs/ops/execution-log.md](./docs/ops/execution-log.md)
- [docs/project/github-polish-checklist.md](./docs/project/github-polish-checklist.md)

## Technical Highlights

- TypeScript across API and web
- Fastify API with documented routes
- Prisma-backed PostgreSQL persistence
- Next.js operational frontend shell
- public staging deployed on Neon, Render, and Vercel
- controlled MVP scope instead of inflated claims
- runbook-backed operations and smoke validation

## Local Development

Recommended local URLs:
- web: `http://web.fiber-control.localhost:3000`
- api: `http://api.fiber-control.localhost:3001`

API:

```bash
pnpm -C apps/api install
pnpm -C apps/api prisma:generate
pnpm -C apps/api prisma:migrate:deploy
pnpm -C apps/api build
pnpm -C apps/api dev
```

Web:

```bash
pnpm -C apps/web install
pnpm -C apps/web build
pnpm -C apps/web dev
```

Useful checks:

```bash
pnpm -C apps/api lint
pnpm -C apps/api test
pnpm -C apps/web lint
```

## Current Limitations

The project is intentionally honest about what is not finished yet:
- `apps/web` still has no dedicated automated test suite
- some business modules remain overview-only by design
- customer detail/edit and deeper operational flows are still outside the MVP
- provider-specific manifests are still limited
- this is staging, not production

These are controlled limitations, not hidden gaps.

## Roadmap / Next Steps

Near-term follow-up should remain disciplined:
- tighten the public README and presentation layer
- continue selective hardening of the deployed MVP
- add dedicated automated coverage for `apps/web`
- reopen intentionally excluded flows only through explicit `READY` tasks
- keep post-MVP production growth isolated from the current MVP baseline

## Documentation Map

- Product and rules:
  - [docs/product/prd.md](./docs/product/prd.md)
  - [docs/product/business-rules.md](./docs/product/business-rules.md)
  - [docs/domain-model.md](./docs/domain-model.md)
- Architecture:
  - [docs/architecture/api-standards.md](./docs/architecture/api-standards.md)
  - [docs/architecture/backend-architecture.md](./docs/architecture/backend-architecture.md)
  - [docs/architecture/frontend-architecture.md](./docs/architecture/frontend-architecture.md)
- Operations:
  - [docs/ops/execution-log.md](./docs/ops/execution-log.md)
  - [docs/ops/session-handoff.md](./docs/ops/session-handoff.md)
  - [docs/ops/staging-runbook.md](./docs/ops/staging-runbook.md)

## Portfolio Positioning

Fiber Control should be read as:
- a serious MVP, not a fake demo
- a project with real backend behavior and public staging
- evidence of technical judgment, documentation discipline, and delivery rigor

It should not be read as:
- a finished production SaaS
- a fully hardened enterprise platform
- a project claiming maturity that is not supported by repository evidence

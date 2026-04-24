# Fiber Control

Fiber Control is a portfolio-grade MVP for ISP operational and financial management.

This repository is intentionally scoped to demonstrate engineering judgment, documented architecture, real backend contracts, authentication, persistence, and an operational frontend shell without pretending to be a full enterprise platform.

## Current Status

- public MVP scope defined and bounded
- local MVP validation completed
- staging baseline documented and operationally validated
- public project narrative prepared for GitHub and recruiter review
- next work after this repository state is post-MVP growth, not scope inflation inside the MVP

Operational source of truth:
- [STATUS.md](./STATUS.md)
- [backlog.md](./backlog.md)
- [MVP scope](./docs/product/mvp-scope.md)
- [Recruiter evidence pack](./docs/project/recruiter-evidence-pack.md)

## What This Project Demonstrates

- Fastify API with documented route structure
- Prisma 7 persistence on PostgreSQL
- working authentication flow with protected access
- audit baseline already implemented in the backend
- operational web shell built with Next.js
- disciplined governance through Protocolo Rick
- explicit MVP boundaries and controlled roadmap after MVP

## Public MVP Scope

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
- enterprise hardening beyond the current baseline

Full scope reference:
- [docs/product/mvp-scope.md](./docs/product/mvp-scope.md)

## Architecture Snapshot

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
- API: Fastify, Prisma, PostgreSQL, Zod, Vitest
- Web: Next.js 15, React 19, TypeScript, TanStack Query
- Tooling: pnpm, ESLint, TypeScript

## Operational Flows Covered

The repository currently supports these minimum demonstrable flows:

1. Sign in with a valid user and reach the protected application shell.
2. Navigate across dashboard, customers, payments, alerts, finance, reports, regions, and routes.
3. Create a customer and return to the list.
4. Register a payment and return to the list.
5. Validate API runtime through `/health` and authenticated user retrieval through `/auth/me`.

Validation evidence is documented in:
- [docs/quality/fc-022-local-validation.md](./docs/quality/fc-022-local-validation.md)
- [docs/ops/done/FC-023.done.md](./docs/ops/done/FC-023.done.md)

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

## Database and Environment Notes

- Prisma 7 CLI and migrations use `DIRECT_URL` through `apps/api/prisma.config.ts`
- application runtime uses `DATABASE_URL`
- staging baseline uses Neon pooled `DATABASE_URL` for runtime and Neon direct `DIRECT_URL` for Prisma operations
- real secrets are not committed to the repository

See:
- [apps/api/.env.example](./apps/api/.env.example)
- [docs/ops/fc-023-staging-baseline.md](./docs/ops/fc-023-staging-baseline.md)

## Validation Baseline

The most recent documented baseline includes:
- Node `v24.15.0`
- `pnpm.cmd install`: PASS
- `pnpm.cmd prisma generate`: PASS
- `pnpm.cmd prisma migrate deploy`: PASS
- `pnpm.cmd build`: PASS
- `docker compose up -d`: PASS
- `pnpm.cmd test`: PASS

This baseline closed the staging preparation task without claiming that a public staging deployment is already live.

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
  - [docs/ops/fc-023-staging-baseline.md](./docs/ops/fc-023-staging-baseline.md)

## Roadmap

Near-term follow-up is deliberately controlled:
- post-MVP publication hardening when needed
- controlled provider manifests and deployment execution
- dedicated automated test suite for `apps/web`
- selective reopening of modules that are intentionally out of scope today
- production growth backlog only after MVP communication and deployment work stay coherent

## Portfolio Positioning

Fiber Control should be read as:
- a serious MVP, not a fake demo
- a repository that values scope discipline over feature inflation
- evidence of backend, persistence, auth, operational UX, validation, and project governance

It should not be read as:
- a finished production SaaS
- a fully hardened enterprise system
- a project claiming live production maturity that is not documented here

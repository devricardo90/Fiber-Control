# Fiber Control - Recruiter Evidence Pack

## Project Summary

Fiber Control is a portfolio-grade MVP for ISP operational and financial workflows.

The project emphasizes bounded scope, real backend behavior, documented architecture, and operational clarity over feature inflation.

## What A Reviewer Can Verify Quickly

### Engineering signals
- monorepo with separated API and web applications
- documented product, architecture, rules, and operational history
- Prisma-backed PostgreSQL persistence
- authenticated API and protected frontend shell
- explicit validation history recorded under `docs/ops` and `docs/quality`

### Delivery signals
- MVP scope is explicitly bounded in [docs/product/mvp-scope.md](./../product/mvp-scope.md)
- local MVP validation was formally executed in [docs/quality/fc-022-local-validation.md](./../quality/fc-022-local-validation.md)
- staging preparation was formally closed in [docs/ops/done/FC-023.done.md](./../ops/done/FC-023.done.md)
- public staging is live on Vercel and Render, with reproducibility documented in [docs/ops/staging-runbook.md](./../ops/staging-runbook.md)
- governance and operational decision trail are preserved in [docs/ops/execution-log.md](./../ops/execution-log.md) and [docs/ops/decisions.md](./../ops/decisions.md)

### Public links
- Web staging: `https://app-fiber-control-web-staging.vercel.app`
- API docs: `https://app-fiber-control-api-staging.onrender.com/docs`
- API health: `https://app-fiber-control-api-staging.onrender.com/health`

## MVP Features Included

- login and authenticated access
- dashboard overview
- customers list and create
- payments list and create
- alerts overview
- finance overview
- reports overview
- regions overview
- routes overview
- health and auth runtime evidence

## Deliberate Scope Exclusions

These exclusions are intentional and documented, not accidental gaps:
- customer detail and edit
- payment reconciliation
- full alert lifecycle
- advanced finance and fiscal flows
- report drilldowns
- route planning, live maps, and field operations
- enterprise hardening claims beyond the documented baseline

## Technical Snapshot

- API: Fastify, Prisma 7, PostgreSQL, Zod, Vitest
- Web: Next.js 15, React 19, TypeScript
- Runtime baseline closed on Node `v24.15.0`
- staging database contract uses Neon pooled `DATABASE_URL` for runtime and direct `DIRECT_URL` for Prisma CLI/migrations

## Validation Snapshot

Documented passing baseline:
- `pnpm.cmd install`
- `pnpm.cmd prisma generate`
- `pnpm.cmd prisma migrate deploy`
- `pnpm.cmd build`
- `docker compose up -d`
- `pnpm.cmd test`

Related evidence:
- [docs/quality/fc-022-local-validation.md](./../quality/fc-022-local-validation.md)
- [docs/ops/fc-023-staging-baseline.md](./../ops/fc-023-staging-baseline.md)
- [docs/ops/done/FC-023.done.md](./../ops/done/FC-023.done.md)
- [docs/ops/done/FC-025A.done.md](./../ops/done/FC-025A.done.md)
- [docs/ops/staging-runbook.md](./../ops/staging-runbook.md)

## Why This Repository Matters

This repository demonstrates:
- disciplined scoping
- backend-first delivery order
- real persistence and auth instead of mock-only UI
- explicit validation and closure criteria
- operational governance strong enough to support auditability of engineering work

## Recommended Reading Order

1. [README.md](./../../README.md)
2. [docs/product/mvp-scope.md](./../product/mvp-scope.md)
3. [docs/architecture/backend-architecture.md](./../architecture/backend-architecture.md)
4. [docs/quality/fc-022-local-validation.md](./../quality/fc-022-local-validation.md)
5. [docs/ops/done/FC-023.done.md](./../ops/done/FC-023.done.md)

## Honest Positioning

Fiber Control is ready to be evaluated as:
- a serious MVP engineering case study
- evidence of software delivery process and technical judgment
- a repository that is explicit about what is done, what is validated, and what is intentionally still outside scope

Fiber Control is not presented as:
- a live production business
- a fully deployed public SaaS
- a finished enterprise platform

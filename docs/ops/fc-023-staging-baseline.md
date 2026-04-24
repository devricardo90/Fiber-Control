# FC-023 - Staging Baseline Contract

## Objective
Define the minimum staging contract for the current Fiber Control MVP without executing deployment yet.

This document exists to remove ambiguity before the real publication step of `FC-023`.

## Current Local Baseline
- local web validated at `http://web.fiber-control.localhost:3000`
- local API validated at `http://api.fiber-control.localhost:3001`
- local development database remains isolated at `127.0.0.1:5440`
- official test database remains isolated at `127.0.0.1:5442`
- `FC-022` already proved local MVP readiness with API and web builds in PASS, API test suite in PASS, seed login preserved, CORS coherent and MVP routes responding
- no staging deploy has started yet

## Proposed Staging Topology
- web staging target: Vercel
- API staging target: Render Web Service
- database staging target: Render managed PostgreSQL

Topology rules:
- web and API must be published as separate services
- staging database must be dedicated and must not reuse local dev or test databases
- provider-generated HTTPS URLs are sufficient for this phase; no custom domain is required

## Runtime Decision
- target runtime for API staging: Node `24.x`
- target runtime for web staging: Node `24.x`
- database runtime: managed PostgreSQL supplied by the API provider ecosystem

Decision rationale:
- `apps/api/package.json` explicitly declares Node `24.x`
- keeping both Node services on `24.x` reduces operational drift in staging
- the project accepts the current risk that local validation was consolidated on Node `v22.21.1`, but staging must prefer the declared runtime instead of the locally validated fallback

## Database Baseline
- one dedicated managed PostgreSQL instance for staging
- schema must be created only through official Prisma migrations
- staging must use its own `DATABASE_URL`
- staging must never point to:
  - local dev database `127.0.0.1:5440`
  - local test database `127.0.0.1:5442`
- controlled seed data is allowed only if explicitly prepared for staging demonstration
- staging seed credentials must be specific to staging and must not blindly reuse the local baseline

## API Environment Variables
Required:
- `NODE_ENV=production`
- `PORT`
- `HOST`
- `APP_NAME`
- `APP_URL`
- `CORS_ORIGIN`
- `DATABASE_URL`
- `AUTH_SECRET`

Expected staging meaning:
- `APP_URL`: public Render URL of the API service
- `CORS_ORIGIN`: public Vercel URL of the web service
- `DATABASE_URL`: managed PostgreSQL connection string for staging

## Web Environment Variables
Required:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

Expected staging meaning:
- `NEXT_PUBLIC_APP_URL`: public Vercel URL of the web service
- `NEXT_PUBLIC_API_URL`: public Render URL of the API service

## Secrets and Non-Secrets
Secret variables:
- `DATABASE_URL`
- `AUTH_SECRET`

Non-secret variables:
- `NODE_ENV`
- `PORT`
- `HOST`
- `APP_NAME`
- `APP_URL`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

Rule:
- secret values must live only in provider secret management
- non-secret values may be documented in runbooks and provider config notes when useful

## Build Commands
API:
- `pnpm.cmd -C apps/api build`

Web:
- `pnpm.cmd -C apps/web build`

Validation commands expected before or during publication:
- `pnpm.cmd -C apps/api prisma:migrate:deploy`

## Start Commands
API:
- `pnpm.cmd -C apps/api start`

Web:
- `pnpm.cmd -C apps/web start`

Operational note:
- actual provider start configuration may wrap these commands, but the staging publication must remain compatible with them

## Post-Publication Smoke Checklist

### API
- `GET /health`
- `GET /readiness` only if such endpoint is introduced later; it does not exist in the current baseline
- `POST /auth/login` with a controlled staging seed user
- `GET /auth/me` with a valid token
- CORS preflight using the real public web origin
- minimum authenticated smoke for:
  - `customers`
  - `payments`
  - `alerts`
  - `finance`
  - `reports`
  - `regions`

### Web
- open the public staging URL
- confirm the initial page loads without runtime error
- confirm the login flow reaches authenticated state, if staging seed credentials are available
- confirm the MVP pages are reachable after login:
  - `/dashboard`
  - `/customers`
  - `/customers/new`
  - `/payments`
  - `/payments/new`
  - `/alerts`
  - `/finance`
  - `/reports`
  - `/regions`
  - `/routes`

### Database
- confirm official migrations were applied
- confirm controlled minimum seed exists, if staging credentials are part of the deploy plan

## Known Risks
- `apps/api` declares Node `24.x`, but the local baseline consolidated by `FC-022` was validated on Node `v22.21.1`
- `apps/web` still has no dedicated automated test suite; staging validation remains dependent on `lint`, `build` and manual smoke
- the repository still does not contain provider-specific manifests for Vercel or Render; the next step must configure publication without introducing architecture outside the MVP scope
- staging seed strategy is not fully closed yet; controlled demo credentials still need explicit preparation before real publication

## Out of Scope
- executing deployment in this slice
- creating external provider resources in this slice
- custom domain
- enterprise hardening
- functional product changes in `apps/web/src/*`
- business rule changes in `apps/api/src/*`
- any work belonging to `FC-024`

## Decision
- `FC-023` remains in progress at the project level
- `FC-023A` is complete as a documented baseline contract
- the chosen simple portfolio baseline is:
  - web on Vercel
  - API on Render
  - database on Render managed PostgreSQL
- the next action is a controlled staging deployment following this contract, with no scope expansion

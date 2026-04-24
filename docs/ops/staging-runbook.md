# Staging Runbook - Fiber Control

## Purpose
This runbook documents how to recreate, operate, redeploy and validate the current Fiber Control staging environment without relying on tacit memory.

It is intentionally limited to operational/documental guidance. It does not store real credentials, does not change providers and does not redefine the current staging architecture.

## Current Staging Architecture
- database: Neon Postgres
- API: Render Web Service
- web: Vercel project

Current baseline:
- Neon is the official staging database
- Render PostgreSQL is not used
- API and web are deployed as separate public services

## Public URLs
- API: `https://app-fiber-control-api-staging.onrender.com`
- Web: `https://app-fiber-control-web-staging.vercel.app`

## Official Recreation Order
Recreate or recover staging in this exact order:
1. prepare Neon Postgres
2. configure or redeploy Render API
3. configure or redeploy Vercel Web
4. execute the official smoke checklist

Rule:
- do not invert the order unless the architecture changes officially in versioned docs

## Neon

### Role in Staging
Neon is the official managed PostgreSQL provider for staging.

Its role is:
- host the dedicated staging database
- keep staging isolated from local development and local test databases
- provide one pooled connection for runtime
- provide one direct connection for Prisma CLI and migrations

### `DATABASE_URL` vs `DIRECT_URL`
- `DATABASE_URL`: pooled Neon connection string for application runtime
- `DIRECT_URL`: direct Neon connection string for Prisma CLI and migrations

Rule:
- runtime must use `DATABASE_URL`
- Prisma CLI must use `DIRECT_URL` through [`apps/api/prisma.config.ts`](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma.config.ts)

### Secrets Rule
- never commit real Neon credentials
- never paste real connection strings into versioned docs
- keep real values only in provider secret management

### Safe Placeholders
- `DATABASE_URL="postgresql://USER:PASSWORD@HOST-POOLER/neondb?sslmode=require&channel_binding=require"`
- `DIRECT_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"`

## Render API

### Service
- service name: `app-fiber-control-api-staging`
- provider type: Render Web Service

### Repository Settings
- root directory: `apps/api`
- build command: `pnpm.cmd build`
- start command: `pnpm.cmd start`
- health check path: `/health`

Operational note:
- if Render is configured from repository root instead of `apps/api`, the service may fail because it will not resolve the correct `package.json`

### Required Environment Variables
Document only by name:
- `NODE_ENV`
- `PORT`
- `HOST`
- `APP_NAME`
- `APP_URL`
- `CORS_ORIGIN`
- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`

Expected staging meaning:
- `APP_URL`: public API URL on Render
- `CORS_ORIGIN`: public web URL on Vercel
- `DATABASE_URL`: Neon pooled runtime connection
- `DIRECT_URL`: Neon direct Prisma connection

### Render Operational Notes
- Render free instance may sleep after inactivity
- first request after sleep can be slower than usual
- `/health` is the official health check path for the current baseline
- `/readiness` does not exist in the current baseline
- `/api/health` does not exist in the current baseline
- `/` returning `404` on the API root is expected in the current baseline

### Render Redeploy Flow
1. confirm the service still points to the correct repository and root directory `apps/api`
2. confirm the env var names exist in Render and that no real value will be copied into versioned files
3. confirm `APP_URL` matches the public Render URL
4. confirm `CORS_ORIGIN` matches the public Vercel URL
5. trigger redeploy from the current branch/commit intended for staging
6. wait for the service to become healthy on `/health`
7. run the official API smoke before touching the web

## Vercel Web

### Project
- project name: `app-fiber-control-web-staging`
- root directory: `apps/web`
- framework preset: `Next.js`
- public URL: `https://app-fiber-control-web-staging.vercel.app`

### Required Public Environment Variables
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

Expected staging meaning:
- `NEXT_PUBLIC_APP_URL`: public Vercel web URL
- `NEXT_PUBLIC_API_URL`: public Render API URL

### Vercel Operational Notes
- Output Directory must remain empty/default for this Next.js app
- do not force Output Directory to `public`
- using `public` as Output Directory can break the deployment because this project is not a static export app

### Vercel Redeploy Flow
1. confirm the project still points to root directory `apps/web`
2. confirm the framework preset remains `Next.js`
3. confirm `NEXT_PUBLIC_APP_URL` matches the public Vercel URL
4. confirm `NEXT_PUBLIC_API_URL` matches the public Render API URL
5. confirm Output Directory is empty/default
6. trigger redeploy from the intended branch/commit
7. open the public web URL and validate the web smoke after the deploy finishes

## Smoke Checklist

### API
1. `GET /health`
Expected: `200`

2. `/docs`
Expected: Swagger UI opens correctly

3. `/openapi.json`
Expected: OpenAPI document is served correctly

4. `POST /auth/register`
Expected: registration flow works in staging

5. `POST /auth/login`
Expected: login returns a valid token

6. `GET /auth/me`
Expected: `200` with a valid Bearer token

### Web
1. open the public Vercel URL
2. confirm the app loads without runtime failure
3. confirm the web points to the real Render API URL

## Operational Guardrails
- never record real `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, tokens or passwords in versioned files
- never paste auth tokens in screenshots without redaction
- treat provider dashboard settings as external operations, not repository data
- if a provider setting changes the official baseline, update this runbook and the related ops docs before closing the task that introduced the change

## Troubleshooting

### Swagger Bearer Token
- paste the Bearer token without quotes in Swagger
- quoted tokens can cause false negatives in `/auth/me`

### Missing Endpoints
- `/readiness` does not exist currently
- `/api/health` does not exist currently
- do not classify these as outages unless the contract changes officially

### Root `404`
- API root `/` returning `404` is expected in the current baseline
- this is not the same as API downtime

### Vercel Output Directory Error
- if Vercel Output Directory is set to `public`, clear it and use the default Next.js behavior

### Render Root Directory Error
- if Render cannot find the correct `package.json`, confirm the service root directory is `apps/api`
- if commands are executed from the wrong root, build/start can fail even when the repo is healthy

### `404` vs `500`
- `404` on a non-existent route means route mismatch or unsupported endpoint
- `500` indicates a real server-side failure and must be investigated as an application/runtime issue

### Token Exposure
- do not expose auth tokens in screenshots, chat logs or versioned docs
- redact any visible token before sharing evidence

## Healthy Staging Criteria
Staging is considered healthy only when all of the following are true:
- API is live on Render
- web is ready on Vercel
- auth smoke passed
- `CORS_ORIGIN` points to the real public web URL
- no real secret is versioned in the repository

## Safe Reference Values
Non-secret public values for the current baseline:
- API URL: `https://app-fiber-control-api-staging.onrender.com`
- Web URL: `https://app-fiber-control-web-staging.vercel.app`
- Render API root directory: `apps/api`
- Vercel web root directory: `apps/web`

Secret values must remain outside the repository:
- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`

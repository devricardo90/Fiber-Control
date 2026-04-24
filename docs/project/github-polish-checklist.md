# GitHub Portfolio Polish Checklist

## Purpose

This checklist exists to make the public Fiber Control repository more visually credible on GitHub and in portfolio reviews without inventing evidence that does not exist yet.

The repository already has:
- a public README in English
- live staging links
- public API docs and health endpoints
- a versioned staging runbook

What is still missing is a disciplined visual layer: screenshots, preview ordering, GitHub profile polish, and a safe capture process.

## Public Links To Reuse

- Web staging: `https://app-fiber-control-web-staging.vercel.app`
- API docs: `https://app-fiber-control-api-staging.onrender.com/docs`
- API health: `https://app-fiber-control-api-staging.onrender.com/health`
- OpenAPI JSON: `https://app-fiber-control-api-staging.onrender.com/openapi.json`

## Repository Description

Suggested short repository description:

`Portfolio-grade ISP operations MVP with Fastify, Next.js, Prisma, Neon, Render, and Vercel.`

## Suggested Topics

Suggested GitHub topics:
- `typescript`
- `nextjs`
- `fastify`
- `prisma`
- `postgresql`
- `neon`
- `render`
- `vercel`
- `monorepo`
- `portfolio-project`
- `mvp`
- `api`

## Social Preview Image

Suggested social preview direction:
- one clean composite image
- project name `Fiber Control`
- short subtitle such as `Portfolio-grade ISP operations MVP`
- subtle product screenshot collage or one strong dashboard screenshot
- no fake metrics or fake customer data

Status:
- not created yet
- requires manual capture/design work outside the repository

## Screenshot Capture Order

Capture images in this order:

1. Public web entry or authenticated landing state
2. Login or register screen
3. Authenticated dashboard
4. Main MVP operational screen such as customers or payments
5. API docs screen as technical evidence

## Required Screenshots

### Screenshot 01 - Web entry / first meaningful page
- target: public web staging
- purpose: show the project is live and reachable
- suggested filename: `01-web-entry.png`

### Screenshot 02 - Login or register
- target: auth flow
- purpose: show the project has real authentication, not a static shell
- suggested filename: `02-auth-login-or-register.png`

### Screenshot 03 - Dashboard / authenticated area
- target: authenticated shell
- purpose: show the user reaches the real product surface after auth
- suggested filename: `03-dashboard.png`

### Screenshot 04 - Main MVP business surface
- target: one representative operational screen such as customers or payments
- purpose: show business workflow instead of only shell navigation
- suggested filename: `04-main-mvp-screen.png`

### Screenshot 05 - API docs
- target: public Swagger / API docs
- purpose: show technical evidence and backend contract visibility
- suggested filename: `05-api-docs.png`

## Recommended README Order

When real screenshots exist, present them in this order:

1. Product Preview
2. Live Demo
3. Screenshots
4. Demo Evidence

Suggested screenshot display order inside the README:
- dashboard or authenticated shell first
- business screen second
- auth screen third
- API docs fourth

## Placeholder Policy

If screenshots are not available yet:
- do not generate fake screenshots
- do not use mocked product images pretending to be real staging
- keep placeholder text in the README
- keep this checklist versioned
- capture the real images manually in the browser later

## Manual Capture Checklist

- use the real public staging URLs
- confirm the page fully loaded before capture
- prefer desktop screenshots with consistent browser chrome or no chrome at all
- crop only for clarity, not to hide problems
- use consistent aspect ratio across the set when possible
- save files under `docs/assets/screenshots/`

## Sensitive Data Safety

Before saving or publishing any screenshot:
- do not expose tokens
- do not expose Bearer headers
- do not expose real email addresses that should remain private
- do not expose passwords
- do not expose database URLs
- do not expose `DIRECT_URL`, `DATABASE_URL`, or `AUTH_SECRET`
- do not expose browser autofill data
- do not expose personal bookmarks, extensions, or OS notifications

If sensitive data appears:
- redact it before publication
- prefer retaking the screenshot over editing sensitive areas heavily

## Demo Evidence Recommendations

Recommended visual evidence set:
- live web screenshot
- auth screen screenshot
- authenticated dashboard screenshot
- one core MVP flow screenshot
- API docs screenshot
- optional screenshot of `/health` response only if it adds value without clutter

## Repository Polish Checklist

- repository description updated
- topics added
- social preview image prepared
- screenshots captured and stored under `docs/assets/screenshots/`
- README visual section updated with real image links
- recruiter evidence pack linked to the screenshot checklist
- public links verified again before publishing

## Current Status

Current status of this checklist:
- checklist created
- screenshot structure created
- real screenshots not committed yet
- manual browser capture still required

# MVP Scope - Fiber Control

## Purpose
This document defines the public MVP scope for Fiber Control.

The current objective is not to build a full enterprise platform.
The objective is to deliver a minimum, functional, deployable and demonstrable version that can be published on GitHub as professional portfolio evidence.

## MVP Positioning
- portfolio-grade project
- minimum deployable slice
- real backend and persistence
- real authentication
- operational frontend navigation
- serious documentation and governance
- controlled roadmap after MVP

## What Is In The Public MVP

### Core platform
- authenticated access with working login flow
- backend foundation with documented contracts
- PostgreSQL + Prisma persistence
- baseline audit trail already implemented
- named localhost development baseline documented
- API health endpoint already documented and validated

### Public MVP surfaces
- dashboard overview
- customers list
- customers create
- payments list
- payments create
- alerts overview
- finance overview
- reports overview
- regions overview
- routes overview

### Operational value expected in MVP
- operator can sign in
- operator can access a navigable operational shell
- operator can review customer base
- operator can register a customer
- operator can review payments
- operator can register a payment
- operator can inspect alerts overview
- operator can inspect finance overview
- operator can inspect reports overview
- operator can inspect regional overview
- operator can inspect routes overview

## What Is Explicitly Out Of The Public MVP

### Neutralized or partial surfaces
- customer detail
- customer edit
- payment reconciliation
- full alert lifecycle actions
- advanced fiscal settings
- detailed finance reports
- report drilldowns
- route planning workflow
- field operations workflow
- live maps
- advanced analytics

### Infra or production ambitions outside MVP
- real production domain with custom DNS
- enterprise-grade observability stack
- full production hardening beyond minimum deploy readiness
- enterprise RBAC expansion beyond current baseline
- feature expansion not already stabilized in the current repository state

## Post-MVP Growth Backlog
- dedicated automated test suite for `apps/web`
- MVP deploy hardening and validation execution
- staging deployment baseline
- public GitHub README in English
- recruiter evidence pack
- controlled reopening of partially neutralized modules
- deeper operational modules such as reconciliation, alert lifecycle and customer detail/edit
- later production growth and hardening work

## Minimum Demo Flows

### Flow 1 - Authentication
- open the login screen
- authenticate with a valid user
- confirm access to the protected operational shell

### Flow 2 - Dashboard and operational navigation
- open dashboard overview
- navigate across the active operational modules
- confirm the shell remains coherent and usable

### Flow 3 - Customer operations
- open customer list
- create a customer
- return to the list and confirm the flow is operational

### Flow 4 - Payment operations
- open payment list
- register a payment
- return to the list and confirm the flow is operational

### Flow 5 - Read-only business overviews
- open alerts overview
- open finance overview
- open reports overview
- open regions overview
- open routes overview

### Flow 6 - Backend minimum runtime evidence
- confirm API health endpoint
- confirm authenticated user retrieval
- confirm core overview routes used by the active frontend surfaces

## Evidence Required Before FC-022

### Existing evidence already available from prior tasks
- login flow validated in local environment
- `GET /auth/me` validated in local environment
- `GET /health` validated in local environment
- backend integrated suite in green after persistence/auth stabilization
- web lint/build and api lint/build already validated in prior documented tasks
- active frontend surfaces reopened and documented module by module

### Evidence FC-022 must consolidate explicitly
- exact MVP route list to be exercised before deploy
- exact env vars required for web and api
- exact build and validation commands to run for deploy readiness
- exact auth and CORS checks that must pass
- exact minimum smoke checks for web and api
- whether any readiness endpoint exists beyond `/health`

## Risks To Register Before FC-022
- no dedicated automated test suite for `apps/web`
- several modules remain intentionally partial and must not leak into MVP claims
- `127.0.0.1:5440` is development baseline only and must not be treated as test environment
- deploy hardening evidence is not yet consolidated in one place
- readiness coverage beyond `GET /health` is not directly documented yet
- portfolio narrative can drift into enterprise scope if MVP boundaries are not respected

## MVP Messaging For GitHub And Recruiters
- this project demonstrates disciplined architecture and governance
- the backend is real and contract-based
- authentication, persistence and audit baseline exist
- the frontend is operational and navigable
- the MVP is intentionally scoped to show judgment, not feature inflation
- growth after MVP is planned and isolated instead of mixed into the first public release

## Decision Summary
- the public MVP is the minimum operational slice already stabilized in the repository
- partially neutralized or advanced modules remain outside the MVP
- FC-022 must harden deploy readiness only for this bounded MVP scope


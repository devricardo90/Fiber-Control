# Security Rules

## Purpose
This document defines the baseline security rules for Fiber Control.

The goal is to reduce avoidable risks early and ensure the project grows on a secure foundation.

Security is not a later phase. It is part of the implementation standard.

---

## 1. General Principles
- Validate all external input
- Never trust client-side data by default
- Fail safely and explicitly
- Avoid exposing sensitive information
- Prefer least privilege access
- Security must be considered in code, infra, logs, and docs

---

## 2. Input Validation
All external input must be validated.

This includes:
- request body
- route params
- query params
- headers when relevant
- environment variables at startup

Rules:
- reject invalid types
- reject malformed payloads
- reject missing required fields
- avoid silent coercion unless intentional and documented

---

## 3. Error Handling
The API must never expose raw internal errors to clients.

Do not expose:
- SQL errors
- Prisma internal errors
- stack traces
- internal file paths
- secrets or tokens

Public errors must be:
- explicit
- stable
- non-sensitive

Recommended public error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload"
  }
}
```

---

## 4. Logging Rules
- Log requests and failures
- Avoid logging passwords, tokens, full bank descriptions, or private customer data unnecessarily
- Keep logs useful for debugging without becoming noisy
- Sensitive values must be masked or omitted
- Logs must support investigation without becoming a data leak source

---

## 5. Secrets and Environment Rules
All configuration must come from environment variables or secure secret storage.

Never hardcode:
- database credentials
- API keys
- tokens
- session secrets
- private integration secrets

Critical variables must be validated at startup:
- app port
- database url
- app url
- CORS origin
- environment mode

The application must fail fast when critical configuration is invalid.

---

## 6. CORS and Exposure Rules
- Keep CORS restricted by environment
- Do not allow broad wildcard origins in production unless there is explicit justification
- Expose only intended public headers and methods
- Disable unnecessary public surface area

---

## 7. Database Safety
- PostgreSQL 17 is the official database
- Prisma 7 is the official ORM
- Use `@prisma/adapter-pg`
- Migrations are mandatory
- Never modify production schema manually outside the migration flow
- Apply least privilege to database users
- Keep naming predictable and auditable

---

## 8. Data Protection Rules
- Never log sensitive personal or financial data without explicit need
- Avoid exposing full customer-private data in generic responses
- Treat bank reconciliation data carefully
- Preserve auditability of business-critical records

---

## 9. Operational Security Direction
- Prepare for rate limiting in public or sensitive endpoints
- Prepare for authentication and authorization hardening
- Keep dependencies updated within project policy
- Review security-sensitive changes as part of normal implementation

---

## 10. Authentication and Authorization
Authentication will be added after the base modules are stable, but the project must already be structured with security in mind.

Rules:
- protected routes must require valid authentication
- access control must be explicit
- roles and permissions must not be inferred implicitly
- avoid mixing authentication logic into business services
- tokens, sessions, or credentials must never be logged

---

## 11. Secrets and Environment Variables
Secrets must never be hardcoded.

Examples:
- database credentials
- JWT secrets
- API keys
- third-party webhook secrets

Rules:
- secrets must come from environment variables
- `.env` must not be committed
- `.env.example` must contain only placeholders or safe sample values
- startup must fail if critical secrets are missing or invalid

---

## 12. Logging Rules
Logs are important, but must not leak sensitive data.

Never log:
- passwords
- tokens
- full authorization headers
- secret keys
- raw bank details when avoidable
- private customer information beyond what is necessary for debugging

Prefer logging:
- event type
- request id
- safe identifiers
- route name
- error category
- execution context

---

## 13. Database Security Rules
- use least privilege for database access when possible
- migrations are the only official schema change path
- avoid manual schema changes outside migration flow
- avoid destructive operations without explicit intention
- prepare for soft delete in business-critical domains when needed

---

## 14. API Security Rules
- all routes must validate input
- use correct HTTP methods
- reject unsupported methods
- do not expose debug-only endpoints in production
- rate limiting should be added when auth and public endpoints grow
- CORS must be explicitly configured, never open by default without reason

---

## 15. CORS Rules
CORS must be configured explicitly.

Rules:
- define allowed origins via env
- do not use unrestricted wildcard in production unless there is a very clear reason
- use credentials only when actually needed

---

## 16. Dependency Security
- prefer stable, maintained libraries
- avoid adding unnecessary dependencies
- update dependencies intentionally, not blindly
- review breaking changes before upgrades
- keep the stack small and predictable

---

## 17. File and Upload Safety
When file uploads are introduced:
- validate file type
- validate file size
- reject suspicious formats when not needed
- avoid trusting file extension only
- store files safely and predictably

---

## 18. Webhook Safety
When webhooks are introduced:
- verify origin and authenticity
- validate signature when available
- reject duplicated or malformed events
- never trust webhook payload without verification

---

## 19. Data Exposure Rules
Only expose the data necessary for the use case.

Rules:
- never return internal-only fields without reason
- never expose password hashes
- do not expose internal notes or technical metadata by default
- response payloads must be intentionally designed

---

## 20. Testing Security Expectations
Security-sensitive behavior should be covered by tests where relevant.

Examples:
- invalid input rejection
- unauthorized access rejection
- malformed payload rejection
- forbidden actions
- route protection

---

## 21. Local Development Security
Even in local development:
- do not commit secrets
- keep local setup predictable
- use safe sample data when possible
- avoid teaching the project bad habits that will leak into production

---

## 22. Future Hardening Checklist
To be implemented progressively:
- auth protection
- role-based access control
- rate limiting
- audit logs
- refresh token strategy
- secure cookies if applicable
- CSRF analysis if session-based auth is used
- helmet/security headers where appropriate
- brute-force protection on login

---

## 23. Definition of Security Baseline Done
A feature meets baseline security when:
- inputs are validated
- errors are safe
- secrets are not exposed
- logs are safe
- route behavior is explicit
- no critical shortcut was introduced

---

## 24. Future Security Scope
- authentication
- authorization
- audit trail for sensitive actions

# API Standards

## Response Principles
Responses should be:
- explicit
- consistent
- easy for frontend consumption

Example success shape:

```json
{
  "data": {}
}
```

Example error shape:

```json
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer not found"
  }
}
```

## Error Handling Rules
- Never leak raw database errors to clients
- Use explicit business error codes
- Use proper HTTP status codes
- Log internal errors safely
- Keep error messages useful but not sensitive

Suggested error categories:
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `INTERNAL_ERROR`

## Validation Rules
- Validate all external input
- Never trust request body by default
- Validate params, query, and body
- Coerce values carefully
- Reject invalid types early

## Logging Rules
- Log requests and failures
- Avoid logging passwords, tokens, full bank descriptions, or private customer data unnecessarily
- Logs must be useful for debugging, not noisy

## Environment Rules
All configuration must come from environment variables.

Must validate at startup:
- app port
- database url
- app url
- CORS origin
- environment mode

The app must fail fast if critical env vars are invalid.

## Database Rules
- PostgreSQL 17 is the official database
- Prisma 7 is the official ORM
- Use `@prisma/adapter-pg`
- Migrations are mandatory
- Never change production schema manually outside migration flow
- Naming must remain consistent and predictable

## Documentation Rules
When creating a route:
- document it through schema
- ensure it appears correctly in Swagger
- ensure the same OpenAPI contract is consumable in Scalar
- include request and response examples when helpful

Swagger and Scalar must always reflect current route contracts.

## Route Baseline
- REST API with Fastify
- versioning by prefix such as `/v1`
- `GET /health` is mandatory in the foundation
- Swagger must be available from the first backend milestone
- Scalar should be available as a companion API reference UI for contract inspection and testing

## Contract Rules
- Every route must define request and response schemas
- Status codes must be explicit
- Avoid exposing Prisma models directly through HTTP contracts
- DTOs should represent the public domain contract, not raw persistence shape

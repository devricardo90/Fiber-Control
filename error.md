# Error Log

Date: 2026-03-20

## 1. Vitest startup failed with `spawn EPERM`

Context:
- Command attempted inside the sandbox: `pnpm.cmd test -- auth.spec.ts`

Observed result:
- Vitest did not start correctly.
- `esbuild` failed during config startup with `Error: spawn EPERM`.

Notes:
- This was an execution-environment restriction, not an application failure.
- Running the test outside the sandbox removed this specific blocker.

## 2. Vitest auth suite fails because Prisma cannot use the database when `DATABASE_URL` uses `localhost`

Context:
- Command executed outside the sandbox: `pnpm.cmd exec vitest run src/tests/auth.spec.ts`

Observed result:
- The auth suite ran, but all 11 tests failed.
- Failure starts in test setup and teardown:
  - `src/tests/auth.spec.ts:17`
  - `src/tests/auth.spec.ts:24`
- Prisma throws `PrismaClientKnownRequestError` on `prisma.user.deleteMany()`.

Observed error shape:
- `Invalid prisma.user.deleteMany() invocation`

Follow-up validation:
- Command executed outside the sandbox: `pnpm.cmd exec prisma migrate status`
- Prisma returned:
  - `P1001: Can't reach database server at localhost:5440`

Direct connectivity check:
- A direct PostgreSQL connection using the `pg` driver succeeded against:
  - `postgresql://postgres:postgres@localhost:5440/fiber_control`

Root-cause confirmation:
- Command executed outside the sandbox with env override:
  - `$env:DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5440/fiber_control'; pnpm.cmd exec prisma migrate status`
- Result:
  - database reachable
  - schema up to date
- Command executed outside the sandbox with the same override:
  - `$env:DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5440/fiber_control'; pnpm.cmd exec vitest run src/tests/auth.spec.ts`
- Result:
  - `11/11` tests passed

Root cause:
- On this Windows environment, Prisma fails against `localhost:5440` but works against `127.0.0.1:5440`.
- The issue is not that PostgreSQL is offline; it is a connection-resolution mismatch affecting Prisma.

Impact:
- Auth tests fail before hitting route logic when `DATABASE_URL` uses `localhost`.
- Other suites that depend on Prisma cleanup can fail for the same reason.
- Login in the running app can fail if the API process also uses the `localhost` variant in this environment.

## 3. Incorrect Vitest CLI usage ran more than the intended suite

Context:
- Command used: `pnpm.cmd test -- auth.spec.ts`

Observed result:
- `pnpm` passed arguments as `vitest run "--" "auth.spec.ts"`.
- Vitest still discovered and executed multiple suites.

Preferred command:
- `pnpm.cmd exec vitest run src/tests/auth.spec.ts`

## 4. Frontend error parsing hid the real login failure

Context:
- The frontend expected API errors at the top level.
- The API returns errors in the shape:
  - `{ "error": { "code": "...", "message": "..." } }`

Observed result:
- Login failures could show a generic `Request failed` instead of the backend message.

Status:
- Fixed in `apps/web/src/lib/api.ts`.

## 5. Wrong admin email appeared in the UI

Context:
- The settings page displayed `admin@fibercontrol.com`.
- The seeded admin user is `admin@fibercontrol.local`.

Observed result:
- This could mislead manual login attempts with the wrong email.

Status:
- Fixed in `apps/web/src/app/(app)/settings/page.tsx`.

## 6. Patch application had context mismatch due to file content/encoding divergence

Context:
- A patch against the settings file failed while updating the admin email.

Observed result:
- The patch did not match the expected text exactly.
- The file contained text/encoding differences, so the file had to be re-read with exact context before patching again.

Impact:
- Not a runtime bug.
- This is a maintenance/editing issue that can slow down automated changes.

## 7. API dev startup failed because `pino-pretty` was configured but not resolvable

Context:
- Command used: `pnpm dev` in `apps/api`

Observed result:
- API startup failed with:
  - `Error: unable to determine transport target for "pino-pretty"`

Root cause:
- The Fastify logger configuration enabled the `pino-pretty` transport in development.
- The package was not resolvable in the runtime environment.

Fix applied:
- `apps/api/src/app.ts` now checks whether `pino-pretty` can be resolved before adding that transport.
- If it is unavailable, the API falls back to file logging without crashing at startup.

## Correct login credentials

Seeded admin credentials:
- Email: `admin@fibercontrol.local`
- Password: `Admin@123456`

Important:
- These credentials only work if the API database is running and the seed has been applied successfully.
- With the environment fix, prefer `127.0.0.1` in `DATABASE_URL`.

# FC-022 - MVP Local Validation and Deploy Readiness

## Data
2026-04-24

## Contexto desta reexecucao
- a execucao original da `FC-022` terminou em `BLOCKED` porque `pnpm.cmd test` em `apps/api` usava o banco errado, limpava o baseline de desenvolvimento e derrubava o login seed local
- a `FC-026` corrigiu esse bloqueio ao carregar `.env.test` em `vitest.config.ts`, tornar `payments.spec.ts` e `fiscal-reminders.spec.ts` deterministicas e restaurar a seed do banco dev
- esta reexecucao valida novamente a prontidao local do MVP sobre o baseline corrigido, sem iniciar deploy e sem abrir novo escopo de produto

## Escopo validado
- revisao do recorte MVP definido em `docs/product/mvp-scope.md`
- revisao de `backlog.md`, `STATUS.md`, `docs/ops/session-handoff.md`, `docs/ops/decisions.md` e `docs/ops/execution-log.md`
- confirmacao dos scripts oficiais em `apps/api/package.json` e `apps/web/package.json`
- gates tecnicos locais de API e web
- verificacao explicita de isolamento entre:
  - dev database: `127.0.0.1:5440`
  - test database: `127.0.0.1:5442`
- smoke manual local de auth, CORS e superficies minimas do MVP
- verificacao do estado real do banco/local env apos a suite da API

## Comandos executados

### Inspecao inicial
- `node -v`
- `Get-Content apps/api/package.json`
- `Get-Content apps/web/package.json`
- `Get-Content apps/web/.env.local`
- `Get-Content apps/api/.env`

### API
- `pnpm.cmd prisma:generate`
- `pnpm.cmd lint`
- `pnpm.cmd build`
- `pnpm.cmd prisma:migrate:deploy` com variaveis carregadas de `.env.test`
- `pnpm.cmd test` com variaveis carregadas de `.env.test`
- consulta direta ao banco de desenvolvimento apos a suite da API

### Web
- `pnpm.cmd lint`
- `pnpm.cmd build`

### Runtime manual
- boot local da API com `node dist/server.js`
- boot local da web com `node node_modules/next/dist/bin/next start --hostname web.fiber-control.localhost --port 3000`
- `GET http://api.fiber-control.localhost:3001/health`
- `POST /auth/login`
- `GET /auth/me`
- preflight `OPTIONS /auth/me` com `Origin: http://web.fiber-control.localhost:3000`
- smoke das rotas web do MVP em `http://web.fiber-control.localhost:3000`
- smoke dos endpoints de `customers`, `payments`, `alerts`, `finance`, `reports` e `regions`

## Resultado dos gates tecnicos

### API
- `pnpm.cmd prisma:generate`: PASS com warning de engine; `apps/api/package.json` continua exigindo Node `24.x`, enquanto o ambiente validado segue em `v22.21.1`
- `pnpm.cmd lint`: PASS
- `pnpm.cmd build`: PASS
- `pnpm.cmd prisma:migrate:deploy` no banco de teste `127.0.0.1:5442`: PASS
- `pnpm.cmd test` no banco de teste `127.0.0.1:5442`: PASS com `13` arquivos e `71` testes verdes

### Evidencia de isolamento de banco
- o `dotenv` do `vitest` carregou `.env.test` explicitamente durante `pnpm.cmd test`
- a migration da suite apontou para `fiber_control_test` em `127.0.0.1:5442`
- consulta direta ao banco de desenvolvimento apos a suite:
  - `users = 4`
  - `customers = 4`
  - `payments = 5`
  - `regions = 3`
  - `acesso@fibercontrol.local` permaneceu presente
- conclusao: a suite da API nao contaminou o banco de desenvolvimento nesta reexecucao

### Web
- `pnpm.cmd lint`: PASS
- `pnpm.cmd build`: PASS
- `pnpm.cmd test`: not directly available
- `pnpm.cmd typecheck`: not directly available

## Evidencia de runtime manual

### API
- `GET /health`: PASS
- `POST /auth/login` com `acesso@fibercontrol.local / Fiber@123456`: PASS
- `GET /auth/me` com token valido: PASS
- preflight CORS para `http://web.fiber-control.localhost:3000`: PASS

### Web
- `GET /login`: PASS `200`
- `GET /dashboard`: PASS `200`
- `GET /customers`: PASS `200`
- `GET /customers/new`: PASS `200`
- `GET /payments`: PASS `200`
- `GET /payments/new`: PASS `200`
- `GET /alerts`: PASS `200`
- `GET /finance`: PASS `200`
- `GET /reports`: PASS `200`
- `GET /regions`: PASS `200`
- `GET /routes`: PASS `200`

### Endpoints do MVP
- `POST /customers`: PASS
- `GET /customers`: PASS
- `POST /payments`: PASS
- `GET /payments`: PASS
- `GET /alerts/overview`: PASS
- `GET /finance/overview`: PASS
- `GET /reports/monthly-revenue`: PASS com auth
- `GET /reports/annual-summary`: PASS com auth
- `GET /reports/overdue`: PASS com auth
- `GET /reports/regions`: PASS com auth
- `GET /regions`: PASS
- `GET /regions/performance`: PASS
- `Routes`: continua sem backend dedicado; validacao feita pela pagina web `200`, coerente com o MVP definido

## Diagnostico objetivo
- o baseline de boot local existe e permaneceu estavel nesta reexecucao
- API e web sobem localmente no host nomeado documentado
- o login seed local funciona depois da suite da API
- CORS local permanece coerente com `web.fiber-control.localhost`
- o recorte minimo do MVP navega localmente no frontend e os principais contratos da API respondem
- a `FC-026` removeu de fato o bloqueio estrutural que impedia readiness local

## Riscos remanescentes antes da FC-023
- `apps/web` ainda nao possui suite automatizada dedicada
- `apps/api` continua com warning de engine porque exige Node `24.x` e o ambiente validado estava em `v22.21.1`
- `Routes` permanece apenas como superficie web de overview; nao existe backend especifico para planning/live maps, o que continua fora do MVP
- os modulos explicitamente fora do MVP continuam neutralizados e nao devem contaminar staging ou narrativa publica

## Decisao da FC-022
- `FC-022` pode ser marcada como `DONE`
- classificacao final desta reexecucao: `DONE`
- a validacao local/manual do MVP ficou consolidada com evidencia atualizada
- `FC-023` pode ser promovida para `READY`
- nenhum deploy foi iniciado nesta task

## Proxima acao recomendada
- promover e executar `FC-023 - Staging Deployment Baseline`
- manter explicito em staging que:
  - Node `24.x` segue como expectativa declarada da API
  - `apps/web` ainda depende de smoke manual e build/lint, nao de suite dedicada

# FC-022 - MVP Local Validation and Deploy Readiness

## Data
2026-04-24

## Escopo validado
- revisao do recorte MVP definido em `docs/product/mvp-scope.md`
- revisao de `backlog.md`, `STATUS.md`, `docs/ops/session-handoff.md` e `docs/ops/execution-log.md`
- levantamento dos scripts oficiais em `apps/api/package.json` e `apps/web/package.json`
- gates tecnicos locais de API e web
- smoke manual local de auth, CORS e superficies minimas do MVP
- verificacao do estado real do banco/local env

## Comandos executados

### API
- `pnpm.cmd install`
- `pnpm.cmd prisma:generate`
- `pnpm.cmd lint`
- `pnpm.cmd build`
- `pnpm.cmd prisma:migrate:deploy`
- `pnpm.cmd prisma:seed`
- `pnpm.cmd test`

### Web
- `CI=true pnpm.cmd install`
- `pnpm.cmd lint`
- `pnpm.cmd build`

### Runtime manual
- boot local da API com `node dist/server.js`
- boot local da web com `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000`
- `GET http://127.0.0.1:3001/health`
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- preflight `OPTIONS /auth/me` com `Origin: http://web.fiber-control.localhost:3000`
- smoke das rotas web do MVP em `127.0.0.1:3000`
- smoke dos endpoints de `customers`, `payments`, `alerts`, `finance`, `reports` e `regions`

## Resultado dos gates tecnicos

### API
- `pnpm.cmd install`: PASS
- `pnpm.cmd prisma:generate`: PASS com warning de engine; `apps/api/package.json` exige Node `24.x`, ambiente atual estava em `v22.21.1`
- `pnpm.cmd lint`: PASS
- `pnpm.cmd build`: PASS
- `pnpm.cmd prisma:migrate:deploy`: PASS
- `pnpm.cmd prisma:seed`: PASS
- `pnpm.cmd test`: FAIL

### Falhas reais observadas em `pnpm.cmd test`
- `src/tests/fiscal-reminders.spec.ts` -> `should create a fiscal reminder`
  - esperado: `upcoming`
  - obtido: `overdue`
- `src/tests/payments.spec.ts` -> `should create a paid payment and recalculate the customer to active`
  - esperado: `ACTIVE`
  - obtido: `SUSPENDED`
- `src/tests/payments.spec.ts` -> `should keep customer as due today when payment remains pending on due date`
  - esperado: `DUE_TODAY`
  - obtido: `OVERDUE`

### Web
- `CI=true pnpm.cmd install`: PASS
- `pnpm.cmd lint`: PASS
- `pnpm.cmd build`: PASS
- `pnpm.cmd test`: not directly available
- `pnpm.cmd typecheck`: not directly available

## Evidencia de runtime manual

### API
- `GET /health`: PASS
- `POST /auth/login` com `acesso@fibercontrol.local / Fiber@123456`: FAIL `401 Unauthorized`
- consulta direta ao banco de desenvolvimento apos a suite da API:
  - `users = 0`
  - `customers = 0`
  - `payments = 0`
  - `regions = 0`
- `POST /auth/register` para bootstrap manual local: PASS
- `POST /auth/login` com usuario bootstrap `fc022-admin@fiber.dev`: PASS
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
- `Routes`: not directly available no backend; validacao feita apenas pela pagina web `200`

## Diagnostico objetivo
- o baseline de boot local existe: API e web sobem e respondem
- auth funciona no bootstrap manual local
- CORS local esta coerente com `web.fiber-control.localhost`
- o recorte minimo do MVP navega localmente no frontend e os principais contratos da API respondem
- a prontidao para deploy ainda nao esta fechada porque os gates obrigatorios da API nao passaram

## Bloqueios reais
- a suite integrada da API falha em `payments` e `fiscal-reminders`
- apos `pnpm.cmd test`, o banco de desenvolvimento ativo ficou vazio e o login seed documentado deixou de existir
- a evidencia atual indica que os testes estao usando o banco de desenvolvimento em vez do banco de teste isolado
  - `vitest.config.ts` nao aponta para `.env.test`
  - `src/config/env.ts` carrega `dotenv/config`
  - varios testes executam `deleteMany()` em `users`, `customers`, `payments` e `regions`
- `apps/web` ainda nao possui suite automatizada dedicada
- `apps/api` continua com warning de engine porque exige Node `24.x` e o ambiente validado estava em `v22.21.1`
- Docker local nao estava operacional nesta execucao; o daemon nao respondeu ao `docker compose`

## Riscos antes da FC-023
- promover staging sem isolar o banco de testes arrisca repetir limpeza indevida de dados locais
- promover staging com a suite da API em FAIL quebraria a narrativa de baseline profissional para deploy
- promover staging sem baseline automatizada de web manteria o MVP dependente apenas de smoke manual
- o login seed documentado nao e confiavel enquanto a rotina de testes continuar apagando o banco de desenvolvimento

## Decisao da FC-022
- `FC-022` nao pode ser marcada como `DONE`
- classificacao final desta execucao: `BLOCKED`
- `FC-023` nao pode virar `READY`
- antes de retomar a FC-022, o projeto precisa de uma task corretiva dedicada para:
  - isolar a suite da API no banco de teste oficial
  - restaurar a previsibilidade da seed local
  - corrigir as 3 falhas reais de `payments` e `fiscal-reminders`

## Proxima acao recomendada
- abrir e executar task corretiva de bloqueio antes de qualquer staging/deploy

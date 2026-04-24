# BACKLOG - Fiber Control

## Regras
- Uma task so entra em `DONE` com validacao executada e documentacao atualizada.
- `READY` significa pronta para execucao sem ambiguidade relevante.
- `BLOCKED` exige motivo explicito.
- Toda task deve respeitar a documentacao central.
- A proxima `READY` oficial deve ser unica e formalmente sustentada em `backlog.md`, `STATUS.md` e `docs/ops/*`.
- o objetivo estrategico atual e um MVP minimo, funcional, demonstravel e deployavel para publicacao no GitHub como evidencia profissional.
- backlog de crescimento pos-producao nao deve contaminar o escopo minimo atual.

---

## Sequenciamento formal atual
- `FC-001` e `FC-002` consolidaram a governanca e a arquitetura.
- `FC-006` foi executada antes de `FC-003` a `FC-005` porque estava explicitamente em `READY` e mitigava o risco operacional mais alto do ciclo: evoluir o dominio sem trilha de auditoria para mudancas criticas.
- A execucao fora da ordem numerica nao altera a identidade das tasks. A numeracao permanece historica; o estado oficial e governado pelas colunas do backlog.
- Com `FC-006` concluida, o ciclo volta para as tasks de formalizacao e encerramento da base existente em `apps/api`.
- `FC-020` ja foi encerrada documentalmente; por isso a proxima `READY` efetiva do novo ciclo estrategico passa a ser `FC-021`, sem regressao artificial de historico.

---

## Direcao estrategica atual
- prioridade do projeto: MVP minimo deployavel, demonstravel e publicavel no GitHub
- ordem atual: limpar governanca documental, definir escopo MVP real, preparar deploy, publicar versao funcional, montar documentacao profissional de portfolio e so depois abrir crescimento de producao
- o projeto nao deve ser empurrado para escopo enterprise nesta fase

---

## Sequencia estrategica FC-020 a FC-025
- `FC-020` - Governance / Documentation - `DONE`
  - **Objetivo**: regularizar a divergencia entre `backlog.md`, `STATUS.md`, `execution-log.md` e `docs/ops/done/*`.
  - **Observacao**: concluida em 2026-04-24 e preservada como `DONE` para nao falsificar o historico.
- `FC-021` - MVP Scope Definition for Deploy - `DONE`
  - **Tipo**: Product / Planning
  - **Prioridade**: P0
  - **Objetivo**: definir o escopo minimo vital do MVP publico, separando claramente o que entra no MVP deployavel, o que fica fora do MVP e o que sera backlog de crescimento pos-producao.
- `FC-022` - MVP Local Validation and Deploy Readiness - `DONE`
  - **Tipo**: Engineering / Validation
  - **Prioridade**: P0
  - **Objetivo**: validar localmente build, testes, env vars, CORS, auth, health checks e fluxos minimos do MVP antes de qualquer deploy.
  - **Observacao**: reexecutada com sucesso em 2026-04-24 apos a `FC-026`; baseline local validado e `FC-023` liberada para `READY`.
- `FC-023` - Staging Deployment Baseline - `DONE`
  - **Tipo**: Deploy / Infrastructure
  - **Prioridade**: P0
  - **Objetivo**: publicar web, API e banco em ambiente acessivel para validacao real.
  - **Observacao**: `FC-023A` concluiu a baseline documental e `FC-023B` fechou a validacao operacional/documental. O banco Neon foi criado manualmente, o `Manual External Operations Gate` foi validado pelo humano, a divergencia de Node foi resolvida em `v24.15.0`, Prisma `7` ficou consolidado com `DIRECT_URL` via `apps/api/prisma.config.ts` e o runtime permaneceu em `DATABASE_URL` pooled do Neon. Nenhum secret real foi registrado no repositorio e nenhum codigo de produto precisou ser alterado para este fechamento.
- `FC-024` - Public GitHub README and Recruiter Evidence Pack - `DONE`
  - **Tipo**: Documentation / Portfolio
  - **Prioridade**: P1
  - **Objetivo**: criar README profissional em ingles, demo flow, arquitetura, status do projeto, roadmap e evidencia para recrutadores.
  - **Observacao**: concluida em 2026-04-24 com `README.md` reescrito em ingles, evidence pack criado em `docs/project/recruiter-evidence-pack.md` e narrativa publica alinhada ao MVP real, sem alegar deploy publico inexistente.
- `FC-025` - Production Growth Backlog - `PARKED`
  - **Tipo**: Product / Growth
  - **Prioridade**: P2
  - **Objetivo**: registrar evolucao futura pos-MVP, sem contaminar o escopo minimo atual.
- `FC-026` - API Test Isolation and Local MVP Recovery - `DONE`
  - **Tipo**: Engineering / Quality
  - **Prioridade**: P0
  - **Objetivo**: isolar a suite da API no banco oficial de testes, restaurar a previsibilidade da seed local e corrigir as regresses reais de `payments` e `fiscal-reminders` que bloquearam a `FC-022`.
  - **Observacao**: concluida em 2026-04-24 com `vitest` carregando `.env.test`, suite da API em PASS e login seed local restaurado.

## Corretivo executado apos o bloqueio inicial da FC-022
- `FC-026` foi a correcao minima obrigatoria antes da reexecucao da `FC-022`.
- a execucao da `FC-026` nao alterou a estrategia MVP; apenas removeu o bloqueio tecnico que impedia staging/deploy com baseline profissional.

---

## READY
- *(vazio no momento)*
## TODO
- `FC-025` - Production Growth Backlog
  - **Status de planejamento**: `PARKED`
  - **Tipo**: Product / Growth
  - **Prioridade**: P2
  - **Objetivo**: registrar evolucao futura pos-MVP, sem contaminar o escopo minimo atual.
  - **Escopo**: backlog de crescimento apos deploy e publicacao do MVP.
  - **Fora de escopo**: qualquer entrega do ciclo MVP atual.
  - **Criterios de aceite**:
    - backlog pos-MVP claramente separado do escopo minimo atual
  - **Validacao obrigatoria**:
    - depende de MVP definido e publicado
  - **Impacto documental**:
    - `backlog.md`
    - `STATUS.md`
    - `docs/ops/session-handoff.md`

---

## DOING
- *(vazio no momento)*

## BLOCKED
- *(vazio no momento)*

## DONE
- `FC-024` - DONE com `README.md` reescrito em ingles e `docs/project/recruiter-evidence-pack.md` criado para refletir o MVP real, a baseline tecnica validada, os limites deliberados do projeto e a trilha de evidencias para GitHub e recrutadores, sem inflar escopo nem alegar deploy publico inexistente
- `FC-023` - DONE com baseline de staging fechada documentalmente e validacoes manuais confirmadas pelo humano: Node `v24.15.0`, npm `11.12.1`, pnpm `10.33.0`, `pnpm.cmd install`, `pnpm.cmd prisma generate`, `pnpm.cmd prisma migrate deploy`, `pnpm.cmd build`, `docker compose up -d` e `pnpm.cmd test` em PASS; `Manual External Operations Gate` do Neon validado; Prisma `7` consolidado com `DIRECT_URL` via `apps/api/prisma.config.ts` e runtime mantido em `DATABASE_URL` pooled do Neon, sem registrar secrets reais
- `FC-022` - DONE com reexecucao formal da validacao local do MVP: `prisma:generate`, `lint`, `build`, `prisma:migrate:deploy` e `test` em `apps/api` ficaram em PASS no banco oficial de testes `127.0.0.1:5442`, o banco dev `127.0.0.1:5440` permaneceu intacto apos a suite, o login seed `acesso@fibercontrol.local` voltou a passar junto com `GET /auth/me`, CORS e as rotas/pontos minimos do MVP responderam corretamente, e `FC-023` foi liberada para `READY`
- `FC-001`
- `FC-002`
- `FC-003` - DONE com fotografia tecnica registrada: `pnpm.cmd prisma:generate`, `lint` e `build` em PASS; `pnpm.cmd test` em FAIL por incoerencia do banco de testes em `127.0.0.1:5440`, com ausencia de `public.audit_events`
- `FC-004` - DONE com persistencia Prisma formalizada: `5440` reservado para dev, `5442` oficializado para test, 7 migrations aplicadas em `fiber_control_test`; `test` em FAIL residual por regra funcional
- `FC-004A` - DONE com regressoes residuais zeradas: `pnpm.cmd prisma:generate`, `lint`, `build` e `test` em PASS
- `FC-005` - DONE com autenticacao/autorizacao base formalizadas: `prisma generate`, `lint`, `build`, `auth.spec.ts` e `test` em PASS
- `FC-006` - DONE com limitacao ambiental documentada: `pnpm.cmd test` bloqueado por PostgreSQL indisponivel em `127.0.0.1:5440`
- `FC-007` - DONE com fundacao frontend operacional formalizada: `pnpm.cmd install`, `lint` e `build` em PASS; shell ativo reduzido a `workspace`, `patterns` e `settings`, com rotas legadas de negocio neutralizadas por redirect
- `FC-008` - DONE com alinhamento do login local ao ambiente real: `prisma generate`, `prisma migrate deploy`, `prisma seed`, `lint`, `build` e `test` em PASS; `acesso@fibercontrol.local` validado no banco ativo `127.0.0.1:5440` e login operacional confirmado em `http://localhost:3001/auth/login`
- `FC-009` - DONE com consolidacao minima da superficie `Customers`: `customers-list-screen.tsx` e `customer-create-screen.tsx` migrados para as primitives da fundacao ativa, `/customers` e `/customers/new` reabertos, `lint` e `build` em PASS; detail/edit mantidos neutralizados
- `FC-010` - DONE com consolidacao minima da superficie `Payments`: `payments-list-screen.tsx` e `register-payment-screen.tsx` alinhados as primitives da fundacao ativa, `/payments` e `/payments/new` reabertos, `lint` em PASS e `build` em PASS fora do sandbox; reconciliacao mantida fora de escopo
- `FC-011` - DONE com consolidacao minima da superficie `Alerts`: `alerts-screen.tsx` alinhada ao contrato real `GET /alerts/overview`, `/alerts` reaberta, `lint` em PASS e `build` em PASS fora do sandbox; lifecycle actions mantidas fora de escopo
- `FC-012` - DONE com consolidacao minima da superficie `Finance`: `finance-overview-screen.tsx` alinhada ao contrato real `GET /finance/overview`, `/finance` reaberta, `lint` em PASS e `build` em PASS fora do sandbox; reports e fiscal settings mantidos fora de escopo
- `FC-013` - DONE com consolidacao minima da superficie `Reports`: `reports-screen.tsx` alinhada aos contratos reais `GET /reports/monthly-revenue`, `GET /reports/annual-summary`, `GET /reports/overdue` e `GET /reports/regions`, `/reports` reaberta, `lint` em PASS e `build` em PASS fora do sandbox; rotas detalhadas mantidas fora de escopo
- `FC-014` - DONE com consolidacao minima da superficie `Regions`: `regions-screen.tsx` alinhada aos contratos reais `GET /regions` e `GET /regions/performance`, `/regions` reaberta, `lint` em PASS e `build` em PASS fora do sandbox; route planning e regional report drilldown mantidos fora de escopo
- `FC-015` - DONE com consolidacao minima da superficie `Dashboard`: `dashboard-screen.tsx` alinhada aos contratos reais de `finance`, `alerts`, `reports` e `regions`, `/dashboard` reaberta, `lint` em PASS e `build` em PASS fora do sandbox; route preview e analytics avancado mantidos fora de escopo
- `FC-016` - DONE com consolidacao minima da superficie `Routes`: `routes-screen.tsx` alinhada a linguagem operacional da FC-007, `/routes` reaberta, `lint` em PASS e `build` em PASS fora do sandbox; route planning, live maps e operacao de campo mantidos fora de escopo
- `FC-017` - DONE com checkpoint de governanca e saneamento do worktree: publicacao de `FC-015` e `FC-016` validada em `main`, Named Localhost Convention confirmada como governanca enxuta e worktree remanescente preservado em snapshot seguro fora da arvore ativa; nenhuma nova `READY` foi aberta
- `FC-018` - DONE com auditoria do snapshot residual pos-`FC-017`: bloco de `apps/api` classificado como mudanca futura relevante, deriva local de `Customers`/`Alerts` classificada para descarte ou task propria e ruido documental isolado; `main` permaneceu limpo e o snapshot seguro foi mantido sem reaplicacao
- `FC-019` - DONE com operacionalizacao minima da Named Localhost Convention no ambiente local: `web.fiber-control.localhost` e `api.fiber-control.localhost` validados com boot local, `APP_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL` e `CORS_ORIGIN` alinhados, login e CORS confirmados em host nomeado e fallback documentado para `localhost:porta`
- `FC-020` - DONE com reconciliacao documental das evidencias de `DONE`: arquivos ausentes em `docs/ops/done/` criados para `FC-001`, `FC-002`, `FC-003`, `FC-004`, `FC-004A`, `FC-005`, `FC-006`, `FC-008`, `FC-009` e `FC-011`; backlog, `STATUS.md`, `execution-log.md` e `session-handoff.md` alinhados sem abrir nova feature
- `FC-021` - DONE com escopo MVP publico formalizado em `docs/product/mvp-scope.md`: MVP IN/OUT definido, fluxos minimos de demonstracao registrados, evidencias requeridas para `FC-022` listadas, riscos de pre-deploy documentados e backlog pos-MVP isolado sem promover `FC-022` a `READY`
- `FC-026` - DONE com isolamento da suite da API no banco oficial de testes e recuperacao do baseline local: `vitest.config.ts` passou a carregar `.env.test`, `payments.spec.ts` e `fiscal-reminders.spec.ts` ficaram deterministicas em relacao a data, `prisma:generate`, `lint`, `build` e `test` em `apps/api` ficaram em PASS, e o login seed `acesso@fibercontrol.local` voltou a ser validado apos `prisma seed`

---

## O que falta no ciclo atual
- preparar o deploy minimo com base no MVP definido, sem abrir backlog enterprise
- publicar uma baseline funcional em ambiente acessivel
- produzir documentacao profissional de portfolio para GitHub e recrutadores
- manter o crescimento pos-producao separado do ciclo MVP

## Riscos atuais
- `127.0.0.1:5440` agora voltou a refletir o baseline local de desenvolvimento com seed e migration atuais, mas continua sendo ambiente de dev e nao pode ser usado como base de testes
- a divergencia anterior entre Node `24.x` declarado e Node `v22.21.1` validado foi resolvida no baseline manual de `FC-023` com Node `v24.15.0`
- `apps/web` ainda nao possui suite automatizada dedicada; staging continua dependente de smoke manual mais build/lint
- sem task dedicada por modulo, qualquer reabertura de tela de negocio em `apps/web` pode reintroduzir deriva visual e estrutural fora da fundacao operacional
- `customers/[id]` e `customers/[id]/edit` continuam scaffold-only e permanecem neutralizados ate task propria
- a reconciliacao permanece fora de escopo dentro do ciclo de `Payments` e nao deve vazar para a task seguinte sem `READY` propria
- lifecycle de `Alerts` permanece fora de escopo dentro do ciclo atual e nao deve ser reaberto sem task propria
- relatorios detalhados e configuracoes fiscais permanecem fora de escopo dentro do ciclo de `Finance`
- relatorios detalhados e drilldown por cliente permanecem fora de escopo dentro do ciclo de `Reports`
- route planning e operacao de campo permanecem fora de escopo dentro do ciclo de `Regions`
- route preview e analytics avancado permanecem fora de escopo dentro do ciclo de `Dashboard`
- route planning, live maps e operacao de campo permanecem fora de escopo dentro do ciclo de `Routes`
- sem reconciliacao documental, o projeto corria risco de tratar `DONE` como encerramento sem arquivo formal; esse risco foi saneado pela `FC-020`, mas a proxima frente continua dependente de decisao de governanca
- sem escopo MVP formal, o projeto corre risco de derivar para backlog enterprise e contaminar o objetivo de portfolio/deploy minimo
## Proxima task oficial
nenhuma `READY` oficial no momento

## Saneamento documental
- `FC-020` abriu e fechou no mesmo ciclo para reconciliar a evidencia formal de `DONE`
- `FC-021` fechou o recorte MVP publico sem abrir deploy nem promover a etapa seguinte
- `FC-022` foi reexecutada sobre o baseline corrigido pela `FC-026`, consolidou a evidencia local do MVP e liberou `FC-023` para `READY`
- `FC-026` removeu o bloqueio tecnico que impedia a conclusao da `FC-022`
- `FC-023` fechou a baseline de staging com evidencia manual completa e liberou `FC-024` como `READY`
- `FC-024` fechou o pacote publico de portfolio e nao deixou nova `READY` aberta automaticamente

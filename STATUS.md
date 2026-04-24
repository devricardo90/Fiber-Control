# STATUS - Fiber Control

## Estado atual
Projeto com governanca central estabelecida, arquitetura backend definida, trilha de auditoria transversal implementada, persistencia Prisma formalizada, autenticacao/autorizacao base formalmente encerradas, fundacao frontend operacional fechada, oito superficies de negocio reabertas com consolidacao minima, reconciliacao documental de `DONE` fechada pela `FC-020`, escopo MVP publico formalizado pela `FC-021`, bloqueio tecnico da validacao local removido pela `FC-026`, reexecucao formal da `FC-022` encerrada com baseline local do MVP validado, `FC-023` formalmente encerrada como `DONE`, `FC-024` fechada como pacote publico de portfolio e `FC-025A` aberta como nova task operacional `READY`. A baseline oficial de staging permanece em Neon para banco, Render para API e Vercel para web. A proxima decisao explicita do projeto passa a ser validar ou provisionar Neon, configurar `DATABASE_URL` pooled e `DIRECT_URL` direct, depois provisionar Render API, depois Vercel Web e por fim executar smoke real, sem alterar codigo funcional, sem registrar segredos reais e sem declarar staging como `DONE` antes de smoke real.

## Fotografia oficial apos FC-020
- `FC-020` esta formalmente classificada como `DONE`.
- todas as tasks previamente marcadas como `DONE` e sem arquivo formal agora possuem registro em `docs/ops/done/`.
- a reconciliacao foi documental; nenhuma feature nova foi aberta e nenhum codigo de produto foi alterado.
- a estrategia seguinte foi reorganizada para MVP minimo deployavel, preparando o fechamento documental da `FC-021`.

## Direcao estrategica MVP
- o objetivo atual do projeto e entregar um MVP minimo, funcional, demonstravel e deployavel.
- esse MVP deve ser publicavel no GitHub como evidencia profissional de engenharia, governanca, deploy real e evolucao planejada.
- o projeto nao deve ser empurrado para backlog enterprise neste ciclo.
- backlog de crescimento de producao fica explicitamente separado do MVP.
- o recorte MVP publico agora esta formalizado em `docs/product/mvp-scope.md`.

## Fotografia oficial apos FC-019
- `FC-019` esta formalmente classificada como `DONE`.
- o ambiente local do Fiber Control opera com `web.fiber-control.localhost` e `api.fiber-control.localhost` como padrao recomendado validado.
- `APP_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL` e `CORS_ORIGIN` foram alinhados ao host nomeado.
- boot local, CORS, login e leitura de `auth/me` foram validados com host nomeado.
- o fallback para `localhost:porta` permaneceu documentado sem ser removido.

## Tasks concluidas
- `FC-001` - governanca operacional no padrao Protocolo Rick
- `FC-002` - arquitetura backend oficial
- `FC-003` - gates e encerramento tecnico da base `apps/api` formalizados com teste em FAIL documentado
- `FC-004` - persistencia Prisma formalizada com banco de teste isolado em `127.0.0.1:5442`
- `FC-004A` - regressoes funcionais residuais de `payments` e `fiscal-reminders` estabilizadas com suite verde
- `FC-005` - autenticacao e autorizacao base formalmente encerradas com gates em PASS
- `FC-006` - trilha de auditoria transversal com limitacao ambiental registrada no gate de testes
- `FC-007` - fundacao frontend operacional formalizada com shell, navegacao e primitives proprios simples
- `FC-008` - alinhamento minimo do login local ao ambiente real com migrate deploy, seed e validacao ponta a ponta no banco ativo
- `FC-009` - consolidacao minima da superficie Customers com reabertura controlada de listagem e criacao
- `FC-010` - consolidacao minima da superficie Payments com reabertura controlada de listagem e criacao
- `FC-011` - consolidacao minima da superficie Alerts com reabertura controlada da overview
- `FC-012` - consolidacao minima da superficie Finance com reabertura controlada da overview
- `FC-013` - consolidacao minima da superficie Reports com reabertura controlada da overview
- `FC-014` - consolidacao minima da superficie Regions com reabertura controlada da overview
- `FC-015` - consolidacao minima da superficie Dashboard com reabertura controlada da overview
- `FC-016` - consolidacao minima da superficie Routes com reabertura controlada da overview
- `FC-017` - checkpoint de governanca e saneamento do worktree pos-FC-016
- `FC-018` - auditoria e classificacao do snapshot residual pos-FC-017
- `FC-019` - operacionalizacao minima da Named Localhost Convention no ambiente local
- `FC-020` - reconciliacao documental das evidencias formais de `DONE`
- `FC-021` - definicao formal do escopo MVP publico para deploy e portfolio
- `FC-023` - baseline de staging fechada com gate manual do Neon validado e contrato Prisma/Neon consolidado
- `FC-024` - README publico em ingles e recruiter evidence pack alinhados ao MVP real
- `FC-022` - validacao local/manual do MVP reexecutada com baseline corrigido e readiness de staging liberada
- `FC-026` - isolamento da suite da API no banco oficial de testes e recuperacao do baseline local

## Tasks em aberto
- `FC-025A` - `READY` - Manual Staging Provisioning
- `FC-025` - `PARKED` - Production Growth Backlog

## Proximas tasks planejadas
- `FC-025A` - `READY` - Manual Staging Provisioning
- `FC-025` - `PARKED` - Production Growth Backlog

## Encadeamento formal
- `FC-006` foi executada antes de `FC-003` a `FC-005` porque era a unica `READY` oficial e tratava um risco critico de dominio e auditoria.
- Essa execucao fora da ordem numerica nao reordena IDs historicos; apenas encerra a task que estava oficialmente pronta.
- `FC-004A` fechou a estabilizacao funcional residual apos `FC-004`.
- `FC-005` fechou o encerramento formal de autenticacao e autorizacao base com a suite integrada verde.
- `FC-007` fechou a fundacao frontend e neutralizou a superficie legada de negocio ate que novas tasks a reabram formalmente.
- `FC-008` corrigiu a deriva entre o ambiente local em `127.0.0.1:5440` e o card `Local access` sem expandir o escopo de auth ou frontend.
- `FC-009` reabriu apenas `Customers` list/create e consolidou o que ja estava bom sem recriacao ampla.
- `FC-010` reabriu apenas `Payments` list/create e consolidou o que ja era reaproveitavel sem desviar para reconciliacao.
- `FC-011` reabriu apenas a overview de `Alerts` e manteve lifecycle actions fora de escopo.
- `FC-012` reabriu apenas a overview de `Finance` e manteve reports e fiscal settings fora de escopo.
- `FC-013` reabriu apenas a overview de `Reports` e manteve rotas detalhadas e drilldown por cliente fora de escopo.
- `FC-014` reabriu apenas a overview de `Regions` e manteve route planning e regional report drilldown fora de escopo.
- `FC-015` reabriu apenas a overview de `Dashboard` e manteve route preview e analytics avancado fora de escopo.
- `FC-016` reabriu apenas a overview de `Routes` e manteve route planning, live map e operacao de campo fora de escopo.
- `FC-017` confirmou a coerencia do estado publicado e removeu o risco operacional de seguir trabalhando sobre worktree contaminado.
- `FC-018` classificou o snapshot residual sem reintroduzir mudancas soltas na arvore ativa.
- `FC-019` fechou a lacuna entre o protocolo e o runtime local, validando web e api em host nomeado.

## Validacoes mais recentes
- `FC-025A` - task operacional corrigida para seguir a baseline oficial Neon -> Render API -> Vercel Web -> smoke real: PASS documental
- `FC-025A` - escopo, fora de escopo e criterio de conclusao registrados sem abrir nova alegacao de deploy real: PASS documental
- `FC-024` - `README.md` reescrito em ingles para refletir portfolio MVP, stack, instrucoes locais, estado validado e limites reais do projeto: PASS documental
- `FC-024` - `docs/project/recruiter-evidence-pack.md` criado com leitura executiva, escopo MVP, sinais de engenharia e trilha de evidencia para recrutadores: PASS documental
- `FC-024` - narrativa publica mantida coerente com `docs/product/mvp-scope.md`, `docs/quality/fc-022-local-validation.md` e `docs/ops/done/FC-023.done.md`: PASS documental
- `FC-024` - nenhum deploy publico alegado, nenhum secret registrado e nenhuma feature nova aberta: PASS documental
- `FC-023B` - ambiente corrigido manualmente para Node `v24.15.0`, npm `11.12.1` e pnpm `10.33.0`: PASS
- `FC-023B` - `pnpm.cmd install`: PASS
- `FC-023B` - `pnpm.cmd prisma generate` em `apps/api`: PASS com Prisma Client `7.5.0` gerado sob Node `v24.15.0`
- `FC-023B` - `pnpm.cmd prisma migrate deploy` em `apps/api`: PASS com `DIRECT_URL` resolvida via `apps/api/prisma.config.ts`
- `FC-023B` - `pnpm.cmd build`: PASS
- `FC-023B` - `docker compose up -d`: PASS
- `FC-023B` - `pnpm.cmd test`: PASS
- `FC-023B` - causa do `P1012` registrada: Prisma ORM `7.5.0` nao suporta `datasource.url` nem `datasource.directUrl` no `schema.prisma`: PASS documental
- `FC-023B` - `apps/api/prisma/schema.prisma` corrigido para manter apenas `provider = "postgresql"` no datasource: PASS documental
- `FC-023B` - `apps/api/prisma.config.ts` corrigido para usar `env("DIRECT_URL")` na Prisma CLI e nas migrations: PASS documental
- `FC-023B` - `apps/api/.env.example` ajustado para placeholders Neon sem segredo real, com `DATABASE_URL` pooled e `DIRECT_URL` direct: PASS documental
- `FC-023B` - gate manual externo do Neon registrado em `docs/ops/fc-023-staging-baseline.md`: `VALIDATED` com evidencias manuais completas
- `FC-023B` - mapeamento de env vars obrigatorias de API e web revisado contra `apps/api/.env.example`, `apps/web/.env.example` e `docs/ops/fc-023-staging-baseline.md`: PASS documental
- `FC-023B` - ausencia de manifesto especifico de provedor no repositorio identificada explicitamente para Render e Vercel: PASS documental
- `FC-023B` - `pnpm.cmd -C apps/api lint`: PASS com warning de engine Node `24.x` vs ambiente `v22.21.1`
- `FC-023B` - `pnpm.cmd -C apps/api build`: PASS com warning de engine Node `24.x` vs ambiente `v22.21.1`
- `FC-023B` - `pnpm.cmd -C apps/web lint`: PASS
- `FC-023B` - `pnpm.cmd -C apps/web build`: PASS fora do sandbox; no sandbox houve `spawn EPERM`, classificado como limitacao ambiental e nao como falha do projeto
- `FC-023A` - `docs/ops/fc-023-staging-baseline.md` consolidado com objetivo, baseline local, topologia Vercel/Render, runtime, banco, env vars, segredos, comandos e smoke pos-publicacao: PASS documental
- `FC-023A` - backlog, `STATUS.md`, `docs/ops/decisions.md`, `docs/ops/execution-log.md` e `docs/ops/session-handoff.md` alinhados para refletir a fatia documental sem iniciar deploy: PASS documental
- `FC-022` - `pnpm.cmd prisma:generate` em `apps/api`: PASS com warning de engine Node `24.x` vs ambiente `v22.21.1`
- `FC-022` - `pnpm.cmd lint` em `apps/api`: PASS
- `FC-022` - `pnpm.cmd build` em `apps/api`: PASS
- `FC-022` - `pnpm.cmd prisma:migrate:deploy` no banco oficial de testes `127.0.0.1:5442`: PASS
- `FC-022` - `pnpm.cmd test` em `apps/api`: PASS com `13` arquivos e `71` testes verdes
- `FC-022` - leitura direta do banco dev apos a suite da API: `users = 4`, `customers = 4`, `payments = 5`, `regions = 3`
- `FC-022` - login seed `acesso@fibercontrol.local / Fiber@123456` preservado apos a suite e validado via `POST /auth/login` e `GET /auth/me`: PASS
- `FC-022` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-022` - `pnpm.cmd build` em `apps/web`: PASS
- `FC-022` - preflight CORS com `Origin: http://web.fiber-control.localhost:3000`: PASS
- `FC-022` - smoke web de `/login`, `/dashboard`, `/customers`, `/customers/new`, `/payments`, `/payments/new`, `/alerts`, `/finance`, `/reports`, `/regions` e `/routes`: PASS `200`
- `FC-022` - smoke API de `customers`, `payments`, `alerts`, `finance`, `reports` e `regions`: PASS funcional minimo
- `FC-022` - decisao final da reexecucao: `DONE`; `FC-023` promovida para `READY`
- `FC-026` - `vitest.config.ts` passou a carregar `.env.test` com `NODE_ENV=test`: PASS
- `FC-026` - `payments.spec.ts` e `fiscal-reminders.spec.ts` ficaram deterministicas em relacao a data: PASS
- `FC-026` - `pnpm.cmd prisma:migrate:deploy` no banco oficial de testes `127.0.0.1:5442`: PASS
- `FC-026` - `pnpm.cmd prisma:generate` em `apps/api`: PASS com warning de engine Node `24.x` vs ambiente `v22.21.1`
- `FC-026` - `pnpm.cmd lint` em `apps/api`: PASS
- `FC-026` - `pnpm.cmd build` em `apps/api`: PASS
- `FC-026` - `pnpm.cmd test` em `apps/api`: PASS com `13` arquivos e `71` testes verdes
- `FC-026` - `pnpm.cmd prisma:migrate:deploy` no banco de desenvolvimento `127.0.0.1:5440`: PASS
- `FC-026` - `pnpm.cmd prisma:seed` no banco de desenvolvimento `127.0.0.1:5440`: PASS
- `FC-026` - login seed `acesso@fibercontrol.local / Fiber@123456` restaurado e validado via `POST /auth/login` seguido de `GET /auth/me`: PASS
- `FC-026` - decisao final: `DONE`; removeu o bloqueio tecnico que impedia a conclusao da `FC-022`
- `FC-021` - documento `docs/product/mvp-scope.md` criado com MVP IN/OUT: PASS documental
- `FC-021` - fluxos minimos de demonstracao definidos: PASS documental
- `FC-021` - evidencias requeridas antes de `FC-022` registradas: PASS documental
- `FC-021` - riscos pre-`FC-022` registrados: PASS documental
- `FC-021` - backlog, `STATUS.md`, `docs/ops/execution-log.md`, `docs/ops/session-handoff.md` e `docs/ops/done/FC-021.done.md` alinhados: PASS documental
- reorganizacao estrategica do backlog para MVP deployavel e portfolio profissional: PASS documental
- preservacao de `FC-020` como `DONE` sem regressao artificial de historico: PASS documental
- `FC-021` foi aberta como `READY` apos o saneamento e encerrada documentalmente nesta execucao: PASS documental
- `FC-020` - divergencia entre `backlog.md`, `STATUS.md`, `docs/ops/execution-log.md` e `docs/ops/done/*` validada: PASS
- `FC-020` - arquivos ausentes de `docs/ops/done/` criados para `FC-001`, `FC-002`, `FC-003`, `FC-004`, `FC-004A`, `FC-005`, `FC-006`, `FC-008`, `FC-009` e `FC-011`: PASS
- `FC-020` - `backlog.md`, `STATUS.md`, `docs/ops/execution-log.md` e `docs/ops/session-handoff.md` alinhados apos reconciliacao: PASS
- `FC-020` - codigo de produto preservado sem nova feature: PASS
- `FC-019` - env local de `apps/web` e `apps/api` alinhado a `web.fiber-control.localhost` e `api.fiber-control.localhost`: PASS
- `FC-019` - `APP_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL` e `CORS_ORIGIN` coerentes entre si: PASS
- `FC-019` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-019` - `pnpm.cmd build` em `apps/web`: PASS fora do sandbox
- `FC-019` - `pnpm.cmd lint` em `apps/api`: PASS
- `FC-019` - `pnpm.cmd build` em `apps/api`: PASS
- `FC-019` - abertura de `http://web.fiber-control.localhost:3000/login`: PASS
- `FC-019` - `GET http://api.fiber-control.localhost:3001/health`: PASS
- `FC-019` - preflight CORS em `api.fiber-control.localhost:3001`: PASS
- `FC-019` - `POST /auth/login` em host nomeado: PASS
- `FC-019` - `GET /auth/me` em host nomeado com token valido: PASS
- `FC-019` - testes de `apps/web`: N/A, nao existe suite dedicada nesta fotografia
- `FC-018` - auditoria do snapshot residual `stash@{0}`: PASS
- `FC-018` - bloco de `apps/api` classificado como mudanca futura relevante: PASS
- `FC-018` - deriva local de `Customers` e `Alerts` classificada para descarte ou task propria: PASS
- `FC-018` - ruido documental e material retroativo isolados para nao contaminar a proxima task: PASS
- `FC-018` - `main` mantido limpo apos a triagem: PASS
- `FC-017` - checkpoint de governanca em `backlog.md`, `STATUS.md`, `AGENTS.md`, `docs/rules/protocol-rick.md` e `docs/ops/decisions.md`: PASS
- `FC-017` - `FC-015` e `FC-016` refletidas corretamente na governanca publicada: PASS
- `FC-017` - Named Localhost Convention registrada de forma enxuta e correta: PASS
- `FC-017` - worktree remanescente preservado em snapshot seguro antes da limpeza: PASS
- `FC-017` - arvore ativa saneada para proxima execucao: PASS
- `FC-016` - auditoria da superficie Routes existente antes de editar: PASS
- `FC-016` - consolidacao de `routes-screen.tsx` sem redesign completo: PASS
- `FC-016` - reabertura controlada de `/routes` com overview operacional minima: PASS
- `FC-016` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-016` - `pnpm.cmd build` em `apps/web`: PASS fora do sandbox
- `FC-016` - testes de `apps/web`: N/A, nao existe suite dedicada nesta fotografia
- `FC-015` - auditoria da superficie Dashboard existente antes de editar: PASS
- `FC-015` - consolidacao de `dashboard-screen.tsx` sem redesign completo: PASS
- `FC-015` - reabertura controlada de `/dashboard` com overview agregada dos contratos reais: PASS
- `FC-015` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-015` - `pnpm.cmd build` em `apps/web`: PASS fora do sandbox
- `FC-015` - testes de `apps/web`: N/A, nao existe suite dedicada nesta fotografia
- `FC-014` - auditoria da superficie Regions existente antes de editar: PASS
- `FC-014` - consolidacao de `regions-screen.tsx` sem redesign completo: PASS
- `FC-014` - reabertura controlada de `/regions` com overview agregada dos contratos reais: PASS
- `FC-014` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-014` - `pnpm.cmd build` em `apps/web`: PASS fora do sandbox
- `FC-014` - testes de `apps/web`: N/A, nao existe suite dedicada nesta fotografia
- `FC-013` - auditoria da superficie Reports existente antes de editar: PASS
- `FC-013` - consolidacao de `reports-screen.tsx` sem redesign completo: PASS
- `FC-013` - reabertura controlada de `/reports` com overview agregada dos contratos reais: PASS
- `FC-013` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-013` - `pnpm.cmd build` em `apps/web`: PASS fora do sandbox
- `FC-013` - testes de `apps/web`: N/A, nao existe suite dedicada nesta fotografia
- `FC-012` - auditoria da superficie Finance existente antes de editar: PASS
- `FC-012` - consolidacao de `finance-overview-screen.tsx` sem redesign completo: PASS
- `FC-012` - `pnpm.cmd lint` em `apps/web`: PASS
- `FC-012` - `pnpm.cmd build` em `apps/web`: PASS fora do sandbox
- `FC-012` - testes de `apps/web`: N/A, nao existe suite dedicada nesta fotografia

## Limites e bloqueios reais
- o banco de teste oficial segue em `127.0.0.1:5442`; `127.0.0.1:5440` foi saneado apenas como desenvolvimento local e nao deve ser usado para testes
- nao existe suite automatizada dedicada de `apps/web` nesta fotografia
- Node `v24.15.0` passou a fechar o baseline validado desta execucao e removeu a divergencia anterior com o runtime `24.x` declarado em `apps/api`
- `customers/[id]` e `customers/[id]/edit` continuam presentes como scaffold e exigem task propria para reabertura
- reconciliacao permanece fora de escopo dentro do ciclo de `Payments` e exige task propria
- lifecycle actions de `Alerts` permanecem fora de escopo e exigem task propria
- reports detalhados e fiscal settings permanecem fora de escopo dentro do ciclo de `Finance`
- relatorios detalhados e drilldown por cliente permanecem fora de escopo dentro do ciclo de `Reports`
- route planning e operacao de campo permanecem fora de escopo dentro do ciclo de `Regions`
- route preview e analytics avancado permanecem fora de escopo dentro do ciclo de `Dashboard`
- route planning, live maps e operacao de campo permanecem fora de escopo dentro do ciclo de `Routes`
- o material residual de `apps/api`, `Customers`, `Alerts` e docs correlatas foi retirado da arvore ativa e preservado para classificacao posterior em task propria
- a proxima triagem deve partir apenas do bloco residual de `apps/api`, sem reaplicar automaticamente deriva local antiga de frontend ou ruido documental
- o fallback para `localhost:porta` permanece permitido e documentado quando host nomeado nao for viavel no ambiente atual
- `FC-001`, `FC-002`, `FC-003`, `FC-004`, `FC-004A`, `FC-005`, `FC-006`, `FC-008`, `FC-009` e `FC-011` tiveram fechamento formal reconstruido documentalmente em `FC-020`; parte do detalhe fino de encerramento permanece derivada dos artefatos existentes, sem evidencias novas
- readiness local alem de `GET /health` agora esta consolidada em `docs/quality/fc-022-local-validation.md`
- `FC-023` foi encerrada sem iniciar deploy automatico pelo agente; a baseline de staging ficou fechada documentalmente e os gates manuais foram confirmados pelo humano
- o repositorio continua sem manifesto especifico de provedor para Render e Vercel; isso permanece lacuna operacional conhecida, nao impedimento para o encerramento documental da baseline
- o gate manual do Neon depende de operacao externa humana por desenho, mas a evidencia requerida foi registrada e validada nesta execucao

## Proxima READY oficial
`FC-025A` - Manual Staging Provisioning

## Justificativa da proxima READY
- `FC-024` fechou a narrativa publica minima sem contradizer o MVP real
- a proxima decisao explicita do ciclo passou a ser provisionar staging real nos provedores externos
- a baseline oficial de banco em staging ja esta consolidada em Neon, portanto Render PostgreSQL nao deve ser criado como instrucao ativa
- `FC-025` continua isolada como backlog de crescimento pos-MVP e permanece `PARKED`, nao `READY`

# STATUS - Fiber Control

## Estado atual
Projeto com governanca central estabelecida, arquitetura backend definida, trilha de auditoria transversal implementada, persistencia Prisma formalizada, autenticacao/autorizacao base formalmente encerradas, fundacao frontend operacional fechada, oito superficies de negocio reabertas com consolidacao minima, reconciliacao documental de `DONE` fechada pela `FC-020`, escopo MVP publico formalizado pela `FC-021`, bloqueio tecnico da validacao local removido pela `FC-026`, reexecucao formal della `FC-022` encerrada com baseline local do MVP validado, `FC-023` formalmente encerrada como `DONE`, `FC-024` fechada como pacote publico de portfolio, `FC-025A` formalmente encerrada como `DONE` com staging publicado em Neon + Render + Vercel, `FC-027` formalmente encerrada como `DONE` com runbook versionado de reprodutibilidade do staging atual, `FC-028` formalmente encerrada como `DONE` com polish incremental do README publico e do demo flow do projeto, `FC-029` formalmente encerrada como `DONE` com checklist visual de GitHub, estrutura de screenshots e preparo documental para evidencias visuais reais, `FC-030A` formalmente encerrada como `DONE` apos smoke tecnico do Staging Web, `FC-031` formalmente encerrada como `DONE` com seed de narrativa de negocio alinhado (Joao Silva e Maria Oliveira) e dados coerentes em Dashboard/Customers/Payments/Alerts, `FC-033` formalmente encerrada como `DONE` com correcao do bug de navegacao que redirecionava Customers e Alerts para Workspace, `FC-033A` formalmente encerrada como `DONE` com smoke de staging pos-FC-033 registrado, `FC-034` formalmente encerrada como `DONE` com metrica de Overdue customers corrigida no Dashboard e tela de Alerts substituida por surface operacional real (commit 479cdc1), `FC-034A` formalmente encerrada como `DONE` com smoke de staging pos-FC-034 registrado, e `FC-035` formalmente encerrada como `DONE` com backend estabelecido como unica fonte de verdade para contagem de clientes inadimplentes. A baseline oficial de staging permanece em Neon para banco, Render para API e Vercel para web. Nenhum PostgreSQL foi criado no Render e nenhum secret real foi registrado no repositorio.

## Fotografia oficial apos diagnostico de staging (FC-036)
- `FC-036` esta em `DONE`.
- diagnóstico concluído: o bloqueio suspeito de autenticação em staging foi identificado como um falso positivo causado por invocação local incorreta do curl/JSON.
- evidência técnica: os endpoints testados (`/health`, `/auth/login`, `/alerts/overview`) responderam com sucesso (`200 OK`).
- `FC-035` em staging: o comportamento observado no endpoint de alertas (1 cliente inadimplente, Maria Oliveira com `daysLate: 1`) é consistente com a implementação da `FC-035`, embora o commit implantado não tenha sido confirmado diretamente via painel do provedor.
- `FC-035` permanece como `Remote DONE` no repositório oficial.

## Fotografia oficial apos FC-035
- `FC-035` esta em `DONE`.
- regra de negocio consolidada: cliente e operacionalmente inadimplente quando `customer.status === OVERDUE` OU a data de referencia e posterior ao vencimento + graceDays. O backend (`alerts.service.ts`) e a unica fonte de verdade; o frontend consome `summary.overdueCustomers` diretamente.
- `overdueFromAlerts` removido de DashboardScreen e AlertsScreen; ambas voltam a consumir `data.summary.overdueCustomers` retornado pelo backend.
- `buildCustomerAlerts` atualizado com union rule `isAccountOverdue || isDateOverdue`; branches de `cutoff_soon` e `pending_payment` preservados sem alteracao.
- novo caso de regressao adicionado em `src/tests/alerts.spec.ts`: cliente com `status === OVERDUE` e data de referencia antes do grace limit retorna `overdue_customer` com `daysLate = 0`.
- validacao local: `src/tests/alerts.spec.ts` 4/4 PASS no banco de testes `127.0.0.1:5442`; tsc PASS; lint PASS; git diff --check sem erros.
- nenhum seed, migration, DB, env, package ou deploy foi executado.
- nota Docker: docker compose up -d falhou inicialmente por porta 5440 ocupada, mas o banco de teste em 5442 estava operacional para os testes.

## Fotografia oficial apos FC-034A
- `FC-034A` esta em `DONE`.
- `FC-034` corrigiu a metrica "Overdue customers" no Dashboard: o card contava clientes unicos com `customer.status === "overdue"` ou `type === "overdue_customer"` nos alert items, mostrando 1 (Maria Oliveira) de forma consistente com Payments e Alerts.
- `FC-034` substituiu a tela de Alerts (que exibia `PlaceholderPage` com linguagem de fundacao) por surface operacional real: summary cards com dados ao vivo, lista de alertas com severidade, cliente, mensagem, saldo em aberto e regiao.
- `FC-035` removeu a logica `overdueFromAlerts` do frontend e delegou a contagem definitivamente ao backend.
- smoke de staging pos-FC-034 confirmado: Dashboard exibe Overdue customers = 1; Alerts abre /alerts com surface operacional; Maria Oliveira aparece com alerta de saldo em aberto; Customers e Payments preservados.
- commit 479cdc1 esta em origin/main; FC-035 aguarda commit pos-aprovacao do Trigger.

## Fotografia oficial apos FC-033A
- `FC-033A` esta em `DONE`.
- `FC-033` corrigiu o bug de navegacao: Customers e Alerts paravam em `redirect("/workspace")`; agora abrem `CustomersListScreen` e `AlertsScreen` respectivamente.
- smoke de staging pos-FC-033 confirmado: Customers (PASS) exibe Joao Silva Telecom e Maria Oliveira; Alerts (PASS) abre /alerts sem redirecionamento; Workspace preservado.
- commit 0ad7bf8 esta em origin/main; nenhum deploy manual foi executado.

## Fotografia oficial apos FC-030A
- `FC-030A` esta em `DONE` (Status: PASS WITH NOTES).
- integracao tecnica Vercel -> Render -> Neon validada via status codes e CORS headers.
- fluxo visual de Dashboard bloqueado por falta de credenciais validas no Neon Staging.
- o projeto esta tecnicamente pronto para as capturas de screenshots reais assim que o acesso ao ambiente for estabelecido manualmente.

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
- `FC-025A` - provisionamento manual de staging concluido com Neon como banco oficial, API publicada em Render, web publicada em Vercel e smoke manual aprovado
- `FC-027` - runbook versionado de staging criado com arquitetura, env vars, smoke oficial e troubleshooting do baseline real
- `FC-028` - README publico polido incrementalmente com links reais de staging, demo flow, arquitetura, disciplina operacional e limitacoes atuais
- `FC-029` - abertura oficial da proxima frente de portfolio visual para screenshots, polish de README visual e checklist de GitHub
- `FC-029` - checklist visual e estrutura de screenshots preparados sem inventar evidencias visuais
- `FC-022` - validacao local/manual do MVP reexecutada com baseline corrigido e readiness de staging liberada
- `FC-026` - isolamento da suite da API no banco oficial de testes e recuperacao do baseline local
- `FC-030A` - smoke técnico do Staging Web e prontidão de evidência técnica.
- `FC-031` - alinhamento da narrativa de negocio e dados de demonstracao no staging.
- `FC-033` - correcao do bug de navegacao que redirecionava Customers e Alerts para Workspace.
- `FC-033A` - registro do smoke de staging pos-FC-033 com evidencias de Customers e Alerts.
- `FC-034` - correcao da metrica Overdue customers no Dashboard e substituicao da tela de Alerts por surface operacional real.
- `FC-034A` - registro do smoke de staging pos-FC-034 com evidencias de Dashboard e Alerts alinhados.
- `FC-035` - alinhamento da regra de dominio de inadimplencia: backend como unica fonte de verdade; union rule no alerts.service.ts; overdueFromAlerts removido do frontend; regressao adicionada em alerts.spec.ts.

## Tasks em aberto
- `FC-025` - `PARKED` - Production Growth Backlog

## Proximas tasks planejadas
- `FC-032` - Portfolio Visual Polish & Final Screenshots Capture

## Encadeamento formal
- `FC-006` foi executada antes de `FC-003` a `FC-005` because era a unica `READY` oficial e tratava um risco critico de dominio e auditoria.
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
- `FC-016` reabriu apenas a overview de `Routes` e manteve route planning, live maps e operacao de campo fora de escopo.
- `FC-017` confirmou a coerencia do estado publicado e removeu o risco operacional de seguir trabalhando sobre worktree contaminado.
- `FC-018` classificou o snapshot residual sem reintroduzir mudancas soltas na arvore ativa.
- `FC-019` fechou a lacuna entre o protocolo e o runtime local, validando web e api em host nomeado.
- `FC-030A` validou tecnicamente a integração Web -> API -> Neon em Staging.

## Validacoes mais recentes
- `FC-035` - union rule `isAccountOverdue || isDateOverdue` em `buildCustomerAlerts`; `overdueFromAlerts` removido de DashboardScreen e AlertsScreen; `src/tests/alerts.spec.ts` 4/4 PASS em `127.0.0.1:5442`; tsc PASS; lint PASS; git diff --check sem erros: PASS local.
- `FC-034A` - smoke de staging pos-FC-034 registrado; Dashboard Overdue customers = 1 (PASS); Alerts surface operacional sem placeholder (PASS); Maria Oliveira aparece com alerta de saldo em aberto (PASS); Customers e Payments preservados (PASS): PASS documental.
- `FC-034` - metrica overdueFromAlerts aplicada em Dashboard e AlertsScreen; PlaceholderPage removida; surface operacional de Alerts com dados ao vivo; tsc, lint e build PASS; commit 479cdc1 em origin/main: PASS.
- `FC-033A` - smoke de staging pos-FC-033 registrado; Customers PASS (exibe Joao Silva Telecom e Maria Oliveira); Alerts PASS (abre /alerts sem redirect); Workspace preservado; caveat de placeholder de Alerts documentado como melhoria futura: PASS documental.
- `FC-033` - Customers e Alerts corrigidos; redirect("/workspace") removido; CustomersListScreen e AlertsScreen renderizados; tsc, lint e build locais em PASS; commit 0ad7bf8 em origin/main: PASS.
- `FC-031` - seed atualizado com Joao Silva (em dia) e Maria Oliveira (inadimplente); Dashboard, Customers, Payments e Alerts com dados narrativos coerentes em staging: PASS.
- `FC-030A` - smoke tecnico validado; integracao Neon/Render/Vercel OK; fluxo visual bloqueado por credenciais: PASS WITH NOTES.
- `FC-029` - `docs/project/github-polish-checklist.md` criado com screenshots necessarios, ordem sugerida, descricao curta do repositorio, topics, social preview image, links publicos, evidencias recomendadas e cuidados com dados sensiveis: PASS documental
- `FC-029` - estrutura `docs/assets/screenshots/` criada para receber capturas reais posteriormente: PASS documental
- `FC-029` - `README.md` preparado para evidencia visual real com `Product Preview` e `Demo Evidence`, sem inventar screenshots: PASS documental
- `FC-029` - `docs/project/recruiter-evidence-pack.md` alinhado ao checklist visual e a dependencia de captura manual: PASS documental
- `FC-029` - backlog, `STATUS.md`, `docs/ops/session-handoff.md`, `docs/ops/execution-log.md` e `docs/ops/done/FC-029.done.md` alinhados para encerramento formal: PASS documental
- `FC-029` - revisao documental sem tokens, `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, senhas, credenciais ou emails pessoais reais no diff: PASS documental
- `FC-029` - task aberta como proxima `READY` oficial para estruturar screenshots, polish visual do README e checklist de GitHub sem alterar codigo funcional: PASS documental
- `FC-029` - escopo restringido a evidencia visual, placeholders/checklists de captura manual, links publicos e polish de portfolio sem reabrir `FC-025`: PASS documental
- `FC-028` - `README.md` melhorado em ingles com project overview, product problem, MVP scope, live staging links, demo flow, architecture, API/Web split, deployment Neon -> Render -> Vercel, auth flow, operational discipline, smoke validation, current limitations e roadmap: PASS documental
- `FC-028` - `docs/project/recruiter-evidence-pack.md` alinhado ao staging publico real, links publicos e runbook versionado: PASS documental
- `FC-028` - backlog, `STATUS.md`, `docs/ops/session-handoff.md`, `docs/ops/execution-log.md` e `docs/ops/done/FC-028.done.md` alinhados para encerramento formal: PASS documental
- `FC-028` - revisao documental sem `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, tokens, senhas ou credenciais reais: PASS documental
- `FC-028` - task aberta como proxima `READY` oficial para polimento da apresentacao publica em ingles, sem reabrir escopo funcional nem alterar providers: PASS documental
- `FC-028` - escopo da task restringido a README, demo flow, narrativa publica, URLs, highlights tecnicos e disciplina operacional, com `docs/project/recruiter-evidence-pack.md` opcional apenas se aumentar a coerencia: PASS documental
- `FC-027` - `docs/ops/staging-runbook.md` criado com arquitetura, URLs publicas, Neon pooled/direct, configuracao esperada de Render API, configuracao esperada de Vercel Web, smoke oficial e troubleshooting: PASS documental
- `FC-027` - contrato de env vars mantido apenas por nomes e placeholders, sem `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, tokens ou senhas reais: PASS documental
- `FC-027` - backlog, `STATUS.md`, `docs/ops/session-handoff.md` e `docs/ops/execution-log.md` alinhados para encerramento formal: PASS documental
- `FC-025A` - Neon permaneceu como banco oficial de staging e Render PostgreSQL nao foi criado: PASS operacional
- `FC-025A` - API publicada em `https://app-fiber-control-api-staging.onrender.com`: PASS operacional
- `FC-025A` - web publicada em `https://app-fiber-control-web-staging.vercel.app`: PASS operacional
- `FC-025A` - `GET /health`: PASS
- `FC-025A` - `/docs`: PASS
- `FC-025A` - `/openapi.json`: PASS
- `FC-025A` - `POST /auth/register`: PASS
- `FC-025A` - `POST /auth/login`: PASS
- `FC-025A` - `GET /auth/me`: PASS `200` com Bearer token correto
- `FC-025A` - `CORS_ORIGIN` ajustado para `https://app-fiber-control-web-staging.vercel.app`: PASS operacional
- `FC-025A` - `NEXT_PUBLIC_API_URL` apontado para `https://app-fiber-control-api-staging.onrender.com`: PASS operacional
- `FC-025A` - `NEXT_PUBLIC_APP_URL` apontado para `https://app-fiber-control-web-staging.vercel.app`: PASS operacional
- `FC-025A` - redeploy final verde em Render/Vercel: PASS operacional
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

## Limites e bloqueios reais
- o banco de teste oficial segue em `127.0.0.1:5442`; `127.0.0.1:5440` foi saneado apenas como desenvolvimento local e nao deve ser usado para testes
- nao existe suite automatizada dedicada de `apps/web` nesta fotografia
- Node `v24.15.0` passou a fechar o baseline validado desta execucao e removeu a divergencia anterior com o runtime `24.x` declarado em `apps/api`
- `customers/[id]` e `customers/[id]/edit` continuam presentes como scaffold e exigem task propria para reabertura
- reconciliacao permanece fora de escopo dentro do ciclo de `Payments` e exige task propria
- lifecycle actions de `Alerts` permanecem fora de escopo e exigem task propria
- a surface de `Alerts` foi substituida por view operacional real pelo FC-034; lifecycle actions de Alerts permanecem fora de escopo e exigem task propria
- reports detalhados e fiscal settings permanecem fora de escopo dentro do ciclo de `Finance`
- relatorios detalhados e drilldown por cliente permanecem fora de escopo dentro do ciclo de `Reports`
- route planning e operacao de campo permanecem fora de escopo dentro do ciclo de `Regions`
- route preview e analytics avancado permanecem fora de escopo dentro do ciclo de `Dashboard`
- route planning, live maps e operacao de campo permanecem fora de escopo dentro do ciclo de `Routes`
- o material residual de `apps/api`, `Customers`, `Alerts` e docs correlatas foi retirado da arvore ativa e preservado para classificacao posterior em task propria
- a proxima triagem deve partir apenas do bloco residual de `apps/api`, sem reaplicacao automaticamente deriva local antiga de frontend ou ruido documental
- o fallback para `localhost:porta` permanece permitido e documentado quando host nomeado nao for viavel no ambiente atual
- `FC-001`, `FC-002`, `FC-003`, `FC-004`, `FC-004A`, `FC-005`, `FC-006`, `FC-008`, `FC-009` e `FC-011` tiveram fechamento formal reconstruido documentalmente em `FC-020`; parte do detalhe fino de encerramento permanece derivada dos artefatos existentes, sem evidencias novas
- readiness local alem de `GET /health` agora esta consolidada em `docs/quality/fc-022-local-validation.md`
- `FC-023` foi encerrada sem iniciar deploy automatico pelo agente; a baseline de staging ficou fechada documentalmente e os gates manuais foram confirmados pelo humano
- `FC-025A` registrou apenas URLs publicas e resultados de smoke; secrets reais de Neon, Render e Vercel permanecem fora do repositorio
- o repositorio continua sem manifesto especifico de provedor para Render e Vercel; isso permanece lacuna operacional conhecida, nao impedimento para o encerramento documental da baseline
- o gate manual do Neon depende de operacao externa humana por desenho, mas a evidencia requerida foi registrada e validada nesta execucao

## Proxima READY oficial
A ser determinada formalmente. Candidata natural: `FC-032` - Portfolio Visual Polish & Final Screenshots Capture.

## Justificativa da proxima READY
- `FC-034A` fechou o ciclo de correcao e smoke de metricas e surface de Alerts.
- `FC-032` esta desbloqueada: narrativa de negocio alinhada (FC-031), rotas corrigidas (FC-033), metricas consistentes e Alerts operacional (FC-034), staging validado.
- `FC-025` continua isolada como backlog de crescimento pos-MVP e permanece `PARKED`.

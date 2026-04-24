# Decisions – Fiber Control

Este arquivo registra decisões importantes de produto, domínio, arquitetura, segurança e operação.

Formato recomendado de cada decisão:

```markdown
## DEC-001 – Título da decisão
- **Data**: YYYY-MM-DD
- **Contexto**: ...
- **Opções consideradas**: ...
- **Decisão**: ...
- **Impacto**: ...
- **Relacionado a**: FC-XXX, docs/..., PR ...
```

## Decisões registradas

## DEC-001 – Auditoria transversal com eventos append-only
- **Data**: 2026-04-05
- **Contexto**: `FC-006` exige rastreabilidade de mudanças críticas em pagamentos, alertas, configuração fiscal, clientes sensíveis e reconciliação. O backend atual já possui `requestId` e autenticação, mas ainda não tem entidade de auditoria nem lifecycle persistido para `Alert`.
- **Opções consideradas**: registrar auditoria apenas em logs estruturados; espalhar gravação de auditoria por cada repositório; criar trilha dedicada append-only com contexto explícito de ator e requisição.
- **Decisão**: adotar uma tabela dedicada de `AuditEvent`, append-only, persistida por um componente compartilhado chamado pelos serviços. O contexto de auditoria deve carregar `actorUserId`, `requestId`, `origin` e `reason` opcional. `Alert` passa a ser persistido para suportar lifecycle auditável sem depender apenas de cálculo em memória.
- **Impacto**: Prisma recebe novos modelos/enums e os serviços críticos passam a emitir eventos auditáveis. O overview de alertas pode combinar sinais calculados com alertas persistidos.
- **Relacionado a**: FC-006, `docs/domain-model.md`, `docs/product/business-rules.md`, `docs/architecture/backend-architecture.md`

## DEC-002 - Estabilizacao funcional residual antes de auth/autorizacao
- **Data**: 2026-04-05
- **Contexto**: apos `FC-004`, a persistencia Prisma ficou saneada e o banco de teste em `127.0.0.1:5442` passou a refletir schema e migrations atuais. A suite integrada deixou de falhar por persistencia, mas ainda restam 3 falhas funcionais em `payments.spec.ts` e `fiscal-reminders.spec.ts`.
- **Opcoes consideradas**: manter `FC-005` como proxima `READY` por sequencia historica; inserir uma task intermediaria pequena para zerar as regressoes funcionais residuais antes de auth/autorizacao.
- **Decisao**: criar `FC-004A` como proxima `READY` oficial para estabilizar as falhas funcionais residuais da suite backend antes de abrir `FC-005`.
- **Impacto**: a governanca passa a priorizar base backend tecnicamente estavel antes do encerramento formal de auth/autorizacao. `FC-005` volta para `TODO` e so reentra em `READY` apos a estabilizacao.
- **Relacionado a**: FC-004, FC-004A, FC-005, `STATUS.md`, `backlog.md`

## DEC-003 - Frontend operacional antes de telas de negocio
- **Data**: 2026-04-05
- **Contexto**: apos o fechamento da fundacao backend, o projeto precisava abrir a trilha de frontend sem permitir deriva para landing page, template de dashboard generico, estica visual de IA ou uso automatico de bibliotecas visuais como `shadcn/ui`.
- **Opcoes consideradas**: iniciar direto por telas de negocio; manter a arquitetura frontend anterior com tom de premium SaaS e `shadcn/ui`; travar primeiro uma fundacao frontend operacional com regra governante explicita.
- **Decisao**: criar `FC-007` como proxima `READY` oficial para formalizar a fundacao frontend operacional, com Tailwind puro, componentes proprios simples e foco em tabelas, filtros, status chips, formularios objetivos e navegacao clara.
- **Impacto**: o frontend passa a ser governado por regra operacional explicita antes de qualquer tela completa. O projeto reduz o risco de UI marketing-first e preserva foco em operacao diaria.
- **Relacionado a**: FC-007, `AGENTS.md`, `docs/rules/frontend-operational-rule.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/frontend-design-system.md`

## DEC-004 - Superficie ativa de `apps/web` limitada a fundacao operacional
- **Data**: 2026-04-05
- **Contexto**: a base existente de `apps/web` continha rotas e telas legadas de negocio com leitura visual e estrutural fora da governanca recem-fixada para frontend operacional.
- **Opcoes consideradas**: manter as telas legadas expostas na navegacao; reabrir imediatamente cada modulo de negocio para saneamento visual individual; limitar a superficie ativa do frontend a rotas de fundacao e neutralizar rotas legadas ate backlog especifico.
- **Decisao**: fechar `FC-007` com shell operacional, navegacao base, primitives proprios e fronteira inicial com a API, deixando as rotas legadas de negocio neutralizadas por redirect para `/workspace` ate que novas tasks `READY` as reabram formalmente.
- **Impacto**: `apps/web` passa a refletir a governanca atual sem precisar abrir, nesta task, escopos de `customers`, `payments`, `alerts`, `finance`, `regions`, `routes` ou `reports`.
- **Relacionado a**: FC-007, `apps/web/src/app/(app)/*`, `backlog.md`, `STATUS.md`

## DEC-005 - Alinhar o login local pela verdade do ambiente, sem fallback prematuro de UI
- **Data**: 2026-04-06
- **Contexto**: apos `FC-007`, a tela de login exibia o card `Local access` com `acesso@fibercontrol.local / Fiber@123456`, mas o banco ativo de desenvolvimento apontado por `apps/api/.env` em `127.0.0.1:5440` estava desatualizado e nao continha esse usuario. O diagnostico fechado descartou bug de route guard e de fluxo de auth; a divergencia estava entre ambiente e UI.
- **Opcoes consideradas**: esconder ou condicionar imediatamente o card `Local access`; primeiro alinhar o banco ativo com migrations e seed oficiais e revalidar o login real antes de tocar na UI.
- **Decisao**: abrir `FC-008` como task minima e tentar primeiro o saneamento ambiental exato do banco ativo, com `prisma migrate deploy`, `prisma seed`, verificacao direta do usuario e validacao real de `POST /auth/login` e `GET /auth/me`. Ajuste de UI so seria permitido se esse saneamento falhasse de forma limpa.
- **Impacto**: o ambiente local de desenvolvimento voltou a refletir a promessa da UI sem reabrir escopo de auth, frontend ou arquitetura. O card `Local access` permanece porque voltou a ser verdadeiro.
- **Relacionado a**: FC-008, `apps/api/.env`, `apps/api/prisma/seed.ts`, `apps/web/src/features/auth/components/login-screen.tsx`, `STATUS.md`, `backlog.md`

## DEC-006 - Consolidar superfices existentes antes de criar UI nova
- **Data**: 2026-04-06
- **Contexto**: apos a aprovacao da FC-007, a direcao de governanca passou a exigir auditoria e consolidacao das paginas frontend ja existentes antes de qualquer recriacao. `Customers` foi identificada como a melhor primeira superficie de negocio para reabertura controlada.
- **Opcoes consideradas**: redesenhar `Customers` do zero para encaixar na fundacao nova; preservar o que ja estava util e consolidar apenas os pontos de primitives, densidade, hierarquia e consistencia visual.
- **Decisao**: executar `FC-009` com intervencao minima, consolidando apenas `customers-list-screen.tsx` e `customer-create-screen.tsx`, reabrindo somente `/customers` e `/customers/new` e mantendo detail/edit neutralizados enquanto permanecerem scaffold-only.
- **Impacto**: o frontend passa a evoluir por reaproveitamento controlado, sem jogar fora telas boas. A proxima `READY` oficial fica em `Payments`, seguindo o mesmo padrao de auditoria e consolidacao minima.
- **Relacionado a**: FC-009, FC-010, `apps/web/src/features/customers/components/*`, `docs/rules/frontend-operational-rule.md`, `STATUS.md`, `backlog.md`

## DEC-007 - Reabrir Payments sem misturar reconciliacao
- **Data**: 2026-04-06
- **Contexto**: apos `FC-009`, a proxima superficie candidata era `Payments`. O backend ja sustentava `GET /payments` e `POST /payments`, mas o modulo tangencia conciliacao bancaria, que ampliaria o escopo indevidamente.
- **Opcoes consideradas**: reabrir `Payments` junto com reconciliacao; limitar `FC-010` a listagem e criacao de pagamento usando apenas os contratos ja estabilizados.
- **Decisao**: executar `FC-010` com intervencao minima, consolidando apenas `payments-list-screen.tsx` e `register-payment-screen.tsx`, reabrindo somente `/payments` e `/payments/new`, e mantendo reconciliacao explicitamente fora de escopo.
- **Impacto**: o frontend reabre a segunda superficie de negocio sem reintroduzir deriva de escopo. `Alerts` passa a ser a proxima `READY` oficial por ter menor acoplamento e boa chance de reaproveitamento controlado.
- **Relacionado a**: FC-010, FC-011, `apps/web/src/features/payments/components/*`, `apps/api/src/modules/payments/*`, `STATUS.md`, `backlog.md`

## DEC-008 - Reabrir Alerts apenas como overview operacional
- **Data**: 2026-04-06
- **Contexto**: apos `FC-010`, a proxima superficie candidata era `Alerts`. O backend ja sustentava `GET /alerts/overview`, mas o modulo tambem traz lifecycle actions (`acknowledge`, `silence`, `resolve`) que ampliariam a task.
- **Opcoes consideradas**: reabrir `Alerts` junto com lifecycle actions; limitar `FC-011` a overview read-only usando apenas o contrato ja estabilizado.
- **Decisao**: executar `FC-011` com intervencao minima, substituindo o placeholder por uma overview operacional baseada em `GET /alerts/overview`, reabrindo somente `/alerts` e mantendo lifecycle actions e relatorio de overdue fora de escopo.
- **Impacto**: o frontend reabre a terceira superficie de negocio sem expandir o escopo de acoes sensiveis. `Finance` passa a ser a proxima `READY` oficial por ter perfil semelhante de overview e baixo risco de reabertura controlada.
- **Relacionado a**: FC-011, FC-012, `apps/web/src/features/alerts/components/*`, `apps/api/src/modules/alerts/*`, `STATUS.md`, `backlog.md`

## DEC-009 - Reabrir Finance apenas como overview operacional
- **Data**: 2026-04-06
- **Contexto**: apos `FC-011`, a proxima superficie candidata era `Finance`. O backend ja sustentava `GET /finance/overview`, mas o modulo tangencia reports e configuracoes fiscais, que ampliariam a task.
- **Opcoes consideradas**: reabrir `Finance` junto com reports e widgets fiscais; limitar `FC-012` a uma overview read-only usando apenas o contrato ja estabilizado.
- **Decisao**: executar `FC-012` com intervencao minima, substituindo o placeholder por uma overview operacional baseada em `GET /finance/overview`, reabrindo somente `/finance` e mantendo reports detalhados e fiscal settings fora de escopo.
- **Impacto**: o frontend reabre a quarta superficie de negocio sem expandir o escopo para relatórios ou configuracoes. `Reports` passa a ser a proxima `READY` oficial por ter alto reaproveitamento potencial e baixo risco de reabertura controlada.
- **Relacionado a**: FC-012, FC-013, `apps/web/src/features/finance/components/*`, `apps/api/src/modules/finance/*`, `STATUS.md`, `backlog.md`

## DEC-010 - Reabrir Reports apenas como overview operacional agregada
- **Data**: 2026-04-06
- **Contexto**: apos `FC-012`, a proxima superficie candidata era `Reports`. O backend ja sustentava contratos estaveis em `GET /reports/monthly-revenue`, `GET /reports/annual-summary`, `GET /reports/overdue` e `GET /reports/regions`, mas as rotas detalhadas e o drilldown por cliente ampliariam a task.
- **Opcoes consideradas**: reabrir `/reports` junto com as rotas detalhadas; limitar `FC-013` a uma overview read-only agregando apenas os contratos ja estabilizados.
- **Decisao**: executar `FC-013` com intervencao minima, substituindo o placeholder por uma overview operacional que agrega os contratos reais do modulo `Reports`, reabrindo somente `/reports` e mantendo rotas detalhadas e drilldown por cliente fora de escopo.
- **Impacto**: o frontend reabre a quinta superficie de negocio sem expandir o escopo para relatorios dedicados. `Regions` passa a ser a proxima `READY` oficial por ter perfil semelhante de overview e baixo risco de reabertura controlada.
- **Relacionado a**: FC-013, FC-014, `apps/web/src/features/reports/components/*`, `apps/api/src/modules/reports/*`, `STATUS.md`, `backlog.md`

## DEC-011 - Reabrir Regions apenas como overview operacional
- **Data**: 2026-04-06
- **Contexto**: apos `FC-013`, a proxima superficie candidata era `Regions`. O backend ja sustentava `GET /regions` e `GET /regions/performance`, mas o modulo tangencia route planning e operacao de campo, que ampliariam a task.
- **Opcoes consideradas**: reabrir `Regions` junto com route planning e drilldown regional; limitar `FC-014` a uma overview read-only usando apenas os contratos ja estabilizados.
- **Decisao**: executar `FC-014` com intervencao minima, substituindo o placeholder por uma overview operacional baseada em `GET /regions` e `GET /regions/performance`, reabrindo somente `/regions` e mantendo route planning e regional report drilldown fora de escopo.
- **Impacto**: o frontend reabre a sexta superficie de negocio sem expandir o escopo para operacao de campo. `Dashboard` passa a ser a proxima `READY` oficial por ter alto potencial de agregacao sobre contratos ja estabilizados e baixo risco de reabertura controlada.
- **Relacionado a**: FC-014, FC-015, `apps/web/src/features/regions/components/*`, `apps/api/src/modules/regions/*`, `STATUS.md`, `backlog.md`

## DEC-012 - Reabrir Dashboard apenas como overview operacional agregada
- **Data**: 2026-04-06
- **Contexto**: apos `FC-014`, a proxima superficie candidata era `Dashboard`. Nao havia contrato backend unico para dashboard, mas os modulos de `finance`, `alerts`, `reports` e `regions` ja sustentavam contratos estaveis suficientes para uma overview agregada.
- **Opcoes consideradas**: criar um endpoint backend novo de dashboard; limitar `FC-015` a uma overview read-only agregando apenas os contratos ja estabilizados.
- **Decisao**: executar `FC-015` com intervencao minima, substituindo a neutralizacao de `/dashboard` por uma overview operacional que agrega os contratos reais de `finance`, `alerts`, `reports` e `regions`, sem abrir route preview nem analytics avancado.
- **Impacto**: o frontend reabre a setima superficie de negocio sem expandir o escopo para um backend novo ou analitica pesada. `Routes` passa a ser a proxima `READY` oficial por ser a ultima superficie legada relevante ainda nao auditada.
- **Relacionado a**: FC-015, FC-016, `apps/web/src/features/dashboard/components/*`, `apps/web/src/services/dashboard.service.ts`, `STATUS.md`, `backlog.md`

## DEC-013 - Reabrir Routes apenas como overview operacional minima
- **Data**: 2026-04-06
- **Contexto**: apos `FC-015`, a ultima superficie legada relevante ainda neutralizada era `Routes`. O frontend existente trazia mapa mockado, blur, filtros decorativos e acoes de planning sem suporte real de backend, em conflito direto com a `frontend-operational-rule`.
- **Opcoes consideradas**: reabrir `Routes` preservando o mock visual com pequenos ajustes; reimplementar toda a feature de routes; limitar `FC-016` a uma overview operacional minima com fila, status e bloqueios.
- **Decisao**: executar `FC-016` com consolidacao minima, substituindo o redirect e o mock visual inflado por uma leitura operacional compacta de fila e despacho, reabrindo somente `/routes` e mantendo route planning, live maps e operacao de campo fora de escopo.
- **Impacto**: o frontend reabre a oitava superficie de negocio sem simular capacidades inexistentes. A rodada de reabertura controlada das superficies legadas prioritarias fica encerrada e a proxima frente volta a depender de nova definicao de governanca.
- **Relacionado a**: FC-016, `apps/web/src/features/routes/components/*`, `apps/web/src/app/(app)/routes/page.tsx`, `STATUS.md`, `backlog.md`

## DEC-014 - Named Localhost Convention
- **Data**: 2026-04-06
- **Contexto**: o projeto precisa reduzir conflitos manuais de porta entre execucoes locais simultaneas e estabilizar URLs de desenvolvimento para auth, CORS, callbacks e documentacao.
- **Opcoes consideradas**: manter `localhost:<porta>` como identidade principal de cada projeto; adotar localhost nomeado por projeto como padrao recomendado, com fallback pratico para porta explicita.
- **Decisao**: adotar como padrao recomendado localhost nomeado por projeto, priorizando `web.<project>.localhost`, `api.<project>.localhost` e `admin.<project>.localhost`. A identidade local principal passa a ser o nome do projeto, nao a porta.
- **Impacto**: multiplos projetos podem coexistir com menos colisao de porta, menos troca de env e URLs locais mais previsiveis. Quando Portless ou localhost nomeado nao forem viaveis, `localhost:<porta>` continua permitido de forma explicita e documentada.
- **Relacionado a**: `AGENTS.md`, `docs/rules/protocol-rick.md`

## DEC-015 - Public MVP scope bounded for deployable portfolio release
- **Data**: 2026-04-24
- **Contexto**: apos `FC-020`, o projeto ficou documentalmente coerente, mas ainda precisava travar o que realmente entra no MVP publico para GitHub e recrutadores. O risco principal era contaminar o ciclo atual com backlog enterprise, modulos parcialmente neutralizados ou ambicoes de producao fora do minimo vital.
- **Opcoes consideradas**: seguir expandindo backlog funcional antes de fixar o MVP; empurrar o MVP para uma leitura mais ampla de plataforma enterprise; travar o MVP como o menor slice operacional ja estabilizado e documentado.
- **Decisao**: definir o MVP publico como o slice operacional minimo ja estabilizado no repositorio: auth/login funcional, dashboard overview, customers list/create, payments list/create, alerts overview, finance overview, reports overview, regions overview, routes overview, auditoria basica existente, `GET /health` e baseline de localhost nomeado documentada. Customer detail/edit, reconciliation, alert lifecycle completo, route planning, live maps, analytics avancado e demais expansoes ficam fora do MVP.
- **Impacto**: `FC-022` passa a endurecer deploy readiness apenas para esse recorte. `FC-023` e `FC-024` passam a operar sobre um MVP explicitamente limitado e demonstravel. Crescimento pos-MVP permanece isolado em backlog proprio.
- **Relacionado a**: FC-021, FC-022, FC-023, FC-024, FC-025, `docs/product/mvp-scope.md`, `backlog.md`, `STATUS.md`

## DEC-016 - Block staging until API test isolation and local seed stability are restored
- **Data**: 2026-04-24
- **Contexto**: a `FC-022` executou a validacao local do MVP e confirmou que API e web sobem, auth bootstrap funciona, CORS responde corretamente e as superficies minimas do MVP carregam. Mesmo assim, a suite da API falhou em `payments` e `fiscal-reminders`, e a evidencia de runtime mostrou que o banco de desenvolvimento ficou vazio apos `pnpm.cmd test`, derrubando o login seed local.
- **Opcoes consideradas**: marcar `FC-022` como `DONE` apoiando-se apenas no smoke manual; promover `FC-023` para `READY` mesmo com a suite backend em FAIL; bloquear a trilha de deploy e abrir uma task corretiva especifica para isolar testes e recuperar a previsibilidade local.
- **Decisao**: bloquear `FC-022`, impedir a promocao de `FC-023` e abrir `FC-026` como unica `READY` oficial para corrigir o uso de banco na suite da API, restaurar a seed local e tratar as 3 regressoes reais observadas.
- **Impacto**: o projeto preserva a narrativa de baseline profissional antes de staging. Nenhum deploy deve comecar antes de `FC-026` remover o bloqueio e permitir retomar a `FC-022` ou reexecutar sua validacao final.
- **Relacionado a**: FC-022, FC-023, FC-026, `docs/quality/fc-022-local-validation.md`, `backlog.md`, `STATUS.md`

## DEC-017 - Run the API test suite only against the isolated test database and freeze date-sensitive specs
- **Data**: 2026-04-24
- **Contexto**: a `FC-026` confirmou que a suite da API estava contaminando o banco de desenvolvimento porque `vitest` nao carregava `.env.test`. Alem disso, `payments.spec.ts` e `fiscal-reminders.spec.ts` dependiam do relogio real, o que fazia a regressao reaparecer conforme a data corrente.
- **Opcoes consideradas**: corrigir a regra de negocio de `payments` e `fiscal-reminders` para acomodar o relogio atual; manter os testes acoplados ao relogio real; garantir que `vitest` rode com `.env.test` e tornar os testes sensiveis a data deterministas.
- **Decisao**: carregar `.env.test` diretamente em `vitest.config.ts` com `NODE_ENV=test` e congelar a data apenas nos suites de `payments` e `fiscal-reminders`, preservando o comportamento de producao e removendo a flutuação do teste.
- **Impacto**: `pnpm.cmd test` em `apps/api` volta a ser previsivel, nao contamina o banco de desenvolvimento e permite restaurar a seed/local access como baseline local confiavel. A `FC-022` pode ser reexecutada sobre um ambiente estabilizado.
- **Relacionado a**: FC-026, FC-022, `apps/api/vitest.config.ts`, `apps/api/src/tests/payments.spec.ts`, `apps/api/src/tests/fiscal-reminders.spec.ts`, `docs/quality/fc-022-local-validation.md`

## DEC-018 - Promote staging baseline only after FC-022 revalidation passes on the corrected local environment
- **Data**: 2026-04-24
- **Contexto**: apos a `FC-026`, a `FC-022` foi reexecutada para confirmar se a validacao local do MVP ficava realmente pronta para staging. A reexecucao mostrou `prisma:generate`, `lint`, `build`, `prisma:migrate:deploy` e `test` em PASS na API, `lint` e `build` em PASS na web, login seed local preservado apos a suite, CORS coerente e smoke manual do MVP em PASS.
- **Opcoes consideradas**: manter `FC-023` fora de `READY` mesmo com a revalidacao em PASS; promover `FC-023` para `READY` aceitando os riscos residuais explicitamente documentados; abrir mais uma task corretiva antes de staging apesar de nao existir bloqueio tecnico atual.
- **Decisao**: encerrar `FC-022` como `DONE` e promover `FC-023` para `READY`, mantendo dois riscos explicitos para staging controlado: `apps/api` ainda declara Node `24.x` enquanto o ambiente validado estava em `v22.21.1`, e `apps/web` continua sem suite automatizada dedicada.
- **Impacto**: o projeto ganha baseline local comprovadamente demonstravel e pode iniciar o planejamento/execucao de staging sem mascarar limitacoes. A narrativa tecnica permanece coerente: MVP validado localmente, deploy ainda nao iniciado e riscos residuais documentados antes da infra.
- **Relacionado a**: FC-022, FC-023, FC-026, `docs/quality/fc-022-local-validation.md`, `docs/ops/done/FC-022.done.md`, `backlog.md`, `STATUS.md`

## DEC-019 - Start FC-023 with a documented staging contract before any real publication
- **Data**: 2026-04-24
- **Contexto**: apos a promocao da `FC-023` para `READY`, o repositorio ainda nao fixava um contrato minimo de staging para runtime, banco, env vars e smoke pos-publicacao. Iniciar deploy nessa condicao introduziria escolha arbitraria de infra e risco de expandir escopo fora do MVP.
- **Opcoes consideradas**: partir direto para a publicacao real e decidir detalhes de staging durante o deploy; adiar a `FC-023` ate existir um provedor escolhido; iniciar a `FC-023` pela menor fatia coerente, documentando primeiro o baseline de staging no repositorio; adotar uma baseline simples de portfolio com web em Vercel e API+banco em um provedor compativel.
- **Decisao**: executar `FC-023A` como primeira fatia da `FC-023`, criando `docs/ops/fc-023-staging-baseline.md` para formalizar topologia minima, escolhendo web em Vercel, API em Render e banco em Render managed PostgreSQL, com runtime alvo em Node `24.x`, isolamento obrigatorio do banco de staging, env vars minimas e smoke pos-publicacao, sem iniciar deploy nesta etapa.
- **Impacto**: a `FC-023` sai de `READY` para `DOING` com uma frente documental controlada. A execucao futura do staging passa a ter contrato objetivo de provedor, runtime e validacao sem abrir `FC-024`, sem tocar em codigo funcional de produto e sem mascarar os riscos de Node `24.x` vs `v22.21.1` e ausencia de suite dedicada em `apps/web`.
- **Relacionado a**: FC-023, `docs/ops/fc-023-staging-baseline.md`, `backlog.md`, `STATUS.md`, `docs/ops/session-handoff.md`

## DEC-020 - Keep FC-023B as operational validation before authenticated provider provisioning
- **Data**: 2026-04-24
- **Contexto**: apos a `FC-023A`, a baseline de staging ja estava escolhida, mas esta fatia recebeu escopo restrito: validar comandos, env vars obrigatorias, lacunas de provedor e plano seguro de provisionamento sem alterar codigo funcional e sem criar manifests fora dos arquivos operacionais autorizados.
- **Opcoes consideradas**: expandir `FC-023B` para criar manifests de Render e Vercel no repo; limitar `FC-023B` a validacao operacional/documental e tratar a ausencia de manifests como lacuna explicita antes do provisionamento autenticado; tentar provisionar recursos externos sem fechar a validacao operacional.
- **Decisao**: manter `FC-023B` como fatia operacional/documental. A task valida `lint`/`build`, confirma os comandos de build/start/migration, mapeia env vars obrigatorias, registra a ausencia atual de manifesto especifico de provedor no repositorio e preserva a criacao real de recursos para a etapa autenticada seguinte.
- **Impacto**: a `FC-023` continua em `DOING` sem tocar em codigo funcional e sem inferir que o deploy esteja pronto. O proximo passo fica claro: provisionar Render e Vercel com base no contrato aprovado, ou registrar bloqueio autenticado real se o acesso aos provedores nao estiver disponivel.
- **Relacionado a**: FC-023, `docs/ops/fc-023-staging-baseline.md`, `STATUS.md`, `backlog.md`, `docs/ops/session-handoff.md`

## DEC-021 - Treat Neon provisioning as a manual external gate and split pooled/direct Prisma URLs
- **Data**: 2026-04-24
- **Contexto**: o banco Neon foi criado manualmente fora do repositorio. Para evitar vazamento de credenciais e manter Prisma coerente com conexoes pooled/direct, a baseline de staging precisava registrar regras explicitas para `DATABASE_URL`, `DIRECT_URL` e validacao posterior.
- **Opcoes consideradas**: manter apenas `DATABASE_URL` e inferir a conexao direta depois; documentar credenciais reais no repo para acelerar o setup; formalizar um gate manual externo com placeholders no repo e validacao posterior no ambiente configurado pelo humano.
- **Decisao**: exigir `DATABASE_URL` com a connection string pooled do Neon para runtime e `DIRECT_URL` com a connection string direct do Neon para Prisma CLI. Em Prisma ORM `7.5.0`, `schema.prisma` deve manter apenas `provider = "postgresql"` no datasource e a CLI deve receber `DIRECT_URL` via `apps/api/prisma.config.ts` com `env("DIRECT_URL")`. O repositorio fica restrito a placeholders em `apps/api/.env.example`, sem segredos reais, e a validacao final passa a depender de evidencia manual com `pnpm prisma generate`, `pnpm prisma migrate deploy`, `pnpm build` e `pnpm test` se existir suite.
- **Impacto**: a `FC-023B` ganha um `Manual External Operations Gate` em `REVIEW` ate o ambiente real ser preenchido fora do repo e os comandos de Prisma/build passarem. O contrato de staging muda o banco alvo de Render PostgreSQL para Neon Postgres sem abrir escopo funcional e evita o `P1012` provocado por `url`/`directUrl` no `schema.prisma`.
- **Relacionado a**: FC-023, `apps/api/.env.example`, `apps/api/prisma/schema.prisma`, `apps/api/prisma.config.ts`, `docs/ops/fc-023-staging-baseline.md`, `STATUS.md`, `backlog.md`

## DEC-022 - Close FC-023 after manual Neon gate validation on Node 24
- **Data**: 2026-04-24
- **Contexto**: apos `FC-023A` e `FC-023B`, a task ainda dependia de evidencia final do ambiente corrigido fora do repo. O humano confirmou Node `v24.15.0`, npm `11.12.1`, pnpm `10.33.0`, `pnpm.cmd install`, `pnpm.cmd prisma generate`, `pnpm.cmd prisma migrate deploy`, `pnpm.cmd build`, `docker compose up -d` e `pnpm.cmd test` em `PASS`, alem da validacao do `Manual External Operations Gate` do Neon.
- **Opcoes consideradas**: manter `FC-023` em `DOING` mesmo com a evidencia completa; fechar `FC-023` sem registrar explicitamente o gate manual, a resolucao de Node e o contrato pooled/direct; encerrar `FC-023` somente apos convergir backlog, status, execution log, handoff, baseline e arquivo formal de `DONE`.
- **Decisao**: encerrar `FC-023` como `DONE`. O baseline oficial passa a registrar Node `v24.15.0` como ambiente validado, Prisma `7` consumindo `DIRECT_URL` via `apps/api/prisma.config.ts` para CLI/migrations, runtime usando `DATABASE_URL` pooled do Neon e o `Manual External Operations Gate` como `VALIDATED`, sem registrar secrets reais.
- **Impacto**: a divergencia de Node fica resolvida, o gate manual do Neon deixa de bloquear a task e `FC-024` passa a ser a proxima `READY` oficial. O fechamento continua documental/operacional, sem alterar codigo de produto.
- **Relacionado a**: FC-023, FC-024, `docs/ops/fc-023-staging-baseline.md`, `docs/ops/execution-log.md`, `docs/ops/session-handoff.md`, `docs/ops/done/FC-023.done.md`, `STATUS.md`, `backlog.md`

## DEC-023 - Keep FC-025A aligned with Neon and treat Render PostgreSQL as a superseded path
- **Data**: 2026-04-24
- **Contexto**: apos a abertura da `FC-025A`, a task passou a mandar criar PostgreSQL no Render, mas a baseline oficial de staging fechada na `FC-023` ja havia consolidado Neon Postgres como banco de staging e registrado `DATABASE_URL` pooled e `DIRECT_URL` direct como contrato oficial.
- **Opcoes consideradas**: seguir com Render PostgreSQL apesar da baseline oficial em Neon; trocar novamente o provider de banco sem decisao formal; corrigir a `FC-025A` para seguir Neon e tratar Render PostgreSQL apenas como decisao antiga superada.
- **Decisao**: manter Neon como banco oficial de staging para a `FC-025A`. A ordem operacional correta passa a ser Neon -> Render API -> Vercel Web -> smoke real. Render PostgreSQL nao deve ser criado como instrucao ativa sem nova decisao formal.
- **Impacto**: evita duplicacao de infraestrutura de banco, preserva coerencia com a `FC-023` e reduz risco operacional antes do provisionamento manual real.
- **Relacionado a**: FC-023, FC-025A, `docs/ops/fc-023-staging-baseline.md`, `docs/ops/session-handoff.md`, `STATUS.md`, `backlog.md`

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

## Sequencia estrategica FC-020 a FC-034A
- `FC-020` - Governance / Documentation - `DONE`
- `FC-021` - MVP Scope Definition for Deploy - `DONE`
- `FC-022` - MVP Local Validation and Deploy Readiness - `DONE`
- `FC-023` - Staging Deployment Baseline - `DONE`
- `FC-024` - Public GitHub README and Recruiter Evidence Pack - `DONE`
- `FC-025A` - Manual Staging Provisioning - `DONE`
- `FC-027` - Staging Reproducibility and Provider Runbook - `DONE`
- `FC-028` - Public README and Demo Presentation Polish - `DONE`
- `FC-029` - GitHub Portfolio Polish and Screenshots - `DONE`
- `FC-030A` - Manual Staging Web Smoke & Portfolio Evidence Readiness - `DONE`
- `FC-031` - Staging Demo Data and Business Narrative Alignment - `DONE`
- `FC-033` - Fix Staging Navigation for Customers and Alerts - `DONE`
- `FC-033A` - Record FC-033 Staging Smoke Evidence - `DONE`
- `FC-034` - Align Dashboard Metrics and Operational Alerts Screen - `DONE`
- `FC-034A` - Record FC-034 Staging Smoke Evidence - `DONE`

---

## READY
- *(vazio no momento — proxima READY a ser determinada formalmente)*

## TODO
- `FC-025` - Production Growth Backlog
  - **Status de planejamento**: `PARKED`
  - **Tipo**: Product / Growth
  - **Prioridade**: P2
  - **Objetivo**: registrar evolucao futura pos-MVP, sem contaminar o escopo minimo atual.
- `FC-032` - Portfolio Visual Polish & Final Screenshots Capture
  - **Status de planejamento**: `PLANNED`
  - **Prioridade**: P1
  - **Objetivo**: Capturar evidencias visuais reais apos a narrativa de negocio alinhada pelo FC-031 e rotas corrigidas pelo FC-033.

---

## DOING
- *(vazio no momento)*

## BLOCKED
- *(vazio no momento)*

## DONE
- `FC-034A` - DONE em 2026-05-03: smoke de staging pos-FC-034 registrado; Dashboard Overdue customers = 1 PASS; Alerts surface operacional sem placeholder PASS; Maria Oliveira com alerta de saldo em aberto PASS; Customers e Payments preservados.
- `FC-034` - DONE em 2026-05-03: metrica overdueFromAlerts aplicada em Dashboard e AlertsScreen; PlaceholderPage de Alerts substituida por surface operacional real com dados ao vivo; commit 479cdc1 em origin/main.
- `FC-033A` - DONE em 2026-05-03: smoke de staging pos-FC-033 registrado; Customers e Alerts confirmados com PASS no staging; caveat do placeholder de Alerts documentado como melhoria futura.
- `FC-033` - DONE em 2026-05-03: rotas de Customers e Alerts corrigidas no frontend; redirect("/workspace") substituido por CustomersListScreen e AlertsScreen; commit 0ad7bf8 em origin/main.
- `FC-031` - DONE em 2026-05-03: seed atualizado com Joao Silva e Maria Oliveira; narrativa de negocio alinhada; Dashboard, Customers, Payments e Alerts com dados coerentes de staging.
- `FC-030A` - DONE em 2026-05-03: smoke técnico validado; Web e API integradas via CORS e conectadas ao Neon; fluxo visual de Dashboard bloqueado por falta de credenciais validas no Staging; projeto pronto para evidência visual apenas após criação manual de usuário no Neon.
- `FC-029` - DONE com checklist visual criado em `docs/project/github-polish-checklist.md`
- `FC-028` - DONE com `README.md` polido incrementalmente em ingles
- `FC-027` - DONE com `docs/ops/staging-runbook.md` criado
- `FC-025A` - DONE with staging minimo publicado
- `FC-024` - DONE com `README.md` reescrito em ingles
- `FC-023` - DONE com baseline de staging fechada documentalmente
- `FC-022` - DONE com reexecucao formal da validacao local do MVP
- `FC-020` - DONE com reconciliacao documental das evidencias de `DONE`
- `FC-021` - DONE com escopo MVP publico formalizado em `docs/product/mvp-scope.md`
- `FC-026` - DONE com isolamento da suite da API no banco oficial de testes
- `FC-001`
- `FC-002`
- `FC-003` - DONE
- `FC-004` - DONE
- `FC-004A` - DONE
- `FC-005` - DONE
- `FC-006` - DONE
- `FC-007` - DONE
- `FC-008` - DONE
- `FC-009` - DONE
- `FC-010` - DONE
- `FC-011` - DONE
- `FC-012` - DONE
- `FC-013` - DONE
- `FC-014` - DONE
- `FC-015` - DONE
- `FC-016` - DONE
- `FC-017` - DONE
- `FC-018` - DONE
- `FC-019` - DONE

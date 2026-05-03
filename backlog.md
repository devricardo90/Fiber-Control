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

## Sequencia estrategica FC-020 a FC-031
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
- `FC-031` - Staging Demo Data and Business Narrative Alignment - `READY`
  - **Tipo**: Product / Engineering
  - **Prioridade**: P0
  - **Objetivo**: Transformar o staging de uma prova tecnica em uma demonstracao compreensivel de valor de negocio para gestao de empresa de fibra.
  - **Escopo**:
    - Atualizar seed.ts com João Silva (em dia) e Maria Oliveira (inadimplente)
    - Criar pagamentos e alertas coerentes
    - Garantir seed idempotente
    - Ajustar agregadores do Dashboard se necessario
    - Verificar Dashboard, Customers, Payments, Alerts e Finance
    - Remover linguage de mock/placeholder visivel
  - **Fora de escopo**:
    - novas funcionalidades, novo schema, migrations, alteracao de auth, deploy ou gate de pagamento real.
  - **Criterios de aceite**:
    - Seed demo realista e idempotente.
    - Dashboard mostra narrativa clara de negócio.
    - Customers/Payments/Alerts mostram registros coerentes.
    - Experiencia principal sem "mock" ou "placeholder".
  - **Validacao obrigatoria**:
    - git status, git diff, lint/build local, evidencia visual dos dados.

---

## READY
- `FC-031` - Staging Demo Data and Business Narrative Alignment

## TODO
- `FC-025` - Production Growth Backlog
  - **Status de planejamento**: `PARKED`
  - **Tipo**: Product / Growth
  - **Prioridade**: P2
  - **Objetivo**: registrar evolucao futura pos-MVP, sem contaminar o escopo minimo atual.
- `FC-032` - Portfolio Visual Polish & Final Screenshots Capture
  - **Status de planejamento**: `PLANNED`
  - **Prioridade**: P1
  - **Objetivo**: Capturar evidencias visuais reais apos o alinhamento da narrativa na FC-031.

---

## DOING
- *(vazio no momento)*

## BLOCKED
- *(vazio no momento)*

## DONE
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

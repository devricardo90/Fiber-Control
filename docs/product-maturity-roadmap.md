# Roteiro de maturidade produto

Este documento registra os blocos 6 a 10: visão de UX operacional, performance, auditoria, arquitetura e infraestrutura. Serve como checklist sênior antes de escalar o produto.

## 6. UX de produto real

- **Consistência de estados:** skeletons, empty states, mensagens de erro com retry e toasts uniformes.  
- **Hierarquia e foco:** indicadores explicam KPI, dashboard oferece alertas clicáveis, drill-down, filtros globais (período/região) e exportação.  
- **Fluxos orientados:** filtros (p. ex. customers) persistem na URL, busca com debounce, paginação mantém contexto, ações em massa com confirmações críticas, badges explicam status.  
- **Feedback imediato & confiança:** loading transições suaves, mensagens de erro acionáveis, modais de confirmação, acessibilidade e responsividade não apenas visual.  
- **Próximos passos:** revisar `customers`, `dashboard`, `alerts` para mapear UX states, centralizar toasts, criar storybook/hydration points e escrever guidelines de erros/empty/loading.

## 7. Dados e performance

- **Problemas antecipados:** queries pesadas (`/reports/monthly-revenue`, `/finance/overview`), N+1, agregações lentas, paginação ineficiente.  
- **Ações:** revisar índices (Postgres), medir custo com logs de Prisma, aplicar paginação por cursor quando necessário, adicionar cache ou pré-agregação para métricas críticas, separar leitura analítica de escrita.  
- **Resiliência:** definir SLAs por endpoint, monitorar latência, evitar queries improvisadas em produção.

## 8. Auditoria e histórico

- **Cobertura obrigatória:** `Payment`, `TaxConfig`, `FiscalReminder`, `Reconciliation`, `BankEntry`, `Customer status`.  
- **Dados auditáveis:** quem, quando, antes/depois, motivo. Registrar em tabelas dedicadas ou colunas JSON `auditMeta`.  
- **Trilha de eventos:** expor eventos de negócio que alimentam dashboards operacionais e facilitem investigações.

## 9. Arquitetura

- **Backend:** separar route/controller/service/repository/domain; evitar `God objects`; encapsular regras de negócio em services/dtos; lançar erros de domínio; usar transações claras.  
- **Frontend:** separar server/UI/form state; criar hooks por feature; centralizar query keys; usar adapters/formatters para dados; manter `page.tsx` orquestrador e extrair componentes puros.  
- **Benefícios:** torna manutenção/testes/refactor seguro e onboarding mais rápido.

## 10. Infra e entrega

- **Ambiente:** Docker para web/api/db, local previsível, secrets seguros, preview environments.  
- **Pipeline:** CI (lint, typecheck, tests, build, migration check); CD com deploy automatizado, smoke test e rollback simples.  
- **Operação:** health/readiness, backup/restore, migrations controladas, monitoramento de erros.  
- **Próximos passos:** documentar comandos Docker, configurar CI/CD mínimo descrito, alinhar backups e estratégias de rollback.

## Ordem de execução registrada
1. Domínio (feito).  
2. Segurança e contratos (feito).  
3. Contrato ponta a ponta (próximo).  
4. Testes (depois).  
5. Observabilidade (depois).  
6. UX de produto real (documentado).  
7. Dados e performance.  
8. Auditoria e histórico.  
9. Arquitetura refinada.  
10. Infra e entrega.

Quando quiser, passo esse bloco para um `ready` do backlog e convocamos os subagentes para executar UX operativa em `apps/web` e revisão de queries.

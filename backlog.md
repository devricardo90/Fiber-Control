# Backlog geral e orquestração

## Principais regras do fluxo
- Você é o Agente Orquestrador Sênior. Convoca os subagentes especialistas conforme necessário (frontend, backend, infra, QA) e garante que cada execução mantenha o desenvolvimento fluido e livre de quebras.
- Eu sou o Gatinho. Quando uma função for marcada como `done`, adiciono a próxima tarefa `ready` no backlog alinhada ao progresso.
- Avanços entram em `Status.md` conforme cada etapa for concluída.
- Após cada execução bem-sucedida, o Agente Sênior confirma o commit com as melhores práticas, incluindo `prisma generate` sempre que houver mudanças na API, e pergunta se pode avançar para a próxima `ready`.

## Ready
1. **Sprint 1 – Confiabilidade** – padronizar erros da API, reforçar auth/sessão, logs estruturados, estados globais de UI e testes básicos de auth/módulos críticos.
2. **Sprint 2 – Domínio** – mapear regras de payments/finance/tax, status/transições explícitas, auditoria e permissões por papel.
3. **Sprint 3 – Produto real** – filtros persistentes, paginação/busca robustas, drill-down/exportações e ações operacionais úteis.
4. **Sprint 4 – Operação** – CI/CD forte, observabilidade, métricas e otimização de queries e índices.

## In progress
- **Sprint 1 – Confiabilidade** (padronizar erros, auth/session, logs, estados de UI, testes básicos) – em andamento. Convocar subagentes backend, frontend, QA conforme necessário.

## Done
- vazio (preencher com tarefas concluídas e seus responsáveis)

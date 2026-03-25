# Fortalecimento de autenticação, contratos, testes e operação

Este documento registra o ponto 2 do seu roteiro: consolidar segurança real (autenticação, autorização, auditoria) antes de avançar para contratos e observabilidade. Ele também aponta os próximos blocos (3 a 5) para que possamos guardá-los e executá-los na ordem correta.

## 2. Autenticação, autorização e segurança

**Objetivo:** transformar o módulo de auth atual em um guardião de confiança corporativa, não apenas um portal de login.

### Estratégia
- **Token e sessão:** evitar exclusivamente `localStorage` (preferir httpOnly cookies ou armazenamento seguro) e introduzir refresh token + expiração real. Logout forçado com expiração.  
- **Tratamento de erro global:** capturar 401/403 no cliente (query hooks/route guard) e no backend (plugin Fastify) para redirecionar, limpar token e logar telemetria.  
- **RBAC completo:** além de `admin` e `operator`, definir papéis `finance`, `viewer`, cada um com permissões granulares (`TaxConfig`, alertas críticos, relatórios sensíveis).  
- **Proteção por permissão:** rotas (Fastify preHandlers) e componentes (hooks `usePermission`) devem respeitar papéis. Frontend deve esconder ou desabilitar ações proibidas.  
- **Auditoria:** cada ação crítica (`payment` status change, `alert` resolve, `tax-config` update) registra `actor`, `timestamp`, `origin`, `reason` em logs e, quando cabível, em tabela específica.

### Entregáveis futuros para este bloco
1. Revisar `AuthService`/`auth-provider` para refresh token e expiração.  
2. Criar `PermissionGuard` no frontend e `requirePermission` no backend.  
3. Expandir `UserRole` com `finance`/`viewer` e mapear scoping de ações (conf. `docs/domain-model.md`).  
4. Instrumentar logs e eventos auditáveis para ações sensíveis (pagamentos, alertas, tax config).

## 3. Contrato ponta a ponta (próximo passo)

- **Schemas Zod compartilhados:** criar pacote compartilhado (`packages/contracts`) que exporte schemas request/response para o backend validar e o frontend inferir.  
- **Tipagem derivada:** usar Prisma/Vite + Zod inference para gerar tipos e `api hooks`.  
- **Envelope de erro padronizado:** todas respostas de erro devem ter `error.code`, `message`, `details`, `fieldErrors`.  
- **Sinalização forte:** Fastify deve validar/serializar com Zod e Swagger, o frontend deve consumir com `apiRequest` tipado e tratar `fieldErrors`.

## 4. Testes (visão geral)

- **Backend:** Vitest + Supertest. Cobrir `services` e `modules` com unitárias e testes de contrato contra o HTTP. Seed fixo para ambiente de testes.  
- **Frontend:** Testing Library + vitest para componentes críticos (login, filtros, tabelas), hooks de dados (`usePayments`, etc.) e fluxos (login redirect, erros).  
- **E2E:** Playwright cobrindo login, dashboard, customers, pagamentos e alertas/configurações.  
- **Sandbox:** incluir fixtures e dados controlados para cada cenário crítico.

## 5. Observabilidade e operação

- Logger estruturado (Pino) no backend com request id por requisição.  
- Métricas (Prometheus ou similar) por endpoint, latências, taxa de erro.  
- Monitoramento de exceções (Sentry ou similar).  
- Health endpoint com dependências (DB, cache); readiness/liveness.  
- Dashboards para perguntas como “quantos logins falharam hoje”, “qual endpoint está lento”, “que query Prisma é pesada”.

## Próximos passos organizados na ordem
1. Fortalecer autenticação/autorização/segurança (documento atual).  
2. Atualizar `Status.md` e mover backlog conforme avanço.  
3. Em seguida: contrato ponta a ponta (schemas/tipagem).  
4. Depois: rede de testes backend/frontend/E2E.  
5. Por fim: observabilidade (logs, métricas, health).

Assim que confirmar, posso registrar este bloco como concluído e abrir o próximo item do backlog. Deseja que atualize `Status.md` com esse progresso e convoque os subagentes necessários?

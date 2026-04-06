# BACKLOG - Fiber Control

## Regras
- Uma task so entra em `DONE` com validacao executada e documentacao atualizada.
- `READY` significa pronta para execucao sem ambiguidade relevante.
- `BLOCKED` exige motivo explicito.
- Toda task deve respeitar a documentacao central.
- A proxima `READY` oficial deve ser unica e formalmente sustentada em `backlog.md`, `STATUS.md` e `docs/ops/*`.

---

## Sequenciamento formal atual
- `FC-001` e `FC-002` consolidaram a governanca e a arquitetura.
- `FC-006` foi executada antes de `FC-003` a `FC-005` porque estava explicitamente em `READY` e mitigava o risco operacional mais alto do ciclo: evoluir o dominio sem trilha de auditoria para mudancas criticas.
- A execucao fora da ordem numerica nao altera a identidade das tasks. A numeracao permanece historica; o estado oficial e governado pelas colunas do backlog.
- Com `FC-006` concluida, o ciclo volta para as tasks de formalizacao e encerramento da base existente em `apps/api`.

---

## TODO
- *(vazio no momento)*

---

## READY
- `FC-013` - READY para auditar e consolidar a superficie `Reports` existente, reabrindo apenas a overview se a auditoria confirmar reaproveitamento limpo na linguagem operacional da FC-007

## DOING
- *(vazio no momento)*

## BLOCKED
- *(vazio no momento)*

## DONE
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

---

## O que falta no ciclo atual
- seguir a consolidacao modulo a modulo em cima do frontend existente, sem recriacao ampla nem substituicao estetica
- validar a proxima frente operacional de `Reports` antes de reabrir qualquer outra superficie alem de `Customers`, `Payments`, `Alerts` e `Finance`

## Riscos atuais
- `127.0.0.1:5440` agora voltou a refletir o baseline local de desenvolvimento com seed e migration atuais, mas continua sendo ambiente de dev e nao pode ser usado como base de testes
- sem task dedicada por modulo, qualquer reabertura de tela de negocio em `apps/web` pode reintroduzir deriva visual e estrutural fora da fundacao operacional
- `customers/[id]` e `customers/[id]/edit` continuam scaffold-only e permanecem neutralizados ate task propria
- a reconciliacao permanece fora de escopo dentro do ciclo de `Payments` e nao deve vazar para a task seguinte sem `READY` propria
- lifecycle de `Alerts` permanece fora de escopo dentro do ciclo atual e nao deve ser reaberto sem task propria
- relatorios detalhados e configuracoes fiscais permanecem fora de escopo dentro do ciclo de `Finance`

## Proxima task oficial
`FC-013` - Auditar e consolidar a superficie `Reports` existente

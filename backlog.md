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
- *(vazio no momento)*

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

---

## O que falta no ciclo atual
- definir, por nova decisao de governanca, qual primeira frente de UI operacional deve ser aberta apos a fundacao de frontend

## Riscos atuais
- `127.0.0.1:5440` ainda existe como ambiente local legado de desenvolvimento e nao pode voltar a ser usado como base de testes
- sem task dedicada por modulo, qualquer reabertura de tela de negocio em `apps/web` pode reintroduzir deriva visual e estrutural fora da fundacao operacional

## Proxima task oficial
nenhuma `READY` automatica definida nesta fotografia

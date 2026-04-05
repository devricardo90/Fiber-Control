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

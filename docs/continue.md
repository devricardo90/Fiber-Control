# Continue

## Estado atual
- backend do `apps/api` fechado para a primeira fase operacional
- frontend `apps/web` iniciado com Next.js, shell autenticado e stack base ampliada com TanStack Query, React Hook Form, Zod, Lucide e Recharts
- modulos ativos: `customers`, `payments`, `finance`, `alerts`, `tax-config`, `fiscal-reminders`, `regions`, `bank-entries`, `reconciliation`, `reports` e `auth`
- autenticacao com bootstrap inicial, gestao de usuarios por admin e protecao do ultimo admin ativo
- migrations Prisma aplicadas para a modelagem atual
- seed de desenvolvimento disponivel em `apps/api/prisma/seed.ts`
- validacao automatizada atual: `apps/api` com `pnpm build`, `pnpm lint`, `pnpm test`; `apps/web` com `pnpm lint` e `pnpm build`

## Bootstrap local
1. executar `pnpm prisma:migrate:deploy`
2. executar `pnpm prisma:seed`
3. subir a API com `pnpm dev`

Credenciais seed:
- admin: `admin@fibercontrol.local` / `Admin@123456`
- operator: `operator@fibercontrol.local` / `Operator@123456`

## Base seed entregue
- `3` regioes operacionais
- `3` customers com cenarios `active`, `overdue` e `suspended`
- pagamentos do mes corrente e historico do mes anterior
- entradas bancarias conciliadas e nao conciliadas
- configuracao fiscal padrao
- lembretes fiscais iniciais

## Proximo passo recomendado
Continuar o frontend tela por tela a partir do Figma, na ordem:
- `Dashboard`
- `Customers`
- `Customer details`
- `Create/Edit customer`
- `Payments`
- `Finance`
- `Alerts`
- `Regions`
- `Reports`
- `Settings`

## Observacoes importantes
- a API continua configurada para `PORT=3000`
- o banco local esperado permanece em `DATABASE_URL=postgresql://postgres:postgres@localhost:5440/fiber_control`
- os logs locais `apps/api/dev.log` e `apps/api/dev.err.log` nao entram em commit

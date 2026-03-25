# Domínio Fiber Control

Este documento trava o vocabulário central do negócio, enumera entidades, status, transições, invariantes e permissões. Ele serve como referência comum para backend, frontend e QA antes de qualquer implementação de tela ou rota.

## Entidades centrais

- **Customer**: assinante com contrato de serviço recorrente. Tem dados contratuais, região, status e relacionamentos com pagamentos e alertas.
- **Payment**: compromisso financeiro mensal ligado a um `Customer` e a um `referenceMonth`.
- **Alert**: sinal operacional (inadimplência, corte, fiscal, etc.) com severidade e possível ciclo de vida.
- **FiscalReminder**: lembrete fiscal/controlador jurídico independente do alerta, com datas de vencimento e severidade.
- **TaxConfig**: configuração única por empresa; serve para estimar tributos e guiar ações fiscais.
- **Reconciliation/BankEntry**: entradas bancárias que precisam casar com pagamentos esperados.
- **Region**: agrupamento operacional de clientes para análise regional e roteamento.
- **User**: agente do sistema com papel `admin` ou `operator`.

## Status e estados válidos

- `CustomerStatus`: `active`, `due_today`, `overdue`, `suspended`, `inactive`. Transições devem seguir pagamentos/grace-cutoff. Suspensão não volta direto para `active` sem pagamento completo.
- `PaymentStatus`: `pending`, `paid`, `partial`, `failed`. Transições autorizadas: `pending` → `paid/failed/partial`; `partial` pode evoluir para `paid` ou `failed` mas não reverter para `pending`. Estornos (manuais) produzem novo registro ou `credit` específico.
- `AlertStatus`: incluir `active`, `acknowledged`, `resolved`, `silenced`. Alertas críticos (`overdue`, `cutoff`) devem gerar trilha de auditoria e associar responsável.
- `FiscalReminderStatus`: `upcoming`, `due_today`, `overdue`, `resolved`. Deve receber responsável e marcação de resolução.
- `ReconciliationStatus`: `draft`, `matched`, `unmatched`, `review`. Operações manuais não podem pular diretamente para `matched` sem evidência.
- `BankEntryStatus`: `unmatched`, `matched`.
- `TaxConfig`: versão em vigor. Alterações devem manter histórico (timestamp e autor). É `singleton` mas pode ter `effectiveFrom` em futuras versões.

## Regras e invariantes

### Pagamentos
- A combinação `customerId + referenceMonth` é única.
- Status `paid` só avança se o valor recebido ≥ esperado (possível `partial` se menor). Não há retorno automático de `paid` para `pending`.
- Estorno gera nova `Payment` ou `BankEntry` com link de auditoria; o status do pagamento original permanece `paid` com flag de ajuste.
- O sistema registra auditoria em `Payment` e `BankEntry` (quem alterou, data/hora) usando metadados no backend.
- Transição para `overdue` depende de grace/cutoff configurados no `Customer`.
- `reconciliation` pode mudar status de `BankEntry`, mas o histórico (quem atualizou, quando) persiste.

### Alertas e lembretes
- Alertas `overdueCustomer`, `cutoffSoon`, `taxDeadline` são disparados automaticamente; sua leitura/criação gera registro auditável.
- Um `Alert` pode ser `acknowledged` ou `silenced` (decisão do time de operações). Só `admin` pode resolver/encerrar.
- `FiscalReminders` são configuráveis manualmente com notificações, mas só `resolved` se houver confirmação de ação.
- Alertas e lembretes devem registrar `owner` (responsável) e timestamps de `acknowledgedAt`, `resolvedAt`.

### TaxConfig e Fiscal
- `TaxConfig` tem `effectiveFrom` para versionamento (ainda que `singleton`). Mudanças devem registrar `updatedBy` e não alterar retroativamente lançamentos já fechados; os relatórios devem referenciar a configuração vigente no `referenceMonth`.
- Atualizar o `estimatedRate` ou `regimeLabel` aciona geração de alerta ou atualização das estimativas mensais, mas não reabre cobranças passadas automaticamente.

### Clientes e regiões
- `Customer` em `region` específico. Permissão `admin` pode mover clientes entre regiões, `operator` apenas visualiza.
- Suspensão (`suspended`) exige `cutoffDays` ultrapassado. Cancela-se a suspensão ao registrar pagamento integral.
- Mudanças sensíveis (mensalidade, grace, cutoff) geram log de auditoria e só podem partir de `admin`.

## Transições permitidas (resumo)

- `Customer`: `active` → `due_today` → `overdue` → `suspended` → `inactive`. `inactive` só via fluxo manual (cancelamento). `suspended` volta a `active` somente se pagamento cobre periodos pendentes.
- `Payment`: `pending` → `paid/partial/failed`; `partial` → `paid` (com complemento) ou `failed` (reject). `failed` pode voltar para `pending` via nova tentativa (nova entidade).
- `Alert`: `active` → `acknowledged` → `resolved`; `active` → `silenced` (sem resolução). Qualquer mudança registra `actor`.
- `FiscalReminder`: `upcoming` → `due_today` → `overdue`; `resolved` apenas por `admin`.
- `Reconciliation`: `draft` (entrada inicial) → `review` (analista QA) → `matched/unmatched`. `matched` pode retornar a `review` para ajustes.

## Permissões (papéis)

- `admin`: consegue alterar `TaxConfig`, resolver alertas, criar/atualizar clientes/pagamentos críticos, ajustar `region` e `reconciliation`, ver logs de auditoria.
- `operator`: maioria das leituras, registrar pagamentos, visualizar alertas, reagendar lembretes e filtrar dashboards, mas não altera `TaxConfig` nem resolve alertas finalizados.
- Todos devem ter trilha de auditoria em alterações de status.

## Próximos passos

1. Validar este documento com o time (backend, frontend, QA).
2. Adaptar os módulos existentes para expor estados e transições descritos (ex: `PaymentService`, `AlertService`).
3. Garantir que front e testes consumam esses estados e não assumam fluxos não previstos.

Assim que você aprovar, atualizo `Status.md` e seguimos para a próxima tarefa do backlog, atualizando `backlog.md` conforme o fluxo. Deseja que eu registre este documento na governança do projeto agora? 

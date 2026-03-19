# Arquitetura de Banco

## Banco oficial
- PostgreSQL 17
- Prisma 7
- Driver `pg`

## Diretrizes
- modelagem orientada por dominio
- tabelas em `snake_case`
- chaves primarias estaveis
- timestamps obrigatorios quando fizer sentido operacional
- indices para filtros, busca operacional e conciliacao
- constraints para integridade antes de regras aplicacionais quando viavel

## Primeira modelagem

Primeira migration focada na base do modulo de clientes do MVP:

- `regions`
- `customers`
- enum de status de cliente

### `regions`
- representa agrupamento operacional e geografico
- permite organizar visitas, analise regional e futura expansao

Campos principais:
- `id`
- `name`
- `code`
- `description`
- `created_at`
- `updated_at`

### `customers`
- armazena o cadastro operacional minimo do assinante
- concentra os campos necessarios para cobranca recorrente e status

Campos principais:
- `id`
- `full_name`
- `document_id`
- `phone`
- `email`
- endereco basico
- `status`
- `monthly_fee`
- `due_day`
- `grace_days`
- `cutoff_days`
- `service_start_date`
- `region_id`
- `created_at`
- `updated_at`

## Integridade inicial
- `customers.region_id` referencia `regions.id`
- `customers.status` usa enum controlado
- `monthly_fee` deve ser maior que zero
- `due_day` deve ficar entre 1 e 31
- `grace_days` e `cutoff_days` nao podem ser negativos

## Indices iniciais
- indice por `customers.status`
- indice por `customers.due_day`
- indice composto por `customers.region_id` e `customers.status`

## Segunda modelagem

Segunda migration focada no inicio do modulo de pagamentos:

- `payments`
- enum de status de pagamento

### `payments`
- registra cada periodo de cobranca por cliente
- preserva valor esperado, valor recebido e status do pagamento
- sustenta historico mensal e futuras visoes financeiras

Campos principais:
- `id`
- `customer_id`
- `reference_month`
- `expected_amount`
- `received_amount`
- `status`
- `paid_at`
- `notes`
- `created_at`
- `updated_at`

## Integridade de pagamentos
- `payments.customer_id` referencia `customers.id`
- `reference_month` deve seguir o formato `YYYY-MM`
- `expected_amount` deve ser maior que zero
- `received_amount` nao pode ser negativo
- um cliente nao pode ter dois pagamentos para o mesmo `reference_month`

## Indices de pagamentos
- indice por `payments.status`
- indice por `payments.reference_month`
- indice composto por `payments.customer_id` e `payments.status`

## Terceira modelagem

Terceira migration focada na configuracao fiscal estimada do negocio:

- `tax_configs`

### `tax_configs`
- guarda a configuracao unica de imposto estimado da operacao
- sustenta calculos de imposto estimado no dashboard financeiro
- prepara a base para lembretes fiscais futuros

Campos principais:
- `id`
- `singleton_key`
- `regime_label`
- `estimated_rate`
- `due_day`
- `notes`
- `created_at`
- `updated_at`

## Integridade fiscal inicial
- `singleton_key` garante configuracao unica do negocio
- `estimated_rate` deve ser maior que zero e menor ou igual a 100
- `due_day` deve ficar entre 1 e 31

## Indices fiscais iniciais
- indice por `tax_configs.due_day`

## Quarta modelagem

Quarta migration focada no suporte operacional a agenda fiscal:

- `fiscal_reminders`
- enum `ReminderSeverity`

### `fiscal_reminders`
- registra obrigacoes fiscais e lembretes internos da operacao
- permite acompanhar vencimento, antecipacao do lembrete e resolucao
- sustenta a proxima camada de alertas fiscais

Campos principais:
- `id`
- `title`
- `description`
- `due_date`
- `reminder_date`
- `severity`
- `resolved_at`
- `created_at`
- `updated_at`

## Integridade de lembretes fiscais
- `reminder_date` nao pode ser posterior a `due_date`
- `severity` usa enum controlado
- datas de vencimento e lembrete sao obrigatorias

## Indices de lembretes fiscais
- indice por `fiscal_reminders.due_date`
- indice por `fiscal_reminders.reminder_date`
- indice por `fiscal_reminders.severity`

## Quinta modelagem

Quinta migration focada na captura de entradas bancarias para conciliacao:

- `bank_entries`
- enum `BankEntryStatus`

### `bank_entries`
- registra entradas financeiras vindas do banco ou conferidas manualmente
- permite separar valores ainda nao conciliados de valores ja vinculados
- prepara a base para conciliacao manual no proximo passo

Campos principais:
- `id`
- `amount`
- `occurred_at`
- `description`
- `reference_code`
- `source`
- `status`
- `payment_id`
- `created_at`
- `updated_at`

## Integridade de entradas bancarias
- `amount` deve ser maior que zero
- `status` usa enum controlado
- `payment_id` pode ser nulo ate a conciliacao

## Indices de entradas bancarias
- indice por `bank_entries.status`
- indice por `bank_entries.occurred_at`
- indice por `bank_entries.payment_id`

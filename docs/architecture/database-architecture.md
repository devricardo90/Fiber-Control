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

# Meu App

## Regra de registro
Este arquivo deve registrar, em ordem, cada acao executada no projeto.

Exemplos:
- criei o `package.json`
- criei o `tsconfig.json`
- baixei as dependencias
- configurei o ESLint
- configurei o Vitest

Sempre que uma nova acao for executada, ela deve ser adicionada aqui.

---

## Historico de acoes

1. Criei o [AGENTS.md](/C:/Users/ricardodev/Desktop/app-fiber-control/AGENTS.md) como documento central do projeto.
2. Criei a estrutura inicial de documentacao em `docs/`.
3. Criei os documentos principais de produto, arquitetura, regras e agentes.
4. Adicionei a documentacao de execucao do projeto em [execution.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/project/execution.md).
5. Consolidei as regras de negocio em [business-rules.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/product/business-rules.md).
6. Consolidei as regras de seguranca em [security.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/rules/security.md).
7. Consolidei as regras de testes em [testing.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/rules/testing.md).
8. Consolidei a arquitetura backend em [backend-architecture.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/architecture/backend-architecture.md).
9. Adicionei o Scalar como ferramenta complementar ao Swagger na documentacao do projeto.
10. Criei o [package.json](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/package.json) da API.
11. Criei o [tsconfig.json](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/tsconfig.json) da API.
12. Criei o [eslint.config.mjs](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/eslint.config.mjs) da API.
13. Criei o [vitest.config.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/vitest.config.ts) da API.
14. Criei a estrutura base de `src/` da API com [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts) e [server.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/server.ts).
15. Criei o primeiro teste automatizado da API em [health.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/health.spec.ts).
16. Vou alinhar as dependencias da API com Prisma 7, Fastify, Swagger e os pacotes oficiais definidos para o projeto.
17. Ajustei o [package.json](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/package.json) da API para incluir `@prisma/client`, `dotenv` e corrigir o campo `packageManager`.
18. Instalei as dependencias da API com `pnpm` e gerei o [pnpm-lock.yaml](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/pnpm-lock.yaml).
19. Alinhei o [package.json](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/package.json) com as versoes efetivamente resolvidas e defini `pnpm.onlyBuiltDependencies` para os pacotes que usam build scripts.
20. Executei o `build` da API com sucesso.
21. Executei o `test` da API com sucesso apos liberar a execucao do Vitest fora da restricao de sandbox.
22. Vou criar o `docker-compose.yml` da API para subir o PostgreSQL 17.9.
23. Criei o [docker-compose.yml](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/docker-compose.yml) da API com PostgreSQL 17.9.
24. Tentei subir o banco com `docker compose up -d`, mas a porta `5432` ja estava ocupada na maquina.
25. Ajustei o [docker-compose.yml](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/docker-compose.yml) para expor o PostgreSQL na porta `5440` do host.
26. Subi o container PostgreSQL com sucesso usando `docker compose up -d` na porta `5440`.
27. Criei o [apps/api/.env](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/.env) com a conexao local da API e do PostgreSQL.
28. Criei o [apps/api/.env.example](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/.env.example) para documentar as variaveis de ambiente.
29. Criei o [apps/api/.gitignore](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/.gitignore) para evitar commit de `.env`, `node_modules`, `dist` e `coverage`.
30. Vou substituir a base simples da API por uma estrutura com `env`, plugins e modulo de `health`, ajustando os pontos inconsistentes antes de adicionar.
31. Criei [src/config/env.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/config/env.ts) com validacao de ambiente usando `zod`.
32. Criei [src/plugins/cors.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/plugins/cors.ts) e [src/plugins/swagger.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/plugins/swagger.ts).
33. Criei o modulo de health em [health.schema.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/health/health.schema.ts) e [health.route.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/health/health.route.ts).
34. Reestruturei [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts) e [server.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/server.ts) para usar env, plugins e modulo de health.
35. Atualizei [apps/api/.env](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/.env) e [apps/api/.env.example](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/.env.example) para incluir `APP_NAME`.
36. Atualizei o teste [health.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/health.spec.ts) para a nova estrutura da API.
37. Executei novamente `pnpm build` com sucesso apos a reestruturacao da API.
38. Executei novamente `pnpm test` com sucesso apos a reestruturacao da API.
39. Vou inicializar o Prisma 7 na API e ajustar o setup para PostgreSQL com `@prisma/adapter-pg`.
40. Inicializei o Prisma na API, gerando [schema.prisma](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/schema.prisma) e [prisma.config.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma.config.ts).
41. Executei `pnpm prisma generate` e gerei o client do Prisma em `src/generated/prisma`.
42. Criei [src/lib/prisma.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/lib/prisma.ts) com o setup do Prisma 7 usando `@prisma/adapter-pg` e `pg`.
43. Adicionei `@types/pg` para manter o build TypeScript consistente com o setup do Prisma adapter.
44. Ajustei [src/lib/prisma.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/lib/prisma.ts) para usar `PrismaPg` com `connectionString`, evitando conflito de tipos entre versoes de `pg`.
45. Executei novamente `pnpm build` com sucesso apos o setup do Prisma 7.
46. Inicializei o repositório Git local do projeto com `git init`.
47. Criei o [/.gitignore](/C:/Users/ricardodev/Desktop/app-fiber-control/.gitignore) na raiz para ignorar dependencias, build artifacts, arquivos `.env` e a pasta espelhada `fiber-control/`.
48. Criei [continue.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/continue.md) com o estado atual e o proximo passo recomendado para retomada futura.
49. Vou integrar o Scalar na API, subir o servidor e validar `/health`, `/docs` e a interface do Scalar.
50. Criei [src/plugins/scalar.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/plugins/scalar.ts) para expor `/openapi.json`, `/scalar` e o script standalone do Scalar.
51. Atualizei [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts) para registrar o plugin do Scalar.
52. Criei [docs.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/docs.spec.ts) para validar Swagger UI, OpenAPI JSON e Scalar.
53. Ajustei o teste do Swagger para refletir o comportamento real do `@fastify/swagger-ui`, que responde `200` em `/docs`.
54. Executei os testes novamente e validei com sucesso `/health`, `/docs`, `/openapi.json` e `/scalar` no ambiente automatizado.
55. Subi a API em modo `pnpm dev` sem sandbox para contornar a restricao de `tsx/esbuild` no Windows.
56. Validei ao vivo `http://localhost:3000/health`, `http://localhost:3000/docs` e `http://localhost:3000/scalar` com sucesso.
57. Modelei a primeira base do Prisma em [schema.prisma](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/schema.prisma) com `regions`, `customers` e enum de status de cliente.
58. Gereei e apliquei a migration inicial [20260319121532_init_customers_foundation](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/migrations/20260319121532_init_customers_foundation/migration.sql) com indices e constraints de integridade.
59. Atualizei a documentacao de banco em [database-architecture.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/architecture/database-architecture.md) para registrar a primeira modelagem.
60. Criei o tratamento de erro padrao da API em [app-error.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/lib/app-error.ts) e [error-handler.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/plugins/error-handler.ts).
61. Criei o modulo inicial de customers com [customers.route.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.route.ts), [customers.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.service.ts), [customers.repository.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.repository.ts) e [customers.schema.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.schema.ts).
62. Registrei o modulo `customers` e o error handler em [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts).
63. Criei os testes de integracao de customers em [customers.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/customers.spec.ts) cobrindo criacao, validacao, conflito e listagem.
64. Expandi o ciclo de customers com `GET /customers/:id` e `PATCH /customers/:id`, incluindo busca por id, atualizacao parcial e validacoes de negocio.
65. Ampliei [customers.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/customers.spec.ts) para cobrir detalhe, update, conflito, payload vazio e regra `cutoffDays >= graceDays`.
66. Modelei o modulo de pagamentos no Prisma em [schema.prisma](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/schema.prisma) com `payments` e enum de status de pagamento.
67. Gereei e apliquei a migration [20260319124100_add_payments_module](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/migrations/20260319124100_add_payments_module/migration.sql) com constraints de periodo e valores.
68. Atualizei a documentacao de banco em [database-architecture.md](/C:/Users/ricardodev/Desktop/app-fiber-control/docs/architecture/database-architecture.md) para incluir a modelagem inicial de pagamentos.
69. Criei o modulo inicial de finance com [finance.route.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/finance/finance.route.ts), [finance.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/finance/finance.service.ts), [finance.repository.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/finance/finance.repository.ts) e [finance.schema.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/finance/finance.schema.ts).
70. Registrei a rota `GET /finance/overview` em [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts) para expor o primeiro resumo financeiro do MVP.
71. Criei os testes de integracao do resumo financeiro em [finance.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/finance.spec.ts) cobrindo calculo, validacao e caso sem pagamentos.
72. Criei o modulo inicial de alerts com [alerts.route.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/alerts/alerts.route.ts), [alerts.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/alerts/alerts.service.ts), [alerts.repository.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/alerts/alerts.repository.ts) e [alerts.schema.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/alerts/alerts.schema.ts).
73. Registrei a rota `GET /alerts/overview` em [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts) para diagnostico inicial de clientes em atraso, proximos do corte e pagamentos pendentes.
74. Criei os testes de integracao de alerts em [alerts.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/alerts.spec.ts) cobrindo visao com alertas, validacao e caso sem alertas.
75. Modelei a autenticacao inicial com `users` e `UserRole` em [schema.prisma](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/schema.prisma).
76. Adicionei o setup de autenticacao em [auth.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/lib/auth.ts) e [plugins/auth.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/plugins/auth.ts) com hash de senha e bearer token assinado.
77. Criei o modulo `auth` com [auth.route.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/auth/auth.route.ts), [auth.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/auth/auth.service.ts), [auth.repository.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/auth/auth.repository.ts) e [auth.schema.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/auth/auth.schema.ts).
78. Registrei as rotas `POST /auth/register`, `POST /auth/login` e `GET /auth/me` em [app.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/app.ts).
79. Atualizei [env.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/config/env.ts) e [apps/api/.env.example](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/.env.example) para incluir `AUTH_SECRET`.
80. Gereei e apliquei a migration [20260319125636_add_auth_users](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/prisma/migrations/20260319125636_add_auth_users/migration.sql) para criar `users` e `UserRole`.
81. Atualizei [swagger.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/plugins/swagger.ts) para expor o esquema `bearerAuth` no OpenAPI das rotas protegidas.
82. Criei o motor de regras de status em [customer-status.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customer-status.service.ts) para calcular `active`, `due_today`, `overdue` e `suspended` com base em vencimento, graca, corte e pagamentos.
83. Integrei o recálculo de status aos fluxos de customers e payments em [customers.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.service.ts) e [payments.service.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/payments/payments.service.ts).
84. Adicionei a rota `POST /customers/:id/recalculate-status` em [customers.route.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.route.ts) com contrato em [customers.schema.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/modules/customers/customers.schema.ts).
85. Ampliei os testes de customers e payments em [customers.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/customers.spec.ts) e [payments.spec.ts](/C:/Users/ricardodev/Desktop/app-fiber-control/apps/api/src/tests/payments.spec.ts) para cobrir overdue, suspended, due_today e reativacao para active.

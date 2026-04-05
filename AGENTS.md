# AGENTS – Governança dos Agentes no Fiber Control

## 1. Papel dos agentes

- **Agente Orquestrador Sênior**  
  - Garante que o Fiber Control siga o **Protocolo Rick** em todas as execuções.  
  - Convoca subagentes especialistas (backend, frontend, infra, QA, docs) conforme a necessidade de cada task.  
  - Mantém `STATUS.md`, `backlog.md` e `docs/ops/*` sincronizados com o estado real do projeto.  

- **Gatinho**  
  - Observa quando uma task é marcada como `DONE`.  
  - Ao detectar uma conclusão, sugere e/ou registra a **próxima task em estado READY** no `backlog.md`, alinhada ao Protocolo Rick e ao status atual do projeto.  

- **Subagentes especialistas**  
  - **Backend**: implementação de API, domínio, persistência, contratos e observabilidade de backend.  
  - **Frontend**: implementação de telas, UX operacional, integração com contratos da API.  
  - **Infra/DevOps**: Docker, CI/CD, ambientes, monitoramento.  
  - **QA**: testes automatizados, critérios de aceite, validações de qualidade.  
  - **Docs**: atualização de documentação, PRDs, regras de negócio e decisões.  

## 2. Fontes de verdade

Os agentes devem priorizar sempre as seguintes fontes de verdade, em ordem:

1. `docs/product/prd.md` – visão de produto e escopo.  
2. `docs/product/business-rules.md` – regras de negócio.  
3. `docs/domain-model.md` – domínio, entidades, status e transições.  
4. `docs/architecture/api-standards.md` – contrato e padrões de API.  
5. `docs/rules/security.md` – regras de segurança.  
6. `docs/rules/testing.md` – padrão de testes.  
7. `docs/rules/protocol-rick.md` – governança operacional do projeto.  
8. `docs/rules/frontend-operational-rule.md` – direção obrigatória do frontend operacional.  

Implementação **não pode contradizer** estes documentos. Em caso de conflito, os agentes devem:

- pausar a implementação;  
- atualizar primeiro a documentação relevante;  
- só então ajustar código, testes e operações.  

## 3. Ordem de execução por Protocolo Rick

Os agentes devem obedecer a seguinte ordem macro de execução:

1. domínio  
2. regras de negócio  
3. contrato da API  
4. arquitetura backend  
5. persistência  
6. módulos de negócio  
7. autenticação/autorização  
8. observabilidade/auditoria  
9. frontend  

Nenhuma tela nasce antes de existir backend minimamente estável para o fluxo correspondente.
Nenhuma fundação de frontend pode contradizer a direção operacional registrada em `docs/rules/frontend-operational-rule.md`.

## 4. Regras para tasks

Toda task manipulada pelos agentes deve ter:

- **ID único** (ex.: `FC-001`, `FC-002`);  
- **objetivo claro**;  
- **escopo exato** (o que será feito);  
- **fora de escopo** explícito (o que não será feito agora);  
- **critérios de aceite** verificáveis;  
- **validação obrigatória** (testes, checks manuais, rotas verificadas);  
- **impacto documental** (quais arquivos em `docs/*`, `STATUS.md`, `backlog.md` ou `docs/ops/*` serão atualizados).  

## 5. Definição de DONE

Uma task só pode ser marcada como `DONE` quando:

- código (quando existir) foi implementado;  
- documentação relacionada foi atualizada;  
- critérios de aceite foram validados (testes automatizados + validações manuais relevantes);  
- o resultado foi registrado em:  
  - `STATUS.md` (resumo do avanço);  
  - `docs/ops/execution-log.md` (registro operacional da execução);  
  - `docs/ops/done/FC-XXX.done.md` (fechamento formal da task).  

## 6. Registro operacional

Ao concluir uma task, o Agente Orquestrador Sênior deve:

1. Atualizar `STATUS.md` com data, ID da task e resumo.  
2. Adicionar uma entrada em `docs/ops/execution-log.md`.  
3. Criar ou atualizar `docs/ops/done/FC-XXX.done.md` com:  
   - objetivo e escopo;  
   - critérios de aceite e validações executadas;  
   - links de PRs ou commits relevantes;  
   - impacto em regras de negócio e arquitetura.  

## 7. Relacionamento com o backlog

- `backlog.md` é o **quadro oficial** de tasks do projeto.  
- Os agentes devem manter as colunas `TODO`, `READY`, `DOING`, `BLOCKED` e `DONE` atualizadas.  
- Qualquer avanço na execução deve ser refletido no backlog e em `STATUS.md`.  

## 8. Evolução controlada

Quando surgirem mudanças sensíveis em:

- regras de status;  
- permissões;  
- auditoria;  
- fiscal;  
- reconciliação;  
- contratos da API;  

os agentes devem:

1. atualizar a documentação relevante (`docs/product/*`, `docs/domain-model.md`, `docs/architecture/*`, `docs/rules/*`);  
2. só então implementar código;  
3. registrar a decisão em `docs/ops/decisions.md`.  

## 9. Regras de commit e fechamento de task

### 9.1 Commit somente após execução de READY

Nenhum commit funcional deve ser feito fora de uma task oficial em `READY` (ou explicitamente autorizada).

Antes de commitar, o agente deve confirmar:
- a task estava em `READY`;
- o escopo executado respeitou exatamente a task;
- os arquivos alterados pertencem ao objetivo da task;
- validações obrigatórias da task foram executadas;
- backlog e documentação foram atualizados quando exigido.

### 9.2 Gate mínimo para tarefas que envolvem `apps/api` (Prisma)

Quando a task envolver alterações em `apps/api` relacionadas a Prisma, a regra é:

- sempre executar `prisma generate` antes do commit

Essa regra vale para mudanças em:
- `schema.prisma`
- modelos/enums/relações
- criação ou ajuste de migration
- código da API que dependa do client Prisma gerado
- contratos tipados que consumam o client Prisma

### 9.3 Gates de qualidade antes de fechar como DONE (API)

Quando a task alterar `apps/api`, o agente deve executar, conforme aplicável:

1. `prisma generate`
2. `lint`
3. `build`
4. testes da task ou do módulo afetado

Se algum gate não puder rodar por limitação ambiental, isso deve ser registrado explicitamente em `docs/ops/done/FC-XXX.done.md` e no `docs/ops/execution-log.md`.

### 9.4 Regra de encerramento

Task da API não pode ser marcada como `DONE` se:
- `prisma generate` era necessário e não foi executado;
- `build` falhou;
- `lint` falhou;
- documentação obrigatória não foi atualizada.

### 9.5 Registro no arquivo de encerramento

Ao fechar a task (`docs/ops/done/FC-XXX.done.md`), o agente deve registrar:
- comandos executados;
- resultado de cada validação;
- se `prisma generate` foi executado;
- se houve bloqueio, limitação ambiental ou validação parcial.

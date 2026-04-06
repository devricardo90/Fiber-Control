# Protocolo Rick — Fiber Control

## 1. Objetivo do protocolo neste projeto

O Protocolo Rick no Fiber Control serve para garantir que:

- o projeto avance com **ordem**;  
- **regras de negócio venham antes das telas**;  
- o **backend seja construído com contrato claro**;  
- cada **task tenha escopo fechado**;  
- nada seja marcado como concluído sem **validação real**;  
- **backlog, status e documentação** fiquem sempre sincronizados.  

O foco do Fiber Control é **produto operacional e financeiro**, com forte dependência de:

- domínio;  
- regras;  
- auditoria;  
- consistência de dados.  

## 2. Princípios do Fiber Control no Protocolo Rick

### 2.1 Fonte de verdade

A documentação central governa o projeto. Implementação **não pode contradizer**:

- `docs/product/prd.md`  
- `docs/product/business-rules.md`  
- `docs/domain-model.md`  
- `docs/architecture/api-standards.md`  
- `docs/rules/security.md`  
- `docs/rules/testing.md`  

Se houver conflito entre código e documentação, a prioridade é:

1. corrigir ou atualizar a documentação;  
2. alinhar o código ao que está documentado;  
3. registrar a decisão em `docs/ops/decisions.md`.  

### 2.2 Ordem de execução

A ordem oficial de construção é:

1. domínio  
2. regras de negócio  
3. contrato da API  
4. arquitetura backend  
5. persistência  
6. módulos de negócio  
7. autenticação/autorização  
8. observabilidade/auditoria  
9. frontend  

Nenhuma tela nasce antes do backend estar minimamente estável para o fluxo correspondente.

### 2.3 Task pequena, verificável e rastreável

Toda task deve ter:

- **ID único** (ex.: `FC-001`);  
- **objetivo** claro;  
- **escopo exato** (o que entra agora);  
- **fora de escopo** explícito;  
- **critérios de aceite** verificáveis;  
- **validação obrigatória** (testes + checagens manuais quando necessário);  
- **impacto documental** (quais arquivos e seções serão atualizados).  

### 2.4 Nada de “done” por impressão

Uma task só vira `DONE` quando:

- código foi implementado (quando houver código na task);  
- documentação foi atualizada;  
- validações definidas rodaram com sucesso (testes, checks manuais, rotas verificadas);  
- resultado foi registrado em:  
  - `STATUS.md`;  
  - `docs/ops/execution-log.md`;  
  - `docs/ops/done/FC-XXX.done.md`.  

Quando a task envolver `apps/api` e/ou Prisma, `DONE` também exige os gates mínimos definidos em `AGENTS.md` (incluindo `prisma generate` antes de commitar e a execução de `lint`/`build`/testes, quando aplicável).

### 2.5 Mudanças sensíveis exigem governança

Qualquer mudança em:

- regras de status;  
- permissões;  
- auditoria;  
- fiscal;  
- reconciliação;  
- contratos da API;  

deve **atualizar a documentação antes ou junto da implementação**.  

Além disso, a decisão deve ser registrada em `docs/ops/decisions.md` com:

- contexto;  
- alternativa escolhida;  
- impacto esperado;  
- data e responsável.  

### 2.6 Backend primeiro

O Fiber Control é um sistema operacional/financeiro.  

Logo, a prioridade é:

1. **robustez de domínio**;  
2. **consistência de dados**;  
3. contratos de API claros e estáveis.  

Camadas de frontend e UX só avançam em cima de contratos e estados já acordados no domínio.

### 2.7 Named Localhost Convention

Sempre que viável, o projeto deve preferir localhost nomeado como padrão recomendado de desenvolvimento local.

Padrão recomendado:
- `web.<project>.localhost`
- `api.<project>.localhost`
- `admin.<project>.localhost`

Regra:
- a identidade local principal do projeto deve ser o nome do projeto, não a porta

Benefícios:
- reduzir colisão de portas entre projetos simultâneos
- diminuir trocas de env para URLs locais
- aumentar previsibilidade para auth, CORS, callbacks e documentação

Fallback:
- quando Portless ou localhost nomeado não for viável no ambiente atual, `localhost:<porta>` continua permitido de forma explícita e documentada

## 3. Estrutura de governança recomendada

Estrutura de referência (sem exigir renomear o que já existe):

```text
fiber-control/
  AGENTS.md
  README.md
  STATUS.md
  backlog.md
  docs/
    product/
      prd.md
      business-rules.md
      (domain.md – opcional; hoje o domínio está em docs/domain-model.md)
    architecture/
      api-standards.md
      (backend-architecture.md – futuro)
      (data-model.md – futuro)
    rules/
      security.md
      testing.md
      protocol-rick.md
    ops/
      execution-log.md
      decisions.md
      done/
        FC-001.done.md
        FC-002.done.md
  apps/
    api/
  packages/
```

### 3.1 Papel de cada artefato

- **`AGENTS.md`**: governa o comportamento dos agentes (orquestrador, Gatinho, subagentes).  
- **`STATUS.md`**: mostra a fotografia atual do projeto (o que já foi entregue).  
- **`backlog.md`**: lista tasks em colunas `TODO`, `READY`, `DOING`, `BLOCKED`, `DONE`.  
- **`docs/rules/protocol-rick.md`**: define o protocolo operacional do projeto (este arquivo).  
- **`docs/ops/execution-log.md`**: guarda histórico resumido das execuções (por task).  
- **`docs/ops/decisions.md`**: guarda decisões arquiteturais e de produto (ADR leve).  
- **`docs/ops/done/*.done.md`**: fecha formalmente cada task concluída.  

## 4. Modelo de task no Protocolo Rick

Formato recomendado para cada task do backlog:

```markdown
- **FC-001 – Título da task**
  - **Objetivo**: ...
  - **Escopo**: ...
  - **Fora de escopo**: ...
  - **Critérios de aceite**:
    - ...
  - **Validação obrigatória**:
    - ...
  - **Impacto documental**:
    - ...
```

Esse modelo deve ser usado em todas as colunas (`TODO`, `READY`, `DOING`, `BLOCKED`, `DONE`), adaptando o texto conforme o estado.

## 5. Fluxo de execução

1. Ideias e épicos são descritos em nível macro (ex.: Sprints, blocos de maturidade).  
2. O Agente Orquestrador quebra épicos em **tasks FC-XXX** seguindo a ordem do Protocolo Rick.  
3. Tasks são movidas para `READY` quando:  
   - estão completamente descritas no modelo de task;  
   - não dependem de decisões pendentes.  
4. Ao iniciar uma execução, a task sai de `READY` para `DOING`.  
5. Ao encontrar bloqueios externos, a task vai para `BLOCKED` com motivo explícito.  
6. Ao concluir, a task vai para `DONE`, com:  
   - registros em `STATUS.md`;  
   - entrada em `docs/ops/execution-log.md`;  
   - arquivo `docs/ops/done/FC-XXX.done.md`.  
7. O Gatinho sugere a próxima `READY` em sequência, respeitando a ordem de execução.  

## 6. Relação com os documentos já existentes

O Protocolo Rick **não substitui** os documentos atuais; ele os organiza:

- `docs/product/prd.md` define o **produto** e o **porquê**.  
- `docs/product/business-rules.md` define **como o negócio deve se comportar**.  
- `docs/domain-model.md` trava o **vocabulário de domínio** (entidades, status, transições).  
- `docs/architecture/api-standards.md` define **como a API se comporta**.  
- `docs/rules/security.md` define **como manter o sistema seguro**.  
- `docs/rules/testing.md` define **como garantir qualidade técnica**.  
- `docs/rules/protocol-rick.md` (este arquivo) define **como o projeto é operado**.  

Task nenhuma deve ignorar esses documentos; qualquer exceção precisa ser registrada em `docs/ops/decisions.md`.

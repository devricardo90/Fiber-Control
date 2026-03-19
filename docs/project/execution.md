# Execucao do Projeto

## Objetivo
Este documento registra decisoes praticas de execucao e operacao do projeto Fiber Control.

Ele deve concentrar preferencias, padroes e instrucoes que facilitem o desenvolvimento consistente entre ambiente local, agentes e futuras automacoes.

---

## 1. Preferencias oficiais atuais

### Gerenciador de pacotes oficial
- usar `pnpm`

### Linguagem principal
- usar TypeScript no backend e no frontend

### Banco oficial
- PostgreSQL 17

### Runtime oficial
- Node.js 24

---

## 2. Preferencia de URLs locais

Este projeto prefere ambiente local com enderecamento por nome do app, em vez de `localhost` com portas explicitas.

### Preferencia oficial
Exemplos desejados:
- `fiber-control.local`
- `api.fiber-control.local`
- `web.fiber-control.local`

### Objetivos dessa escolha
- deixar o ambiente local mais limpo
- aproximar a experiencia local de um dominio real
- facilitar autenticacao, cookies e callbacks
- organizar melhor multiplos servicos
- evitar dependencia mental de URLs com porta no dia a dia

### Observacao importante
Internamente, os servicos ainda podem rodar em portas locais.
O acesso humano ao projeto deve preferir nomes de app via proxy local.

A estrategia exata de proxy local sera definida depois.

Possiveis opcoes futuras:
- Caddy
- Traefik
- Nginx

---

## 3. Regras de operacao

- sempre usar os scripts oficiais do projeto
- evitar comandos improvisados fora do padrao documentado
- novas decisoes de execucao devem ser adicionadas aqui
- este documento deve evoluir conforme a base tecnica for sendo construida

---

## 4. Preferencias de fluxo

### Backend primeiro
A implementacao deve comecar pelo backend.

Ordem preferida:
1. documentacao e regras
2. fundacao da API
3. banco e migrations
4. modulos principais
5. autenticacao
6. frontend
7. integracao final

### Teste junto da entrega
Cada avanco tecnico relevante deve vir acompanhado de teste automatizado.

---

## 5. Preferencias de ambiente local

### Meta do ambiente local
O ambiente local deve ser:
- previsivel
- reproduzivel
- limpo
- proximo do comportamento real de produto

### Direcao atual
- usar `pnpm`
- preferir nomes locais do app
- usar Docker para servicos de infraestrutura
- evitar dependencias manuais desnecessarias na maquina

---

## 6. Pontos para manter atualizados neste documento

Adicionar aqui sempre que uma decisao operacional for tomada, por exemplo:
- padrao oficial de portas internas
- convencao de nomes para variaveis de ambiente
- scripts principais de bootstrap
- fluxo de Docker
- estrategia de proxy local
- como subir backend e frontend
- comandos oficiais de teste
- fluxo de autenticacao local
- padrao de URLs do Swagger
- padrao de URLs do Scalar
- padrao de hostnames locais

---

## 7. Proximos itens a definir
Os seguintes pontos devem ser detalhados depois:
- hostname oficial da API local
- hostname oficial do frontend local
- proxy local oficial
- padrao de certificados locais se necessario
- convencao final de scripts `pnpm`
- estrategia oficial de `.env`
- ordem de inicializacao dos servicos

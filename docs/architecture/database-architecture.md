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

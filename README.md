# Fast-Feet API

Bem-vindo ao repositório da API Fast-Feet! Esta API foi desenvolvida com NestJS e é responsável por gerenciar pedidos de entrega entre entregadores e destinatários.

## Funcionalidades

- Cadastro e gerenciamento de usuários (admin, entregadores e destinatários)
- Cadastro e gerenciamento de encomendas
- Gerenciamento de problemas com entregas
- Autenticação e autorização de usuários

## Arquitetura e Tecnologias

Esta API foi desenvolvida seguindo os princípios de SOLID, DDD (Domain-Driven Design) e Clean Architecture. Além disso, ela inclui:

- Testes unitários e de integração (Vitest)
- Testes end-to-end (Supertest)
- Docker para facilitar a configuração e execução do banco de dados PostgreSQL

## Como Começar

1. **Instalação das Dependências**

```bash
  npm i
```

2. **Configuração do Banco de Dados**

Certifique-se de ter o Docker instalado e execute o seguinte comando para iniciar o PostgreSQL:

```bash
  docker compose up -d
```


3. **Configuração do Ambiente**

Renomeie o arquivo `.env.example` para `.env` e o `.env.test.example` para `.env.test` e configure as variáveis de ambiente conforme necessário.

4. **Execução da Aplicação**

```bash
  npm run start:dev
```


## Testes

Para executar os testes unitários:

```bash
  npm run test
```

Para os testes end-to-end, certifique-se de ter a aplicação em execução e execute:

```bash
  npm run test:e2e
```
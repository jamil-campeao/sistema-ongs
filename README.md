# Documentação do Colabora

## 1. Visão Geral do Projeto
Este projeto é uma plataforma para gestão e conexão entre ONGs, Voluntários e Doadores. O sistema é construído como um monorepo contendo Backend (API REST) e Frontend (Aplicação Web), orquestrados via Docker.

**Hospedagem Atual**: VM na Hostinger, utilizando Docker Compose para orquestração e Cloudflare Tunnel para exposição segura dos serviços.

---

## 2. Stack Tecnológico

### 2.1 Backend (`/backend`)
*   **Linguagem**: Node.js
*   **Framework**: Express.js
*   **ORM**: Prisma
*   **Banco de Dados**: PostgreSQL 17.4
*   **Autenticação**: JWT (JSON Web Tokens) + BCrypt
*   **Testes**: Vitest, Supertest, Faker
*   **Monitoramento**: Prometheus Client, Sentry
*   **Arquitetura**: MVC (Model-View-Controller) simplificado (Routes -> Controllers -> Prisma)

### 2.2 Frontend (`/frontend`)
*   **Framework**: Next.js 15 (App Router)
*   **Linguagem**: TypeScript
*   **Estilização**: Tailwind CSS, PostCSS
*   **Componentes UI**: Radix UI (Headless), Lucide React (Ícones)
*   **Formulários**: React Hook Form + Zod (Validação)
*   **Gráficos**: Recharts
*   **Monitoramento**: Sentry
*   **Testes**: Vitest, React Testing Library

### 2.3 Infraestrutura & DevOps
*   **Containerização**: Docker & Docker Compose
*   **Proxy/Tunnel**: Cloudflare Tunnel (`cloudflared`)
*   **Monitoramento**:
    *   **Prometheus**: Coleta de métricas.
    *   **Grafana**: Visualização de dashboards.
*   **CI/CD**: GitHub Actions (Workflows para Node.js e SonarQube).
*   **Qualidade de Código**: SonarQube.

---

## 3. Arquitetura do Sistema

### 3.1 Modelo de Dados (Prisma Schema)
O banco de dados PostgreSQL gerencia as seguintes entidades principais:
*   **Users**: Usuários do sistema (Admin, Voluntários, Colaboradores).
*   **Ongs**: Organizações cadastradas.
*   **Projects**: Projetos criados pelas ONGs.
*   **Posts/Comments/Likes**: Funcionalidades de rede social.
*   **Contributions**: Registro de atividades de voluntariado.
*   **Associações**: Relacionamentos entre Usuários, ONGs e Projetos.

### 3.2 Fluxo de Dados
1.  O **Frontend** (Next.js) consome a API REST do Backend.
2.  O **Backend** (Express) processa as requisições, valida dados e interage com o **PostgreSQL** via Prisma.
3.  O **Cloudflare Tunnel** expõe a aplicação para a internet sem necessidade de abrir portas no firewall da VM.

---

## 4. Configuração e Instalação

### 4.1 Pré-requisitos
*   Docker e Docker Compose instalados.
*   Node.js (v20+ recomendado) para desenvolvimento local.

### 4.2 Variáveis de Ambiente
Crie um arquivo `.env` na raiz (ou nas pastas respectivas) baseando-se no `.env.example`.
Variáveis críticas:
*   `DATABASE_URL`: Connection string do PostgreSQL.
*   `JWT_SECRET`: Chave para assinatura de tokens.
*   `CLOUDFLARE_TOKEN`: Token do túnel Cloudflare.

### 4.3 Executando com Docker (Recomendado)
Para subir todo o ambiente (Banco, Backend, Frontend, Monitoramento):

```bash
docker-compose up -d --build
```

Isso iniciará os seguintes serviços:
*   `postgres`: Porta 5432
*   `backend`: Porta 3000
*   `frontend`: Porta 3001
*   `prometheus`: Porta 9090
*   `grafana`: Porta 3003
*   `cloudflared`: Tunnel (sem porta exposta localmente)

### 4.4 Desenvolvimento Local
**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 5. Estrutura de Pastas

```
/
├── backend/                # API Node.js
│   ├── src/
│   │   ├── controllers/    # Lógica de controle
│   │   ├── routes/         # Definição de rotas
│   │   ├── db/             # Configuração do DB
│   │   └── app.js          # Entrypoint do Express
│   ├── prisma/             # Schema e Migrations
│   └── Dockerfile
├── frontend/               # Aplicação Next.js
│   ├── src/                # Código fonte (Pages/Components)
│   └── Dockerfile
├── monitoring/             # Configurações de Observabilidade
│   ├── prometheus/
│   └── grafana/
├── .github/workflows/      # Pipelines de CI/CD
└── docker-compose.yml      # Orquestração dos containers
```

---

## 6. Monitoramento e Qualidade

*   **Sentry**: Configurado no Backend e Frontend para rastreamento de erros em tempo real.
*   **SonarQube**: Análise estática de código configurada via `sonar-project.properties` e GitHub Actions.
*   **Prometheus/Grafana**: Métricas de infraestrutura e performance da aplicação.

## 7. Melhorias Futuras
1.  **Camada de Service**: Reforçar a separação de regras de negócio movendo lógica dos Controllers para Services.
2.  **Testes E2E**: Implementar testes End-to-End (ex: Playwright) para fluxos críticos no Frontend.
3.  **Cache**: Implementar Redis para cache de rotas frequentes.
4.  **Documentação API**: Adicionar Swagger/OpenAPI para documentar os endpoints do Backend.

# Multi-Vendor Marketplace

A small Daraz-style marketplace where multiple sellers list products and buyers purchase from different sellers in a single checkout.

| Part | Stack | Owner |
|------|-------|-------|
| `frontend/` | Next.js + TypeScript + Tailwind CSS | Frontend developer |
| `services/` | Node.js + Express + TypeScript microservices, PostgreSQL + Prisma, Redis, Zod | S M Shible Sadik |

## Repo layout

```
packages/common/   shared middleware: auth, roles, service auth, validation, rate limit, base app
services/    auth, catalog, cart, inventory, order (one DB each)
infra/       Postgres init scripts
frontend/    Next.js app
docs/        plan, day-by-day notes, ERD, API contract
.github/     PR + issue templates
docker-compose.yml   local PostgreSQL
```

## Quick start (local environment)

Prerequisites: Node.js 20+, npm 10+, Docker (for PostgreSQL), Git.

```bash
git clone https://github.com/shiblesadik603/multiVendorE_commerce.git
cd multiVendorE_commerce
docker compose up -d postgres redis      # infra (or `docker compose up -d --build` for all services)
npm install                                   # installs all services + packages/common (and builds it)
cd services/auth-service
cp .env.example .env && npx prisma migrate deploy && npm run dev   # http://localhost:4001
npm test                                      # or `npm test` at the repo root for everything
cp frontend/.env.example frontend/.env.local   # from repo root
```

Services and ports: auth 4001, catalog 4002, cart 4003, inventory 4004, order 4005. See [service diagram](docs/architecture/services.md).

## Project docs

- [30-day plan and progress](docs/plan/30-day-plan.md) (microservices plan)
- [Architecture report](docs/architecture/ARCHITECTURE_REPORT.md) · [Security baseline](docs/architecture/security.md)
- [Service diagram](docs/architecture/services.md) · [ERD per service](docs/architecture/erd.md) · [OpenAPI specs](docs/api/common.md) · [Frontend auth notes](docs/api/frontend-auth-integration.md)
- [Daily log](docs/DAILY_LOG.md)
- [Day 1: MVP scope](docs/day-01/mvp-scope.md) · [User journeys](docs/day-01/user-journeys.md) · [Screens](docs/day-01/screens.md)
- [Day 1: Database tables](docs/day-01/database-tables.md) · [API naming](docs/day-01/api-naming.md)
- [Contributing / team workflow](CONTRIBUTING.md)

## Rules

Never commit `.env` files or secrets. Work on small feature branches and open a PR into `main`.

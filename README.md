# Multi-Vendor Marketplace

A small Daraz-style marketplace where multiple sellers list products and buyers purchase from different sellers in a single checkout.

| Part | Stack | Owner |
|------|-------|-------|
| `frontend/` | Next.js + TypeScript + Tailwind CSS | Frontend developer |
| `backend/`  | Node.js + Express + TypeScript, PostgreSQL + Prisma, Zod | S M Shible Sadik |

## Repo layout

```
backend/     REST API (modular monolith)
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
docker compose up -d            # PostgreSQL on localhost:5432
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Backend and frontend apps are scaffolded on Day 3 (see the plan); their run instructions will be added to `backend/README.md` and `frontend/README.md`.

## Project docs

- [30-day plan and progress](docs/plan/30-day-plan.md)
- [Daily log](docs/DAILY_LOG.md)
- [Day 1: MVP scope](docs/day-01/mvp-scope.md) · [User journeys](docs/day-01/user-journeys.md) · [Screens](docs/day-01/screens.md)
- [Day 1: Database tables](docs/day-01/database-tables.md) · [API naming](docs/day-01/api-naming.md)
- [Contributing / team workflow](CONTRIBUTING.md)

## Rules

Never commit `.env` files or secrets. Work on small feature branches and open a PR into `main`.

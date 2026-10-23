# Daily log

## Day 1 (original monolith plan)
- Repo, environment files, MVP scope, journeys, screens. See `docs/day-01/`.

## Plan change: microservices
The team switched to `microservices_marketplace_30_day_plan_multi_server`. Frontend was already at Day 4 (branch `initial_homepage`), so backend caught up through Day 4 on branch `backend/day-01-04-microservices`.

## Backend Days 1-4 (new plan)
- **Day 1:** `services/` layout, `docker-compose.yml` (Postgres, Redis, services), `.env.example` per service, `/health` + `/ready`, API/error conventions (`docs/architecture/services.md`).
- **Day 2:** service diagram, ERD per service (`docs/architecture/erd.md`), OpenAPI for Auth/Catalog/Cart/Order (`docs/api/`).
- **Day 3:** TypeScript service template (auth, catalog, cart, inventory, order), Dockerfiles, one database per service (`infra/postgres/init.sql`), lint/test scripts, graceful shutdown, stateless config via env.
- **Day 4:** auth-service: register, login (email or phone), refresh-token rotation, logout, `/me`, bcrypt hashing, access JWT (15 min) + httpOnly refresh cookie, role middleware, rate limit, 13 passing tests.
- **Frontend contract note:** see `docs/api/frontend-auth-integration.md`.
- **Next (Day 5):** central auth middleware shared by services, service-to-service auth, CORS/HTTP security, Redis-ready rate limit.

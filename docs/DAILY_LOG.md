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

## Backend Day 5 (security baseline)
- New shared package `packages/common`: `createBaseApp/finalizeApp`, `requireAuth`, `requireRole`, service-to-service tokens (`requireService`, `serviceHeaders`), Zod `validate`, env/secret validation, Redis `rateLimit` with in-memory fallback.
- auth-service and the four placeholder services now use it (removed duplicated middleware).
- Auth login/register/refresh rate limit is Redis-backed (shared across instances), returns 429 + `Retry-After`.
- Repo is now an npm workspace; one parameterized Dockerfile (`infra/docker/service.Dockerfile`); compose passes shared dev secrets and Redis URL.
- Tests: common 15, auth 13, placeholders 4 (all passing). Docs: `docs/architecture/security.md`, `ARCHITECTURE_REPORT.md`.
- **Next (Day 6):** catalog-service: categories, product CRUD, status, pagination, filters, ownership checks - shaped to the frontend's Product card/detail needs.

## Backend Day 6 (catalog service)
- catalog-service (Prisma, `catalog_db`): categories, products, product images, seller profiles; migrations incl. base categories.
- Public API: categories; product list (search, category slug, price range, sort, pagination, limit<=50); product detail. Only ACTIVE + approved products from approved sellers are visible.
- Seller API (role SELLER): list own, create, get, edit, archive, activate. **Ownership enforced in the query** (other sellers' products -> 404). Suspended sellers blocked (403).
- Matched to the frontend: field names `title/price/category/imageUrl/seller`, six category slugs, archive/activate for the Active/Archived toggle. Price = integer minor units.
- Prisma client now generated per service (`src/generated/prisma`) so two Prisma services do not overwrite each other.
- Verified end to end: a seller token issued by auth-service works on catalog-service.
- Tests: catalog 19 (+ common 15, auth 13, placeholders 3) passing. Docs: `catalog.openapi.yaml`, `frontend-catalog-integration.md`, `function-reference.md`.
- **Next (Day 7):** catalog API tests extension, DB indexes review, demo seed products, image URL contract, publish OpenAPI.

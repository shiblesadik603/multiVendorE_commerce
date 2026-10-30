# 30-day plan (microservices version)

Source: `microservices_marketplace_30_day_plan_multi_server`. 2 people, 2 h/day each. FE = frontend (partner), BE = backend (S M Shible Sadik). ✅ = done and pushed.

Requirements highlights: ≥2 stateless instances behind a load balancer, Redis for shared cache + rate limits, DB is the source of truth for stock/orders, idempotent checkout, transactional outbox before any Kafka, README with service diagram, test results and load-test setup.

| Day | Frontend | Backend |
|---|---|---|
| 1 ✅ | Scope, journeys, success criteria | Repo layout, Docker Compose, env example, health endpoint, API/error conventions |
| 2 ✅ | Wireframes, contracts | Service diagram, ERD per service, OpenAPI for Auth/Catalog/Cart/Order |
| 3 ✅ | Next.js + TS + Tailwind shell, routes | TS service template, Dockerfiles, Compose, per-service DBs |
| 4 ✅ | Login/register screens, validation, auth states | Auth service: hashing, access/refresh tokens, logout, roles, tests |
| 5 ✅ | Protected nav, role-based UI | Central auth middleware, service-to-service auth, Zod, CORS/HTTP security, auth rate limit |
| 6 ✅ | Home + listing (mock), cards, loading | Catalog: categories, product CRUD, status, pagination, filters, ownership |
| 7 | Product details page | Catalog API tests, indexes, seed data, image contract, publish OpenAPI |
| 8 | Search/filter/sort + URL params | Postgres search/filter baseline, pagination limits |
| 9 | Seller dashboard + product forms | Seller profile/approval, ownership, admin approve/hide |
| 10 | Cart page | Cart service + persistence, validate against catalog |
| 11 | Checkout form + summary | Checkout contract, order state model, inventory reservation API, idempotency |
| 12 | Confirmation + stock errors | Inventory service: atomic reservation, expiry, concurrency tests |
| 13 | Buyer orders + timeline | Order service: parent + seller suborders, orchestration, compensation |
| 14 | COD selection + confirmation | Payment/COD module, status model, idempotent webhook skeleton |
| 15 | Seller order list + status UI | Seller-order endpoints, transitions, ownership, contract tests |
| 16 | Refresh/polling for status | Transactional outbox + worker, retries, dedup, dead-letter |
| 17 | Refresh after product edits | Redis cache-aside for catalog, TTL + invalidation |
| 18 | Friendly 429 state | Redis distributed rate limiting + Retry-After |
| 19 | Consistent API error handling | Gateway/reverse proxy, LB health checks, timeouts, correlation IDs |
| 20 | Admin UI | Admin endpoints, audit log, pagination/filters |
| 21 | Security route tests | Auth/IDOR/validation/rate-limit/secret-leak tests |
| 22 | Integration test of buyer journey | Cross-service integration tests, timeouts, rollback |
| 23 | Error page, request display | Structured logs, metrics, readiness, instance identity |
| 24 | Demo accounts + scripted buyer flow | Seed data, k6 baseline, multi-instance load test |
| 25 | Remove slow screens/duplicate calls | EXPLAIN ANALYZE, indexes, pool limits, fix top 2 bottlenecks |
| 26 | Deploy frontend | Deploy ≥2 instances behind LB, TLS, secrets, autoscaling policy, managed PG/Redis |
| 27 | E2E QA on deployed URL | Stock race, duplicate checkout, Redis outage, queue retry, instance kill |
| 28 | Bug fixes + screenshots | DB backups + restore drill |
| 29 | README user guide + walkthrough | Regression, dependency/security scan, docs |
| 30 | Demo | Demo boundaries, cache/rate limit, concurrency, load balancing, scale-out/in |

Superseded: the original monolith plan and `docs/day-01/*` (still valid for scope, journeys, screens and API naming).

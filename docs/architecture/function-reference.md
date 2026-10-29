# Function reference (backend)

## Day 5: `packages/common/src`
| Function | File | Purpose |
|---|---|---|
| `createBaseApp(opts)` | app.ts | Express app with request ids, JSON access log, helmet, CORS allowlist, 10 KB limit, `/health`, `/ready` |
| `finalizeApp(app, name)` | app.ts | 404 handler + the single error formatter (Zod→422, AppError→its status, bad JSON→400, too large→413, else safe 500) |
| `requireAuth(secret)` | auth.ts | Verify Bearer JWT (HS256), set `req.user` |
| `requireRole(...roles)` | auth.ts | 401 if anonymous, 403 if wrong role |
| `signServiceToken`, `serviceHeaders`, `requireService` | serviceAuth.ts | 60 s service-to-service token, headers builder, protecting internal endpoints |
| `validate({body,query,params})` | validate.ts | Zod parse, replaces raw values with cleaned ones |
| `secretSchema`, `parseEnv` | env.ts | Fail-fast env/secret validation |
| `rateLimit(opts)`, `closeRateLimiters()` | rateLimit.ts | Redis fixed-window limiter with memory fallback; 429 + `Retry-After` |
| `AppError` | errors.ts | status + code + message + details |

## Day 4: `services/auth-service/src/modules/auth`
`register`, `login`, `refresh`, `logout`, `getUser`, `issueTokens`, `signAccessToken`, `toPublicUser`, `sendSession`, `registerSchema`, `loginSchema` (see auth.service.ts / auth.routes.ts).

## Day 6: `services/catalog-service/src`
| Function | File | Purpose |
|---|---|---|
| `listCategories()` | categories/categories.service.ts | All categories A-Z |
| `listPublicProducts(query)` | products/products.service.ts | Public list: visibility rule (ACTIVE + APPROVED + approved seller), search (title/description, case-insensitive), category slug, min/max price, sort, pagination; count and rows in one transaction |
| `getPublicProduct(id)` | products.service.ts | One public product, else 404 (hidden = missing) |
| `ensureSellerProfile(userId)` | products.service.ts | Creates the seller row on first use (id = auth user id); 403 if not APPROVED |
| `resolveCategoryId(input)` | products.service.ts | Category by id or slug → id, else 422 |
| `listOwnProducts(sellerId, query)` | products.service.ts | Seller's own products with optional status filter |
| `getOwnProduct(sellerId, id)` | products.service.ts | **Ownership check**: `sellerId` is inside the query, other sellers' products return 404 |
| `createProduct(sellerId, input)` | products.service.ts | Validates category, creates product + images |
| `updateProduct(sellerId, id, input)` | products.service.ts | Ownership check, then update; images replaced atomically (delete + createMany in a transaction) |
| `setProductStatus(sellerId, id, status)` | products.service.ts | Archive / activate (soft, nothing deleted) |
| `orderBy(sort)` | products.service.ts | Sort mapping with `id` tie-breaker so pages are stable |
| `toPublicProduct(p)`, `toOwnProduct(p)`, `pageMeta(...)` | products/products.dto.ts | Response shapes; public hides status/moderation |
| `publicListQuery`, `ownListQuery`, `createProductSchema`, `updateProductSchema`, `idParams` | products/products.schemas.ts | Zod rules (price integer minor units, http(s) image URLs ≤ 8, limit ≤ 50, minPrice ≤ maxPrice) |
| `seedCategories(client)` | prisma/seed.ts | Idempotent upsert of the six base categories |
| `shutdown(signal)` | server.ts | Graceful stop: drain, disconnect Prisma, exit |

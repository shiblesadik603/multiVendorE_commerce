# Security baseline (Day 5)

All shared code lives in `packages/common` (`@marketplace/common`) so every service behaves the same way.

| Concern | Where | How |
|---|---|---|
| User authentication | `requireAuth()` | Verifies the HS256 access JWT locally in every service (no call to auth-service per request). `alg=none`, expired, and wrongly-signed tokens → 401. |
| Authorization | `requireRole(...)` | 401 if not logged in, 403 if the role is not allowed. Ownership checks (seller owns product) are done in each service's queries and return 404 for other people's data. |
| Service-to-service auth | `requireService()`, `serviceHeaders()` | Calling service sends `x-service-token`: a 60 s JWT signed with `INTERNAL_JWT_SECRET` (different from user secret, issuer `marketplace-internal`, claim `svc`). Endpoints can whitelist callers. User tokens can't be used internally and vice versa. |
| Input validation | `validate({body,query,params})` (Zod) | Failures → 422 `VALIDATION_ERROR` with per-field details; values are coerced/trimmed. |
| Secrets | `parseEnv` + `secretSchema` | Only from environment variables; service refuses to start if a secret is missing or shorter than 32 chars. `.env` is gitignored; `.env.example` has placeholders. |
| HTTP security | `createBaseApp` | `helmet` headers, `x-powered-by` off, 10 KB body limit (413), malformed JSON (400), no stack traces in 500s. |
| CORS | `createBaseApp` | Only origins in `CORS_ORIGIN`; credentials allowed (refresh cookie); exposes `x-request-id` and rate-limit headers. |
| Rate limiting | `rateLimit()` | Redis fixed-window counter (atomic Lua script) shared by all instances; sends `RateLimit-*` and `Retry-After`; 429 `RATE_LIMITED`. If Redis is down it falls back to per-instance memory. Applied to register/login/refresh (20 per 15 min per IP, configurable). |
| Tracing | `createBaseApp` | `x-request-id` accepted or generated, echoed, logged as JSON; forward it on downstream calls. |

## Using it in a new service
```ts
const app = createBaseApp({ serviceName: "catalog-service", corsOrigin: env.CORS_ORIGIN, ready: () => prisma.$queryRaw`SELECT 1` });
app.get("/api/v1/seller/products", requireAuth(env.JWT_ACCESS_SECRET), requireRole("SELLER"), handler);
app.get("/internal/stock", requireService(["order-service"]), handler);
finalizeApp(app, "catalog-service");
```

## Known limits (documented, planned)
- Symmetric JWT secret is shared by services; moving to asymmetric keys (RS256) would let services verify without being able to mint tokens.
- Service tokens are not bound to a specific audience/endpoint.
- Login limit is per IP; per-account lockout is not implemented.

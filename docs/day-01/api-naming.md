# Day 1 - API naming conventions (backend)

- Base path: `/api/v1`. JSON only. Plural nouns, kebab-case, no verbs except for actions.
- Auth: `Authorization: Bearer <accessToken>`; refresh token in httpOnly cookie.
- Pagination: `?page=1&limit=20` → `{ "data": [...], "meta": { "page": 1, "limit": 20, "total": 120 } }`.
- Errors: `{ "error": { "code": "OUT_OF_STOCK", "message": "...", "details": [] } }` with correct HTTP status (400, 401, 403, 404, 409, 422).
- Success: `{ "data": ... }`.

## Planned endpoints (full JSON examples finalized Day 2)

| Area | Method + path | Access |
|---|---|---|
| Health | `GET /health` | public |
| Auth | `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`; `GET /auth/me` | public / user |
| Categories | `GET /categories` | public |
| Products | `GET /products?search=&category=&minPrice=&maxPrice=&page=&limit=`, `GET /products/:id` | public |
| Seller profile | `POST /sellers/apply`, `GET/PATCH /sellers/me` | buyer / seller |
| Seller products | `GET/POST /seller/products`, `PATCH /seller/products/:id`, `POST /seller/products/:id/archive` | seller |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:productId`, `DELETE /cart/items/:productId` | buyer |
| Checkout | `POST /orders` (header `Idempotency-Key`) | buyer |
| Buyer orders | `GET /orders`, `GET /orders/:id` | buyer |
| Seller orders | `GET /seller/orders`, `PATCH /seller/orders/:id/status` | seller |
| Admin | `GET /admin/sellers`, `PATCH /admin/sellers/:id/status`, `GET /admin/products`, `PATCH /admin/products/:id/moderation` | admin |

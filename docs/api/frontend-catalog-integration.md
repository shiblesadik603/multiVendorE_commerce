# Catalog integration notes for the frontend

Base (local): `http://localhost:4002/api/v1`. Public routes need no login; seller routes need `Authorization: Bearer <accessToken>` from auth-service (role `SELLER`).

## Field mapping from `data/products.ts` (mock) → API
| Mock | API | Notes |
|---|---|---|
| `id` | `id` | UUID string |
| `title` | `title` | same |
| `price` (199.99) | `price` (19999) | **integer minor units**. Show with `price / 100`; send `Math.round(value * 100)` |
| `category` ("Electronics") | `category.name` / `category.slug` | filter by slug: `?category=electronics` |
| `image` | `imageUrl` (first) and `images[]` | |
| `seller` ("SoundWave Audio") | `seller.shopName` | placeholder `Seller-xxxxxxxx` until Day 9 profiles |
| `description` | `description` | |
| `rating` | not available | no reviews in the plan; hide or keep mocked |
| stock | not available yet | arrives from inventory-service (Day 12) |

Category slugs: `electronics`, `fashion`, `home-decor`, `gadgets`, `accessories`, `ai-digital-assets`.

## Screens
- **Listing + filters (Day 8 UI):** `GET /products?search=&category=&minPrice=&maxPrice=&sort=newest|price_asc|price_desc&page=&limit=`. Response `{data, meta:{page,limit,total,totalPages}}`. Their `price-asc`/`price-desc` sort values map to `price_asc`/`price_desc`; "rating" sort has no API.
- **Detail:** `GET /products/:id` → `{data}`; 404 means archived/hidden/missing.
- **Seller dashboard (Task 9):** `GET /seller/products?status=ACTIVE|ARCHIVED`; create `POST /seller/products` `{title, description, price, category: slug, imageUrls:[url]}`; edit `PATCH /seller/products/:id`; "Archive" `POST /seller/products/:id/archive`, restore `POST .../activate`. The form has no stock field: stock is not part of catalog.
- Errors: 401 not logged in, 403 not a seller, 404 not yours/missing, 422 `{error:{details:[{field,message}]}}`.

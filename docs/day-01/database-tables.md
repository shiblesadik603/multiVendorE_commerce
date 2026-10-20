# Day 1 - Database tables (backend, PostgreSQL + Prisma)

Detailed ERD comes on Day 2. All ids are UUID; money is integer minor units; all tables have `created_at`, `updated_at`.

| Table | Key columns | Notes |
|---|---|---|
| `users` | email (unique), password_hash, name, phone, role (BUYER/SELLER/ADMIN), is_active | |
| `seller_profiles` | user_id (unique FK), shop_name, description, status (PENDING/APPROVED/SUSPENDED) | one per seller |
| `categories` | name, slug (unique), parent_id (nullable) | |
| `products` | seller_id → seller_profiles, category_id, name, description, price, stock, status (DRAFT/ACTIVE/ARCHIVED), moderation (PENDING/APPROVED/HIDDEN) | indexes: category, seller, name |
| `product_images` | product_id, url, position | URLs only |
| `carts` | user_id (unique) | one per buyer |
| `cart_items` | cart_id, product_id, quantity | unique (cart_id, product_id) |
| `orders` | buyer_id, status, total, delivery name/phone/address/city, payment_method (COD), idempotency_key (unique per buyer) | parent order |
| `seller_orders` | order_id, seller_id, status (PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED), subtotal | one per seller per checkout |
| `order_items` | seller_order_id, product_id, product_name, unit_price, quantity | price/name snapshot at purchase |
| `order_status_history` | seller_order_id, status, changed_by, created_at | feeds the timeline |

Key rules: stock decremented inside a DB transaction (`UPDATE ... WHERE stock >= qty`); `idempotency_key` prevents duplicate orders; unit price is read from `products` on the server, never trusted from the client.

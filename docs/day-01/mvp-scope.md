# Day 1 - MVP scope (agreed by both)

**Goal:** multiple sellers list products; buyers buy from several sellers in one checkout.

## In scope (must ship)
1. Auth + roles: BUYER, SELLER, ADMIN (backend enforces permissions).
2. Product catalog: photo URL, name, price, description, seller, category, stock; search, filters, pagination.
3. Seller dashboard: create/edit/archive own products, manage own orders.
4. Cart and checkout: add, change quantity, delivery details, place order.
5. Multi-vendor orders: one checkout → 1 parent order + 1 seller order per seller.
6. Inventory safety: server-side stock check inside a transaction; last unit can't be sold twice.
7. Order tracking: buyer sees own orders; seller updates only own seller-orders.
8. Admin: approve/suspend sellers, approve/hide products.
9. Responsive UI with loading, empty, success, error states.
10. Deployment, demo data, tests, README.

## Decisions
- Payment: **Cash on Delivery only** (clearly labelled). No real gateway.
- Images: URLs only, never stored in the DB as files.
- Architecture: modular monolith. No Redis, microservices, Kafka.
- Auth: JWT access token (short-lived) + refresh token in httpOnly cookie. Passwords hashed with bcrypt.
- Money: stored as integer minor units (paisa/cents) to avoid float errors. Currency: BDT.
- IDs: UUIDs.
- Sellers register as buyers, apply to become seller, admin approves.

## Out of scope (only if time remains)
Real payments, coupons, notifications, reviews, advanced analytics, Redis cache.

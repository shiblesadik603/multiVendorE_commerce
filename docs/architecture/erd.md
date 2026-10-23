# ERD per service

Each service has its own database. Cross-service references are plain ids (no foreign keys across databases).

## auth_db (implemented)
```mermaid
erDiagram
  users ||--o{ refresh_tokens : has
  users { uuid id PK
    string name
    string email UK
    string phone UK
    string password_hash
    enum role "BUYER|SELLER|ADMIN"
    bool is_active }
  refresh_tokens { uuid id PK
    uuid user_id FK
    string token_hash UK
    timestamp expires_at
    timestamp revoked_at }
```

## catalog_db
```mermaid
erDiagram
  seller_profiles ||--o{ products : sells
  categories ||--o{ products : groups
  categories ||--o{ categories : parent
  products ||--o{ product_images : has
  seller_profiles { uuid id PK
    uuid user_id UK "auth user"
    string shop_name
    enum status "PENDING|APPROVED|SUSPENDED" }
  categories { uuid id PK
    string name
    string slug UK
    uuid parent_id FK }
  products { uuid id PK
    uuid seller_id FK
    uuid category_id FK
    string name
    text description
    int price "minor units"
    enum status "DRAFT|ACTIVE|ARCHIVED"
    enum moderation "PENDING|APPROVED|HIDDEN" }
  product_images { uuid id PK
    uuid product_id FK
    string url
    int position }
```
Indexes: products(category_id), products(seller_id), products(name) / full-text. Display stock is read from inventory-service.

## cart_db
```mermaid
erDiagram
  carts ||--o{ cart_items : contains
  carts { uuid id PK
    uuid user_id UK "auth user" }
  cart_items { uuid id PK
    uuid cart_id FK
    uuid product_id "catalog product"
    int quantity }
```
Unique (cart_id, product_id). Prices are never stored in the cart; read from catalog at view/checkout.

## inventory_db
```mermaid
erDiagram
  stock_items ||--o{ reservations : reserved_by
  stock_items { uuid product_id PK
    int on_hand
    int reserved }
  reservations { uuid id PK
    uuid product_id FK
    uuid order_id
    int quantity
    enum status "HELD|COMMITTED|RELEASED|EXPIRED"
    timestamp expires_at }
```
Atomic reserve: `UPDATE stock_items SET reserved = reserved + :q WHERE product_id = :id AND on_hand - reserved >= :q`.

## order_db
```mermaid
erDiagram
  orders ||--o{ seller_orders : splits_into
  seller_orders ||--o{ order_items : contains
  seller_orders ||--o{ order_status_history : tracks
  orders ||--o| payments : paid_by
  orders { uuid id PK
    uuid buyer_id
    int total
    string delivery_name
    string delivery_phone
    string delivery_address
    string idempotency_key "unique per buyer"
    enum status }
  seller_orders { uuid id PK
    uuid order_id FK
    uuid seller_id
    int subtotal
    enum status "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED" }
  order_items { uuid id PK
    uuid seller_order_id FK
    uuid product_id
    string product_name
    int unit_price
    int quantity }
  order_status_history { uuid id PK
    uuid seller_order_id FK
    enum status
    uuid changed_by
    timestamp created_at }
  payments { uuid id PK
    uuid order_id FK
    enum method "COD|MOCK"
    enum status "PENDING|PAID|FAILED" }
  outbox_events { uuid id PK
    string type
    json payload
    timestamp processed_at }
```

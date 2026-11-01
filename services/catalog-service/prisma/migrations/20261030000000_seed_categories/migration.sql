-- Base categories (same six the seller form offers). Idempotent.
INSERT INTO "categories" ("id", "name", "slug") VALUES
  (gen_random_uuid(), 'Electronics', 'electronics'),
  (gen_random_uuid(), 'Fashion', 'fashion'),
  (gen_random_uuid(), 'Home & Decor', 'home-decor'),
  (gen_random_uuid(), 'Gadgets', 'gadgets'),
  (gen_random_uuid(), 'Accessories', 'accessories'),
  (gen_random_uuid(), 'AI & Digital Assets', 'ai-digital-assets')
ON CONFLICT ("slug") DO NOTHING;

# Day 1 - Screen list (frontend)

| # | Screen | Route | Access |
|---|---|---|---|
| 1 | Home | `/` | public |
| 2 | Product list (search/filter/pagination) | `/products` | public |
| 3 | Product detail | `/products/[id]` | public |
| 4 | Cart | `/cart` | public/buyer |
| 5 | Checkout | `/checkout` | buyer |
| 6 | Order confirmation | `/orders/[id]/confirmation` | buyer |
| 7 | Login | `/login` | public |
| 8 | Register | `/register` | public |
| 9 | My orders | `/orders` | buyer |
| 10 | Order detail + timeline | `/orders/[id]` | buyer |
| 11 | Become a seller | `/seller/apply` | buyer |
| 12 | Seller dashboard | `/seller` | seller |
| 13 | Seller products list | `/seller/products` | seller |
| 14 | Product create/edit form | `/seller/products/new`, `/seller/products/[id]/edit` | seller |
| 15 | Seller orders + status update | `/seller/orders` | seller |
| 16 | Admin sellers | `/admin/sellers` | admin |
| 17 | Admin product moderation | `/admin/products` | admin |
| 18 | 403 / 404 / error pages | - | all |

Shared states for every data screen: loading, empty, error, success.

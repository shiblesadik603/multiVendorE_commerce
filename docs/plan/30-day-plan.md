# 30-day plan

Team of 2, 2 hours/person/day. FE = frontend, BE = backend. Tick a day when both sides are merged into `main`.

| Day | Frontend | Backend |
|---|---|---|
| 1 ✅ | Agree MVP, user journeys, screen list, GitHub repo and task board | Agree database tables, API naming and project setup |
| 2 | Wireframes: home, product list/detail, cart, checkout, orders, seller dashboard | Database ERD, finalize API contract |
| 3 | Next.js, TS, Tailwind, layout, header, navigation | Express, TS, PostgreSQL, Prisma, migrations, health endpoint |
| 4 | Buttons, inputs, product cards, loading/error UI | Register, login, logout, password hashing |
| 5 | Login/register forms, protected-page UX | Role/permission middleware, test unauthorized requests |
| 6 | Home + product listing (mock data) | Category + public product list/detail APIs |
| 7 | Product detail page | Seller profile + seller-owned product CRUD |
| 8 | Seller dashboard, product forms | Product validation, image URLs, status |
| 9 | Search, filters, pagination UI | Search/filter/pagination queries, indexes |
| 10 | Cart page, quantity controls | Cart APIs, persisted cart |
| 11 | Checkout form, order summary | Checkout rules, stock handling, parent/seller order structure |
| 12 | Checkout confirmation, errors | Safe stock updates, transactional order creation |
| 13 | Buyer order list/details/timeline | Buyer order APIs, ownership checks |
| 14 | Seller order list + status update UI | Seller order APIs, status transitions |
| 15 | Admin pages | Admin approval/suspension/moderation APIs |
| 16 | Connect screens to real APIs | Test main APIs, fix contract mismatches |
| 17 | Validation, loading, error messages | Consistent errors, input limits, logs, auth rate limits |
| 18 | Responsive pages | Review queries, indexes, authz, transactions |
| 19 | Seller sales summary UI | Sales summary endpoint / bug fixes |
| 20 | Polish cart/checkout/orders | Core tests, checkout/inventory fixes |
| 21 | Buyer journey test, FE tests | Concurrent last-unit checkout test |
| 22 | Seller/admin journey tests | Duplicate checkout, permission, status tests |
| 23 | FE production env | Deploy backend + DB, HTTPS, CORS, secrets |
| 24 | Deploy frontend | Migrations, demo data, prod logs |
| 25 | Full purchase test | Verify stock, totals, parent/seller orders |
| 26 | Seller/admin tests on deployed app | Small load test |
| 27 | Visual/responsive fixes | Critical security/DB/checkout fixes |
| 28 | Screenshots, demo walkthrough | README, API docs, setup instructions |
| 29 | Re-test screens, rehearse | Regression tests, deployment check |
| 30 | Demo buyer/seller/admin flows | Demo inventory safety, order splitting, architecture |

## Minimum tests before delivery
- Buyer cannot access seller/admin functions.
- Seller cannot edit another seller's product or order.
- Checkout recalculates price and stock on the backend.
- Two simultaneous purchases cannot oversell stock.
- Cart with two sellers → one parent order + two seller orders.
- Duplicate requests do not create duplicate orders.
- Deployed buyer, seller, admin journeys all work.

# Day 1 - Core user journeys

## Buyer
1. Open home → browse/search/filter products → open product detail.
2. Add to cart → change quantity / remove → go to cart.
3. Register or log in (required at checkout).
4. Checkout: enter delivery details → review summary → place order (COD).
5. See confirmation → view "My orders" → open order detail and status timeline.

## Seller
1. Register → apply as seller → wait for admin approval.
2. Log in → seller dashboard.
3. Create product (name, price, stock, category, image URLs, description) → edit → archive.
4. View incoming seller-orders → update status (PENDING → CONFIRMED → SHIPPED → DELIVERED, or CANCELLED).

## Admin
1. Log in → admin area.
2. Approve or suspend sellers.
3. Approve or hide products.

## Failure paths to design for
- Out-of-stock / stock changed during checkout → clear error, cart updated.
- Unauthorized access → redirect to login / 403 page.
- Network/API error → retry-able error state.

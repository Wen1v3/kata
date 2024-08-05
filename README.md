# To realize the flexibility when adding new styles of pricing rules in the future:
Please see rules.js file. With the sample rule in it, users can easily create a new rule if they understand JSON.

By the combination of "cartAttribute", "subCartFilter" and "action", many rules are supported without code change.

New "action" can be developed by adding a new class, no other code change is required.

In future frontend interface and DB can be developed easily by the rule format.

# Currently support the following rules:

if total quantity of (A, B) is greater than 1 (or X), then 3 for $15 for (C, D)

For (A, B), from the second (or X) item, get 50% (or X%) off

# To achieve decoupling:
SOLID and dependency injection are applied.

# Some features:
Every sku has categoryId and qty in the cart.

Discount is calculated to sku level. So if a sku gets multiple discounts from multiple rules, the largest discount can be used.

# How to run:
"node app.js"

"npm install", then "npm test"

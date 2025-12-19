-- Add is_best_seller column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false;

-- Mark some products as best sellers (trending items)
UPDATE products SET is_best_seller = true WHERE slug IN (
  'blueberry-pancakes',
  'belgian-waffles',
  'nutella-waffles',
  'chocolate-brownie'
);

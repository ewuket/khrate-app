-- Add new bundles with realistic pricing
INSERT INTO bundles (title, description, price, original_price, image_url, is_active, is_featured) VALUES 
('Fruit Bowl', 'A delicious mix of fresh seasonal fruits including bananas, apples, oranges, and grapes', 3000, 3500, '/bundles/fruit-bowl.png', true, true),
('Weekly Essentials Bundle', 'Everything you need for a week: rice, pasta, cooking oil, eggs, milk, bread, and basic vegetables', 15000, 18000, '/bundles/essentials-bundle.png', true, true),
('Premium Family Pack', 'Complete family meal package with rice, meat, vegetables, fruits, and dairy products', 25000, 30000, '/bundles/family-crate.png', true, true),
('Fresh Vegetable Box', 'A variety of fresh seasonal vegetables including tomatoes, onions, potatoes, carrots, and greens', 12000, 14000, '/bundles/veggie-box.png', true, false)
ON CONFLICT DO NOTHING;

-- Get the ID of the Fruit Bowl bundle for adding items
DO $$
DECLARE
  fruit_bowl_id INTEGER;
BEGIN
  SELECT id INTO fruit_bowl_id FROM bundles WHERE title = 'Fruit Bowl' LIMIT 1;
  
  IF fruit_bowl_id IS NOT NULL THEN
    INSERT INTO bundle_items (bundle_id, item_name, quantity, unit) VALUES 
    (fruit_bowl_id, 'Bananas', 3, 'pieces'),
    (fruit_bowl_id, 'Apples', 4, 'pieces'),
    (fruit_bowl_id, 'Oranges', 4, 'pieces'),
    (fruit_bowl_id, 'Grapes', 0.5, 'kg')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Add new custom buy items
INSERT INTO custom_buy_items (name, description, price, unit, category, image_url, is_active, stock_quantity) VALUES 
('Prepped Green Beans', 'Fresh green beans cleaned and trimmed, ready to cook', 1800, 'kg', 'Prepped Vegetables', '/groceries/prepped-green-beans.png', true, 50),
('Prepped Carrots', 'Fresh carrots peeled and sliced, ready to cook', 1300, 'kg', 'Prepped Vegetables', '/groceries/prepped-carrots.png', true, 50),
('Prepped Potatoes', 'Fresh potatoes peeled and diced, ready to cook', 1200, 'kg', 'Prepped Vegetables', '/groceries/prepped-potatoes.png', true, 50),
('Mango Juice', 'Fresh mango juice, 500ml', 2000, '500ml', 'Beverages', '/groceries/mango-juice.png', true, 30),
('Pineapple Juice', 'Fresh pineapple juice, 500ml', 2000, '500ml', 'Beverages', '/groceries/pineapple-juice.png', true, 30),
('Avocado Juice', 'Fresh avocado juice, 500ml', 2500, '500ml', 'Beverages', '/groceries/avocado-juice.png', true, 25),
('Avocado Pineapple Juice', 'Fresh avocado and pineapple mixed juice, 500ml', 2800, '500ml', 'Beverages', '/groceries/avocado-pineapple-juice.png', true, 25)
ON CONFLICT DO NOTHING;
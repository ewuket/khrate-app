-- Update existing items with new images
UPDATE custom_buy_items SET image_url = '/groceries/bread.png', updated_at = NOW() WHERE name = 'Bread';
UPDATE custom_buy_items SET image_url = '/groceries/eggs.png', updated_at = NOW() WHERE name = 'Eggs';
UPDATE custom_buy_items SET image_url = '/groceries/tomatoes.png', updated_at = NOW() WHERE name ILIKE '%tomato%';

-- Insert missing juice items (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Avocado Juice') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Avocado Juice', 'Beverages', 2500, '500ml', '/groceries/avocado-juice.png', 'Fresh avocado juice', true, 50);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/avocado-juice.png', price = 2500, updated_at = NOW() WHERE name = 'Avocado Juice';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Mango Juice') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Mango Juice', 'Beverages', 2000, '500ml', '/groceries/mango-juice.png', 'Fresh mango juice', true, 50);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/mango-juice.png', price = 2000, updated_at = NOW() WHERE name = 'Mango Juice';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Pineapple Juice') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Pineapple Juice', 'Beverages', 2000, '500ml', '/groceries/pineapple-juice.png', 'Fresh pineapple juice', true, 50);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/pineapple-juice.png', price = 2000, updated_at = NOW() WHERE name = 'Pineapple Juice';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Avocado Pineapple Juice') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Avocado Pineapple Juice', 'Beverages', 2800, '500ml', '/groceries/avocado-pineapple-juice.png', 'Fresh avocado and pineapple juice blend', true, 50);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/avocado-pineapple-juice.png', price = 2800, updated_at = NOW() WHERE name = 'Avocado Pineapple Juice';
  END IF;

  -- Insert prepped vegetables
  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Prepped Green Beans') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Prepped Green Beans', 'Pre-Prepped Vegetables', 1800, '1kg', '/groceries/prepped-green-beans.png', 'Pre-washed and trimmed green beans ready to cook', true, 30);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/prepped-green-beans.png', price = 1800, updated_at = NOW() WHERE name = 'Prepped Green Beans';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Prepped Carrots') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Prepped Carrots', 'Pre-Prepped Vegetables', 1300, '1kg', '/groceries/prepped-carrots.png', 'Pre-peeled and sliced carrots ready to cook', true, 30);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/prepped-carrots.png', price = 1300, updated_at = NOW() WHERE name = 'Prepped Carrots';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM custom_buy_items WHERE name = 'Prepped Potatoes') THEN
    INSERT INTO custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity)
    VALUES ('Prepped Potatoes', 'Pre-Prepped Vegetables', 1200, '1kg', '/groceries/prepped-potatoes.png', 'Pre-peeled and diced potatoes ready to cook', true, 30);
  ELSE
    UPDATE custom_buy_items SET image_url = '/groceries/prepped-potatoes.png', price = 1200, updated_at = NOW() WHERE name = 'Prepped Potatoes';
  END IF;
END $$;

-- Update bundle images and descriptions with detailed content
UPDATE bundles 
SET 
  image_url = '/bundles/fresh-vegetables.png',
  description = 'Fresh seasonal vegetables:
• Cabbage - 1kg
• Carrots - 1kg
• Potatoes - 2kg
• Tomatoes - 1kg
• Onions - 1kg',
  price = 15000,
  original_price = 18000,
  updated_at = NOW()
WHERE title ILIKE '%fresh%vegetable%';

UPDATE bundles 
SET 
  image_url = '/bundles/fruits-combo.png',
  description = 'Mixed seasonal fruits:
• Bananas - 1kg
• Mango - 1kg
• Pineapple - 1 piece
• Apples - 1kg
• Oranges - 1kg',
  price = 18000,
  original_price = 22000,
  updated_at = NOW()
WHERE title ILIKE '%fruit%combo%';

UPDATE bundles 
SET 
  image_url = '/bundles/dairy-pack.png',
  description = 'Complete dairy essentials:
• Fresh milk - 1L
• Cheese - 200g
• Yogurt - 500ml
• Bread - 1 loaf',
  price = 12000,
  original_price = 15000,
  updated_at = NOW()
WHERE title ILIKE '%dairy%';

UPDATE bundles 
SET 
  image_url = '/bundles/fruit-bowl.png',
  description = 'Delicious mix of fresh seasonal fruits:
• Bananas - 500g
• Apples - 500g
• Oranges - 500g
• Grapes - 250g',
  price = 3000,
  original_price = 3500,
  updated_at = NOW()
WHERE title ILIKE '%fruit%bowl%';

UPDATE bundles 
SET 
  description = 'Everything you need for a week:
• Rice - 1kg
• Pasta - 250g
• Cooking oil - 0.5L
• Eggs - 1 tray (30pcs)
• Milk - 1L
• Bread - 1 loaf
• Tomatoes - 1kg
• Potatoes - 1kg',
  price = 25000,
  original_price = 30000,
  updated_at = NOW()
WHERE title ILIKE '%weekly%essential%';
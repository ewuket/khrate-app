-- Delete existing bundle items to avoid duplicates
DELETE FROM bundle_items;

-- Add bundle items for Fresh Vegetables Bundle (id: 16)
INSERT INTO bundle_items (bundle_id, item_name, quantity, unit) VALUES
  (16, 'Cabbage', 1, 'kg'),
  (16, 'Carrots', 1, 'kg'),
  (16, 'Potatoes', 2, 'kg'),
  (16, 'Tomatoes', 1, 'kg'),
  (16, 'Onions', 1, 'kg');

-- Add bundle items for Fruits Combo Pack (id: 17)
INSERT INTO bundle_items (bundle_id, item_name, quantity, unit) VALUES
  (17, 'Bananas', 1, 'kg'),
  (17, 'Mango', 1, 'kg'),
  (17, 'Pineapple', 1, 'piece'),
  (17, 'Apples', 1, 'kg'),
  (17, 'Oranges', 1, 'kg');

-- Add bundle items for Dairy Essentials (id: 18)
INSERT INTO bundle_items (bundle_id, item_name, quantity, unit) VALUES
  (18, 'Fresh Milk', 1, 'L'),
  (18, 'Cheese', 200, 'g'),
  (18, 'Yogurt', 500, 'ml'),
  (18, 'Bread', 1, 'loaf');

-- Add bundle items for Fruit Bowl (id: 23)
INSERT INTO bundle_items (bundle_id, item_name, quantity, unit) VALUES
  (23, 'Bananas', 500, 'g'),
  (23, 'Apples', 500, 'g'),
  (23, 'Oranges', 500, 'g'),
  (23, 'Grapes', 250, 'g');

-- Add bundle items for Weekly Essentials Bundle (id: 24)
INSERT INTO bundle_items (bundle_id, item_name, quantity, unit) VALUES
  (24, 'Rice', 1, 'kg'),
  (24, 'Pasta', 250, 'g'),
  (24, 'Cooking Oil', 0.5, 'L'),
  (24, 'Eggs', 30, 'pieces'),
  (24, 'Milk', 1, 'L'),
  (24, 'Bread', 1, 'loaf'),
  (24, 'Tomatoes', 1, 'kg'),
  (24, 'Potatoes', 1, 'kg');
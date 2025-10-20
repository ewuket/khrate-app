-- Insert 20 essential grocery items for Custom Buy
-- Clear existing items first (optional - remove if you want to keep existing data)
-- DELETE FROM public.custom_buy_items;

-- Insert Fresh Produce
INSERT INTO public.custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity) VALUES
('Onions', 'Fresh Produce', 800, 'kg', '/groceries/onions.png', 'Fresh red onions, perfect for cooking', true, 100),
('Tomatoes', 'Fresh Produce', 1200, 'kg', '/groceries/tomatoes.png', 'Fresh ripe tomatoes', true, 100),
('Potatoes', 'Fresh Produce', 600, 'kg', '/groceries/potatoes.png', 'Fresh quality potatoes', true, 150),
('Bananas', 'Fresh Produce', 1500, 'kg', '/groceries/bananas.png', 'Fresh yellow bananas', true, 80),
('Carrots', 'Fresh Produce', 1000, 'kg', '/groceries/carrots.png', 'Fresh orange carrots', true, 90),
('Garlic', 'Fresh Produce', 2000, 'kg', '/groceries/garlic.png', 'Fresh garlic bulbs', true, 60),
('Green Pepper', 'Fresh Produce', 1800, 'kg', '/groceries/green-pepper.png', 'Fresh green bell peppers', true, 70),
('Cabbage', 'Fresh Produce', 500, 'kg', '/groceries/cabbage.png', 'Fresh green cabbage', true, 80);

-- Insert Grains & Staples
INSERT INTO public.custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity) VALUES
('Rice', 'Grains & Staples', 2500, 'kg', '/groceries/rice.png', 'Premium white rice', true, 200),
('Pasta', 'Grains & Staples', 3000, 'kg', '/groceries/pasta.png', 'Quality pasta', true, 150),
('Flour', 'Grains & Staples', 1500, 'kg', '/groceries/flour.png', 'All-purpose flour', true, 180),
('Lentils', 'Grains & Staples', 2200, 'kg', '/groceries/lentils.png', 'Brown lentils', true, 120),
('Bread', 'Grains & Staples', 1000, 'piece', '/groceries/bread.png', 'Fresh white bread loaf', true, 50);

-- Insert Pantry Essentials
INSERT INTO public.custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity) VALUES
('Cooking Oil', 'Pantry Essentials', 5000, 'liter', '/groceries/cooking-oil.png', 'Pure cooking oil', true, 100),
('Sugar', 'Pantry Essentials', 1800, 'kg', '/groceries/sugar.png', 'White sugar', true, 150),
('Salt', 'Pantry Essentials', 500, 'kg', '/groceries/salt.png', 'Table salt', true, 200),
('Coffee', 'Pantry Essentials', 8000, 'kg', '/groceries/coffee.png', 'Premium coffee beans', true, 80),
('Tea', 'Pantry Essentials', 6000, 'kg', '/groceries/tea.png', 'Quality tea leaves', true, 90);

-- Insert Dairy & Protein
INSERT INTO public.custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity) VALUES
('Eggs', 'Dairy & Protein', 300, 'piece', '/groceries/eggs.png', 'Fresh brown eggs', true, 200),
('Milk', 'Dairy & Protein', 1500, 'liter', '/groceries/milk.png', 'Fresh milk', true, 100);

-- Ensure RLS policies are correct for public viewing
-- The existing RLS policies should already allow public to view active items
-- and admin to manage all items
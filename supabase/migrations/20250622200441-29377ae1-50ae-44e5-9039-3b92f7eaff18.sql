
-- Rebuild the bundles system from scratch
-- First, drop existing tables and recreate them with proper structure

-- Drop existing tables (cascade to remove dependencies)
DROP TABLE IF EXISTS public.bundle_items CASCADE;
DROP TABLE IF EXISTS public.bundles CASCADE;

-- Create bundles table with proper structure
CREATE TABLE public.bundles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle_items table
CREATE TABLE public.bundle_items (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER REFERENCES public.bundles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'pieces',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

-- Create simple public read policies (one per table)
CREATE POLICY "Public can read active bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Public can read bundle items" 
  ON public.bundle_items 
  FOR SELECT 
  USING (true);

-- Insert sample data to test
INSERT INTO public.bundles (title, description, price, original_price, is_featured, is_active) VALUES
('Breakfast Bundle', 'Start your day right with our breakfast essentials', 2500.00, 3000.00, true, true),
('Medium Bundle', 'Perfect for small families', 4500.00, 5200.00, true, true),
('Large Bundle', 'Great value for larger households', 7500.00, 8500.00, true, true),
('Vegetable Bundle', 'Fresh vegetables for healthy meals', 3200.00, 3800.00, false, true),
('Fruit Bundle', 'Sweet and nutritious fruits', 2800.00, 3300.00, false, true),
('Protein Bundle', 'High-quality proteins for your family', 6200.00, 7000.00, false, true),
('Snack Bundle', 'Healthy snacks for everyone', 1800.00, 2200.00, false, true),
('Dairy Bundle', 'Fresh dairy products', 2200.00, 2600.00, false, true),
('Premium Bundle', 'Our finest selection of products', 9500.00, 11000.00, true, true);

-- Insert sample bundle items
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
-- Breakfast Bundle items
(1, 'Bread', 2, 'loaves'),
(1, 'Eggs', 12, 'pieces'),
(1, 'Milk', 1, 'liter'),
(1, 'Butter', 1, 'pack'),
-- Medium Bundle items
(2, 'Rice', 2, 'kg'),
(2, 'Beans', 1, 'kg'),
(2, 'Cooking Oil', 1, 'liter'),
(2, 'Onions', 1, 'kg'),
-- Large Bundle items
(3, 'Rice', 5, 'kg'),
(3, 'Beans', 2, 'kg'),
(3, 'Cooking Oil', 2, 'liters'),
(3, 'Onions', 2, 'kg'),
(3, 'Tomatoes', 2, 'kg'),
-- Vegetable Bundle items
(4, 'Tomatoes', 2, 'kg'),
(4, 'Onions', 1, 'kg'),
(4, 'Carrots', 1, 'kg'),
(4, 'Cabbage', 1, 'head'),
-- Fruit Bundle items
(5, 'Bananas', 1, 'bunch'),
(5, 'Apples', 1, 'kg'),
(5, 'Oranges', 1, 'kg'),
-- Protein Bundle items
(6, 'Chicken', 2, 'kg'),
(6, 'Fish', 1, 'kg'),
(6, 'Beef', 1, 'kg'),
-- Snack Bundle items
(7, 'Biscuits', 3, 'packs'),
(7, 'Nuts', 500, 'grams'),
(7, 'Dried Fruits', 300, 'grams'),
-- Dairy Bundle items
(8, 'Milk', 2, 'liters'),
(8, 'Cheese', 500, 'grams'),
(8, 'Yogurt', 4, 'cups'),
-- Premium Bundle items
(9, 'Premium Rice', 3, 'kg'),
(9, 'Organic Vegetables', 2, 'kg'),
(9, 'Premium Meat', 1.5, 'kg'),
(9, 'Imported Fruits', 1, 'kg');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_bundles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_bundles_updated_at_trigger
    BEFORE UPDATE ON public.bundles
    FOR EACH ROW
    EXECUTE FUNCTION update_bundles_updated_at();

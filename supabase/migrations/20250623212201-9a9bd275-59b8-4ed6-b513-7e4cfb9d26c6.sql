
-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS public.bundle_items CASCADE;
DROP TABLE IF EXISTS public.bundles CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create new bundles table
CREATE TABLE public.bundles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image_url TEXT DEFAULT '/placeholder.svg',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle items table
CREATE TABLE public.bundle_items (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER REFERENCES public.bundles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'pieces',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table for dashboard access
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to bundles
CREATE POLICY "Anyone can read active bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can read bundle items" 
  ON public.bundle_items 
  FOR SELECT 
  USING (true);

-- Admin policies
CREATE POLICY "Admins can do everything with bundles" 
  ON public.bundles 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can do everything with bundle items" 
  ON public.bundle_items 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can read admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (true);

-- Insert fresh sample data
INSERT INTO public.bundles (title, description, price, original_price, is_featured, is_active) VALUES
('Essential Breakfast Bundle', 'Everything you need for a perfect morning meal', 2500.00, 3000.00, true, true),
('Family Essentials', 'Complete package for family meals', 4500.00, 5200.00, true, true),
('Premium Household Bundle', 'High-quality items for your home', 7500.00, 8500.00, true, true),
('Fresh Vegetables Pack', 'Farm-fresh vegetables delivered daily', 3200.00, 3800.00, false, true),
('Tropical Fruits Collection', 'Sweet and nutritious seasonal fruits', 2800.00, 3300.00, false, true),
('Protein Power Bundle', 'High-quality proteins for healthy living', 6200.00, 7000.00, false, true),
('Healthy Snacks Box', 'Nutritious snacks for the whole family', 1800.00, 2200.00, false, true),
('Dairy Delights', 'Fresh dairy products from local farms', 2200.00, 2600.00, false, true);

-- Insert bundle items
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
-- Essential Breakfast Bundle
(1, 'Fresh Bread', 2, 'loaves'),
(1, 'Farm Eggs', 12, 'pieces'),
(1, 'Fresh Milk', 1, 'liter'),
(1, 'Butter', 250, 'grams'),
-- Family Essentials
(2, 'White Rice', 2, 'kg'),
(2, 'Red Beans', 1, 'kg'),
(2, 'Cooking Oil', 1, 'liter'),
(2, 'Yellow Onions', 1, 'kg'),
-- Premium Household Bundle
(3, 'Premium Rice', 5, 'kg'),
(3, 'Black Beans', 2, 'kg'),
(3, 'Extra Virgin Oil', 2, 'liters'),
(3, 'Red Onions', 2, 'kg'),
(3, 'Fresh Tomatoes', 2, 'kg'),
-- Fresh Vegetables Pack
(4, 'Ripe Tomatoes', 2, 'kg'),
(4, 'White Onions', 1, 'kg'),
(4, 'Fresh Carrots', 1, 'kg'),
(4, 'Green Cabbage', 1, 'head'),
-- Tropical Fruits Collection
(5, 'Sweet Bananas', 1, 'bunch'),
(5, 'Red Apples', 1, 'kg'),
(5, 'Juicy Oranges', 1, 'kg'),
-- Protein Power Bundle
(6, 'Fresh Chicken', 2, 'kg'),
(6, 'Fresh Fish', 1, 'kg'),
(6, 'Premium Beef', 1, 'kg'),
-- Healthy Snacks Box
(7, 'Assorted Biscuits', 3, 'packs'),
(7, 'Mixed Nuts', 500, 'grams'),
(7, 'Dried Fruits', 300, 'grams'),
-- Dairy Delights
(8, 'Fresh Milk', 2, 'liters'),
(8, 'Local Cheese', 500, 'grams'),
(8, 'Greek Yogurt', 4, 'cups');

-- Insert sample admin user
INSERT INTO public.admin_users (email, role) VALUES
('admin@khrate.com', 'admin');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bundles_updated_at
    BEFORE UPDATE ON public.bundles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

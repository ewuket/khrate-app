
-- Create custom_buy_items table to replace hardcoded product data
CREATE TABLE public.custom_buy_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  image_url TEXT DEFAULT '/placeholder.svg',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert existing product data from productsData.ts into the database
INSERT INTO public.custom_buy_items (name, category, price, unit, image_url, description, is_active, stock_quantity) VALUES
-- Vegetables
('Tomatoes', 'Vegetables', 2500, 'kg', '/lovable-uploads/0225ce03-0269-4b10-b603-3c14cf3e55ca.png', 'Fresh red tomatoes', true, 100),
('Onions', 'Vegetables', 3000, 'kg', '/lovable-uploads/099910c6-26ab-4295-975c-4d2ff4380ef8.png', 'Fresh white onions', true, 80),
('Carrots', 'Vegetables', 2800, 'kg', '/lovable-uploads/09c44f3e-b941-47e8-b1c7-86fee2bd1286.png', 'Fresh orange carrots', true, 60),
('Green Peppers', 'Vegetables', 4000, 'kg', '/lovable-uploads/0a4311d6-02e4-43ab-b088-e6a8cc977314.png', 'Fresh green bell peppers', true, 40),
('Cabbage', 'Vegetables', 1500, 'kg', '/lovable-uploads/0d93dc66-4bae-4f1a-a8d0-99ad18115c40.png', 'Fresh green cabbage', true, 50),
('Spinach', 'Vegetables', 3500, 'kg', '/lovable-uploads/11112569-f41f-4966-9d17-8140d0bfa26d.png', 'Fresh spinach leaves', true, 30),

-- Fruits
('Bananas', 'Fruits', 2000, 'kg', '/lovable-uploads/206fd2ee-0377-47a0-8083-70118088988f.png', 'Fresh yellow bananas', true, 120),
('Apples', 'Fruits', 4500, 'kg', '/lovable-uploads/20e340ed-b7ad-456e-81f6-98ca7f202ef7.png', 'Fresh red apples', true, 70),
('Oranges', 'Fruits', 3500, 'kg', '/lovable-uploads/2455b7e0-b0f8-4f2a-aaca-995dcd6da943.png', 'Fresh juicy oranges', true, 90),
('Avocados', 'Fruits', 6000, 'kg', '/lovable-uploads/280f9459-3e15-4683-85fb-0295c65c6045.png', 'Fresh green avocados', true, 35),

-- Grains & Cereals
('Rice (White)', 'Grains & Cereals', 1800, 'kg', '/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png', 'Premium white rice', true, 200),
('Beans (Red)', 'Grains & Cereals', 2200, 'kg', '/lovable-uploads/32e88e9a-d13e-4797-bc20-1ea08858de5e.png', 'Quality red beans', true, 150),
('Maize Flour', 'Grains & Cereals', 1600, 'kg', '/lovable-uploads/3de69fde-952b-4907-ae18-f85fa29e4624.png', 'Fine maize flour', true, 180),
('Wheat Flour', 'Grains & Cereals', 2000, 'kg', '/lovable-uploads/4049f27e-26db-4497-9920-9b60326fe5f7.png', 'Premium wheat flour', true, 160),

-- Dairy & Eggs
('Fresh Milk', 'Dairy & Eggs', 1200, 'liter', '/lovable-uploads/44536f37-66fe-4604-a318-5afc62c7fcdf.png', 'Fresh cow milk', true, 50),
('Eggs', 'Dairy & Eggs', 4000, 'tray', '/lovable-uploads/464ca869-8797-4eb8-9526-98af04334e84.png', 'Fresh chicken eggs (30 pieces)', true, 40),
('Yogurt', 'Dairy & Eggs', 2500, 'liter', '/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png', 'Natural yogurt', true, 25),

-- Meat & Fish
('Chicken', 'Meat & Fish', 8000, 'kg', '/lovable-uploads/488def36-f8d3-4c25-9910-a631bbd0612f.png', 'Fresh chicken meat', true, 30),
('Beef', 'Meat & Fish', 12000, 'kg', '/lovable-uploads/4952f015-4df9-4021-b52c-406fd91d5dba.png', 'Quality beef meat', true, 20),
('Fish (Tilapia)', 'Meat & Fish', 7000, 'kg', '/lovable-uploads/616885e4-604b-4999-8a22-90a738d3c1e0.png', 'Fresh tilapia fish', true, 25),

-- Spices & Seasonings
('Salt', 'Spices & Seasonings', 800, 'kg', '/lovable-uploads/6394ed03-1023-4873-bb46-921839e56f26.png', 'Table salt', true, 100),
('Black Pepper', 'Spices & Seasonings', 15000, 'kg', '/lovable-uploads/64610299-1b2e-480f-ad10-ca5f00ac3808.png', 'Ground black pepper', true, 10),
('Garlic', 'Spices & Seasonings', 5000, 'kg', '/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png', 'Fresh garlic bulbs', true, 20),

-- Cooking Oils
('Sunflower Oil', 'Cooking Oils', 4500, 'liter', '/lovable-uploads/710b4c9d-82af-42d8-a869-ea7b86e0d412.png', 'Pure sunflower cooking oil', true, 60),
('Palm Oil', 'Cooking Oils', 3800, 'liter', '/lovable-uploads/7a70dc62-7dd3-4ce6-8cc2-0fba65f719ec.png', 'Natural palm oil', true, 40),

-- Beverages
('Tea Leaves', 'Beverages', 3000, 'kg', '/lovable-uploads/7bd74977-70dd-4c12-8ccd-42b15a0320c1.png', 'Quality tea leaves', true, 50),
('Coffee Beans', 'Beverages', 8000, 'kg', '/lovable-uploads/7d3300e1-581f-46e6-9b4b-af294fe0d1f1.png', 'Premium coffee beans', true, 30),

-- Snacks
('Peanuts', 'Snacks', 4000, 'kg', '/lovable-uploads/86cf577a-36fe-45d9-866f-53ef4020b437.png', 'Roasted peanuts', true, 40),
('Biscuits', 'Snacks', 2500, 'pack', '/lovable-uploads/87618cc5-dec8-4826-9426-51ad24b6362a.png', 'Assorted biscuits', true, 80),

-- Household Items
('Soap', 'Household Items', 1500, 'piece', '/lovable-uploads/99149a9c-234b-46ab-bd67-67d22129abb2.png', 'Laundry soap bar', true, 100),
('Sugar', 'Household Items', 2200, 'kg', '/lovable-uploads/9f2cd79f-e4c0-491b-8be6-ae53fe6fdc7f.png', 'White sugar', true, 120);

-- Enable Row Level Security for admin management
ALTER TABLE public.custom_buy_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for custom_buy_items
-- Allow public read access for active items (for users to view products)
CREATE POLICY "Anyone can view active custom buy items" ON public.custom_buy_items
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to view all items (for potential admin features)
CREATE POLICY "Authenticated users can view all custom buy items" ON public.custom_buy_items
  FOR SELECT TO authenticated USING (true);

-- Admin policies will be handled through application logic for now
-- (We'll implement proper admin role-based access later)

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_buy_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_buy_items_updated_at_trigger
    BEFORE UPDATE ON public.custom_buy_items
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_buy_items_updated_at();

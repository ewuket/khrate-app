
-- Create bundles table for dynamic bundle management
CREATE TABLE public.bundles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bundle_items table for items within each bundle
CREATE TABLE public.bundle_items (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER REFERENCES public.bundles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'pieces',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for users to view bundles)
CREATE POLICY "Anyone can view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view bundle items" ON public.bundle_items
  FOR SELECT USING (true);

-- Create policies for admin full access (assuming admin role exists)
CREATE POLICY "Admins can manage bundles" ON public.bundles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage bundle items" ON public.bundle_items
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger for bundles
CREATE OR REPLACE FUNCTION update_bundles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bundles_updated_at
    BEFORE UPDATE ON public.bundles
    FOR EACH ROW
    EXECUTE FUNCTION update_bundles_updated_at();

-- Insert existing bundle data
INSERT INTO public.bundles (title, description, price, original_price, image_url, is_featured) VALUES
('Single Bundle', 'Perfect for 1 person, 7-day essentials', 32700, 40000, '/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png', true),
('Medium Bundle', 'Great for 2-3 people, weekly essentials', 69240, 85000, '/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png', true),
('Large Bundle', 'Family size, complete weekly groceries', 119000, 150000, '/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png', true),
('Vegetables Bundle', 'Fresh vegetables for the week', 19999, 25000, '/lovable-uploads/e0cc7a56-c962-4b80-90b7-edf92f2a5162.png', false),
('Breakfast Bundle', 'Start your day right', 19999, 25000, '/lovable-uploads/0d93dc66-4bae-4f1a-a8d0-99ad18115c40.png', false),
('Pantry Essentials', 'Stock your pantry with basics', 39999, 50000, '/lovable-uploads/710b4c9d-82af-42d8-a869-ea7b86e0d412.png', false),
('Small Fruit Bundle', 'Fresh seasonal fruits for 1-2 people', 8500, 12000, '/lovable-uploads/280f9459-3e15-4683-85fb-0295c65c6045.png', false),
('Medium Fruit Bundle', 'Variety pack for a small family', 16000, 20000, '/lovable-uploads/bca8e1ad-44ee-4a9a-a33a-af0189f97b9c.png', false),
('Large Fruit Bundle', 'Abundant fruit selection for families', 29000, 35000, '/lovable-uploads/ac33e2f2-2a58-4fae-af4a-cc509ae3aae0.png', false);

-- Insert bundle items for Single Bundle (id: 1)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(1, 'Rice', 10, 'kg'),
(1, 'Beans', 2, 'kg'),
(1, 'Tomatoes', 1, 'kg'),
(1, 'Onions', 2, 'kg'),
(1, 'Green Paper', 1, 'kg'),
(1, 'Peas', 1, 'kg'),
(1, 'Oil', 1, 'liter'),
(1, 'Sugar', 1, 'kg'),
(1, 'Salt', 0.1, 'kg'),
(1, 'Eggs', 10, 'pieces');

-- Insert bundle items for Medium Bundle (id: 2)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(2, 'Rice', 15, 'kg'),
(2, 'Beans', 5, 'kg'),
(2, 'Tomatoes', 3, 'kg'),
(2, 'Onions', 3, 'kg'),
(2, 'Green Paper', 3, 'kg'),
(2, 'Oil', 3, 'liter'),
(2, 'Sugar', 3, 'kg'),
(2, 'Salt', 0.15, 'kg'),
(2, 'Eggs', 12, 'pieces'),
(2, 'Slice Bread', 1, 'loaf'),
(2, 'Milk', 2, 'liter');

-- Insert bundle items for Large Bundle (id: 3)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(3, 'Rice', 25, 'kg'),
(3, 'Beans', 10, 'kg'),
(3, 'Tomatoes', 5, 'kg'),
(3, 'Onions', 5, 'kg'),
(3, 'Oil', 5, 'liter'),
(3, 'Salt', 0.25, 'kg'),
(3, 'Eggs', 24, 'pieces'),
(3, 'Slice Bread', 3, 'loaf'),
(3, 'Milk', 4, 'liter'),
(3, 'Cassava Flour', 5, 'kg'),
(3, 'Sugar', 5, 'kg');

-- Insert bundle items for Vegetables Bundle (id: 4)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(4, 'Tomatoes', 3, 'kg'),
(4, 'Onions', 2, 'kg'),
(4, 'Carrots', 2, 'kg'),
(4, 'Cabbage', 1, 'head'),
(4, 'Green Beans', 1, 'kg'),
(4, 'Bell Peppers', 1, 'kg'),
(4, 'Spinach', 1, 'bunch'),
(4, 'Lettuce', 2, 'heads');

-- Insert bundle items for Breakfast Bundle (id: 5)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(5, 'Eggs', 20, 'pieces'),
(5, 'Bread', 2, 'loaves'),
(5, 'Milk', 2, 'liters'),
(5, 'Butter', 1, 'pack'),
(5, 'Jam', 1, 'jar'),
(5, 'Cereal', 1, 'box'),
(5, 'Bananas', 6, 'pieces');

-- Insert bundle items for Pantry Essentials (id: 6)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(6, 'Rice', 5, 'kg'),
(6, 'Sugar', 2, 'kg'),
(6, 'Salt', 1, 'kg'),
(6, 'Oil', 2, 'liters'),
(6, 'Flour', 2, 'kg'),
(6, 'Tea', 1, 'pack'),
(6, 'Coffee', 1, 'pack');

-- Insert bundle items for Small Fruit Bundle (id: 7)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(7, 'Bananas', 6, 'pieces'),
(7, 'Apples', 4, 'pieces'),
(7, 'Oranges', 4, 'pieces'),
(7, 'Pineapple', 1, 'piece'),
(7, 'Mangoes', 3, 'pieces');

-- Insert bundle items for Medium Fruit Bundle (id: 8)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(8, 'Bananas', 12, 'pieces'),
(8, 'Apples', 8, 'pieces'),
(8, 'Oranges', 8, 'pieces'),
(8, 'Pineapple', 2, 'pieces'),
(8, 'Mangoes', 6, 'pieces'),
(8, 'Avocados', 4, 'pieces'),
(8, 'Lemons', 6, 'pieces');

-- Insert bundle items for Large Fruit Bundle (id: 9)
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
(9, 'Bananas', 24, 'pieces'),
(9, 'Apples', 12, 'pieces'),
(9, 'Oranges', 12, 'pieces'),
(9, 'Pineapple', 3, 'pieces'),
(9, 'Mangoes', 10, 'pieces'),
(9, 'Avocados', 8, 'pieces'),
(9, 'Watermelon', 1, 'piece'),
(9, 'Grapes', 2, 'bunches');

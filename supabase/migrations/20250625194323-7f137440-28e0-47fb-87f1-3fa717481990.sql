
-- Fix Supabase security warnings by setting search_path for functions
ALTER FUNCTION public.update_bundles_updated_at() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Create admin-specific RLS policies to allow admins to access all data
-- First, create admin policies for orders table
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Admin policy for user_profiles table
CREATE POLICY "Admin can view all user profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Update bundles table to add proper image URLs and better pricing
UPDATE public.bundles SET 
  image_url = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
  price = 15000,
  original_price = 18000
WHERE title = 'Essential Breakfast Bundle';

UPDATE public.bundles SET 
  image_url = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
  price = 25000,
  original_price = 30000
WHERE title = 'Family Essentials';

UPDATE public.bundles SET 
  image_url = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop',
  price = 35000,
  original_price = 42000
WHERE title = 'Premium Household Bundle';

UPDATE public.bundles SET 
  image_url = 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
  price = 18000,
  original_price = 22000
WHERE title = 'Fresh Vegetables Pack';

UPDATE public.bundles SET 
  image_url = 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
  price = 20000,
  original_price = 25000
WHERE title = 'Tropical Fruits Collection';

-- Add more detailed bundle items
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
-- Essential Breakfast Bundle items
((SELECT id FROM bundles WHERE title = 'Essential Breakfast Bundle'), 'Fresh Bread', 2, 'loaves'),
((SELECT id FROM bundles WHERE title = 'Essential Breakfast Bundle'), 'Farm Fresh Eggs', 12, 'pieces'),
((SELECT id FROM bundles WHERE title = 'Essential Breakfast Bundle'), 'Fresh Milk', 1, 'liter'),
((SELECT id FROM bundles WHERE title = 'Essential Breakfast Bundle'), 'Butter', 250, 'grams'),
((SELECT id FROM bundles WHERE title = 'Essential Breakfast Bundle'), 'Honey', 1, 'jar'),

-- Family Essentials items
((SELECT id FROM bundles WHERE title = 'Family Essentials'), 'Premium Rice', 5, 'kg'),
((SELECT id FROM bundles WHERE title = 'Family Essentials'), 'Black Beans', 2, 'kg'),
((SELECT id FROM bundles WHERE title = 'Family Essentials'), 'Cooking Oil', 1, 'liter'),
((SELECT id FROM bundles WHERE title = 'Family Essentials'), 'Onions', 2, 'kg'),
((SELECT id FROM bundles WHERE title = 'Family Essentials'), 'Tomatoes', 1.5, 'kg'),
((SELECT id FROM bundles WHERE title = 'Family Essentials'), 'Salt', 1, 'kg'),

-- Premium Household Bundle items
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Premium Rice', 10, 'kg'),
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Black Beans', 3, 'kg'),
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Extra Virgin Oil', 1, 'liter'),
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Red Onions', 3, 'kg'),
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Fresh Tomatoes', 2, 'kg'),
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Garlic', 500, 'grams'),
((SELECT id FROM bundles WHERE title = 'Premium Household Bundle'), 'Ginger', 300, 'grams'),

-- Fresh Vegetables Pack items
((SELECT id FROM bundles WHERE title = 'Fresh Vegetables Pack'), 'Carrots', 1, 'kg'),
((SELECT id FROM bundles WHERE title = 'Fresh Vegetables Pack'), 'Spinach', 1, 'bunch'),
((SELECT id FROM bundles WHERE title = 'Fresh Vegetables Pack'), 'Lettuce', 2, 'heads'),
((SELECT id FROM bundles WHERE title = 'Fresh Vegetables Pack'), 'Bell Peppers', 500, 'grams'),
((SELECT id FROM bundles WHERE title = 'Fresh Vegetables Pack'), 'Cucumber', 1, 'kg'),
((SELECT id FROM bundles WHERE title = 'Fresh Vegetables Pack'), 'Broccoli', 1, 'head'),

-- Tropical Fruits Collection items
((SELECT id FROM bundles WHERE title = 'Tropical Fruits Collection'), 'Pineapple', 1, 'piece'),
((SELECT id FROM bundles WHERE title = 'Tropical Fruits Collection'), 'Mango', 4, 'pieces'),
((SELECT id FROM bundles WHERE title = 'Tropical Fruits Collection'), 'Papaya', 1, 'piece'),
((SELECT id FROM bundles WHERE title = 'Tropical Fruits Collection'), 'Bananas', 2, 'kg'),
((SELECT id FROM bundles WHERE title = 'Tropical Fruits Collection'), 'Oranges', 1, 'kg'),
((SELECT id FROM bundles WHERE title = 'Tropical Fruits Collection'), 'Passion Fruit', 10, 'pieces');

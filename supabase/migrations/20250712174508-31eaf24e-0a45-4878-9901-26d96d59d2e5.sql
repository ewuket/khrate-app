
-- First, let's add the current admin user to the admin_users table
-- This will enable the is_admin_user() function to return true
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('bamulneg@gmail.com', 'admin', true)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  role = 'admin',
  updated_at = NOW();

-- Add some sample bundles with items to test the system
INSERT INTO public.bundles (title, description, price, original_price, image_url, is_active, is_featured) VALUES
('Fresh Vegetables Bundle', 'A collection of fresh seasonal vegetables', 15.99, 22.99, '/lovable-uploads/fresh-vegetables.jpg', true, true),
('Fruits Combo Pack', 'Mixed seasonal fruits for the family', 12.50, 18.00, '/lovable-uploads/fruits-combo.jpg', true, false),
('Dairy Essentials', 'Milk, cheese, and yogurt combo', 25.00, 30.00, '/lovable-uploads/dairy-pack.jpg', true, true)
ON CONFLICT DO NOTHING;

-- Add bundle items for the bundles
INSERT INTO public.bundle_items (bundle_id, item_name, quantity, unit) VALUES
((SELECT id FROM public.bundles WHERE title = 'Fresh Vegetables Bundle' LIMIT 1), 'Tomatoes', 2, 'kg'),
((SELECT id FROM public.bundles WHERE title = 'Fresh Vegetables Bundle' LIMIT 1), 'Onions', 1, 'kg'),
((SELECT id FROM public.bundles WHERE title = 'Fresh Vegetables Bundle' LIMIT 1), 'Carrots', 1.5, 'kg'),
((SELECT id FROM public.bundles WHERE title = 'Fruits Combo Pack' LIMIT 1), 'Apples', 2, 'kg'),
((SELECT id FROM public.bundles WHERE title = 'Fruits Combo Pack' LIMIT 1), 'Bananas', 1, 'bunch'),
((SELECT id FROM public.bundles WHERE title = 'Fruits Combo Pack' LIMIT 1), 'Oranges', 1.5, 'kg'),
((SELECT id FROM public.bundles WHERE title = 'Dairy Essentials' LIMIT 1), 'Fresh Milk', 2, 'liters'),
((SELECT id FROM public.bundles WHERE title = 'Dairy Essentials' LIMIT 1), 'Greek Yogurt', 500, 'grams'),
((SELECT id FROM public.bundles WHERE title = 'Dairy Essentials' LIMIT 1), 'Cheddar Cheese', 250, 'grams')
ON CONFLICT DO NOTHING;

-- Add sample custom buy items
INSERT INTO public.custom_buy_items (name, description, price, unit, category, stock_quantity, image_url, is_active) VALUES
('Organic Tomatoes', 'Fresh organic tomatoes from local farms', 3.99, 'kg', 'Vegetables', 50, '/lovable-uploads/organic-tomatoes.jpg', true),
('Free Range Eggs', 'Farm fresh free range eggs', 4.50, 'dozen', 'Dairy & Eggs', 30, '/lovable-uploads/free-range-eggs.jpg', true),
('Fresh Bread', 'Daily baked artisan bread', 2.99, 'loaf', 'Bakery', 25, '/lovable-uploads/fresh-bread.jpg', true),
('Premium Rice', 'High quality basmati rice', 8.99, 'kg', 'Grains', 100, '/lovable-uploads/premium-rice.jpg', true),
('Local Honey', 'Pure honey from local beekeepers', 12.99, 'jar', 'Pantry', 15, '/lovable-uploads/local-honey.jpg', true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bundles_active_featured ON public.bundles(is_active, is_featured) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_custom_items_active_category ON public.custom_buy_items(is_active, category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_status_payment ON public.orders(status, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_sessions_status_featured ON public.group_sessions(status, is_featured) WHERE status = 'active';

-- Optimize the admin stats functions for better performance
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE(
  total_orders bigint,
  pending_orders bigint,
  total_revenue numeric,
  active_bundles bigint,
  active_custom_items bigint,
  active_groups bigint,
  total_users bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.orders)::bigint as total_orders,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'pending')::bigint as pending_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE payment_status = 'completed') as total_revenue,
    (SELECT COUNT(*) FROM public.bundles WHERE is_active = true)::bigint as active_bundles,
    (SELECT COUNT(*) FROM public.custom_buy_items WHERE is_active = true)::bigint as active_custom_items,
    (SELECT COUNT(*) FROM public.group_sessions WHERE status = 'active')::bigint as active_groups,
    (SELECT COUNT(*) FROM public.user_profiles)::bigint as total_users;
END;
$$;

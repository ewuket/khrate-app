
-- Fix RLS policies for admin operations
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Custom buy items unified access" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Bundles unified access" ON public.bundles;

-- Create new comprehensive policies for custom_buy_items
CREATE POLICY "Users can view active custom items" ON public.custom_buy_items
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage all custom items" ON public.custom_buy_items
  FOR ALL 
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Create new comprehensive policies for bundles
CREATE POLICY "Users can view active bundles" ON public.bundles
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage all bundles" ON public.bundles
  FOR ALL 
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Add missing columns to group_sessions for items management
ALTER TABLE public.group_sessions 
ADD COLUMN IF NOT EXISTS bundle_items jsonb DEFAULT '[]'::jsonb;

-- Create function to update order statistics in real-time
CREATE OR REPLACE FUNCTION public.get_daily_order_stats()
RETURNS TABLE(
  date_created date,
  bundle_orders bigint,
  custom_orders bigint,
  group_orders bigint,
  total_orders bigint,
  total_revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date_created,
    COUNT(CASE WHEN items::text LIKE '%"type":"bundle"%' THEN 1 END)::bigint as bundle_orders,
    COUNT(CASE WHEN items::text LIKE '%"type":"custom"%' THEN 1 END)::bigint as custom_orders,
    COUNT(CASE WHEN items::text LIKE '%"type":"group"%' THEN 1 END)::bigint as group_orders,
    COUNT(*)::bigint as total_orders,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END), 0) as total_revenue
  FROM public.orders
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(created_at)
  ORDER BY date_created DESC;
END;
$$;

-- Create function for low stock alerts
CREATE OR REPLACE FUNCTION public.get_low_stock_items(threshold integer DEFAULT 10)
RETURNS TABLE(
  id integer,
  name text,
  stock_quantity integer,
  category text,
  price numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cbi.id,
    cbi.name,
    cbi.stock_quantity,
    cbi.category,
    cbi.price
  FROM public.custom_buy_items cbi
  WHERE cbi.stock_quantity <= threshold AND cbi.is_active = true
  ORDER BY cbi.stock_quantity ASC;
END;
$$;

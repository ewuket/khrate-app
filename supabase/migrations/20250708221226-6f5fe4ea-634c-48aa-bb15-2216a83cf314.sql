
-- Phase 1: Fix RLS Performance Issues and Authentication
-- Drop duplicate and conflicting RLS policies that cause performance issues

-- Fix bundles table policies (remove duplicates)
DROP POLICY IF EXISTS "Admins can manage all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can view all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Public read access to active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;

-- Create single consolidated bundles policy
CREATE POLICY "Bundles unified access" ON public.bundles
  FOR ALL 
  USING (
    is_active = true OR 
    (SELECT public.is_admin_user())
  )
  WITH CHECK ((SELECT public.is_admin_user()));

-- Fix bundle_items table policies (remove duplicates)
DROP POLICY IF EXISTS "Admins can manage bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Bundle items access" ON public.bundle_items;

-- Create single consolidated bundle_items policy
CREATE POLICY "Bundle items unified access" ON public.bundle_items
  FOR ALL 
  USING (true)
  WITH CHECK ((SELECT public.is_admin_user()));

-- Fix custom_buy_items table policies (remove duplicates)
DROP POLICY IF EXISTS "Admins can manage custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Public read access to active custom items" ON public.custom_buy_items;

-- Create single consolidated custom_buy_items policy
CREATE POLICY "Custom buy items unified access" ON public.custom_buy_items
  FOR ALL 
  USING (
    is_active = true OR 
    (SELECT public.is_admin_user())
  )
  WITH CHECK ((SELECT public.is_admin_user()));

-- Fix group_sessions table policies (remove duplicates and optimize auth calls)
DROP POLICY IF EXISTS "Admin full access to groups" ON public.group_sessions;
DROP POLICY IF EXISTS "Public read access to active groups" ON public.group_sessions;
DROP POLICY IF EXISTS "User access to their groups" ON public.group_sessions;

-- Create optimized group_sessions policies
CREATE POLICY "Group sessions unified access" ON public.group_sessions
  FOR ALL 
  USING (
    is_public = true OR 
    (SELECT auth.uid()) = leader_id OR 
    public.is_group_member(id, (SELECT auth.uid())) OR
    (SELECT public.is_admin_user())
  )
  WITH CHECK (
    (SELECT auth.uid()) = leader_id OR
    (SELECT public.is_admin_user())
  );

-- Create function to get order statistics by source
CREATE OR REPLACE FUNCTION public.get_admin_order_stats_by_source()
RETURNS TABLE(
  bundle_orders bigint,
  custom_orders bigint,
  group_orders bigint,
  bundle_revenue numeric,
  custom_revenue numeric,
  group_revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN items::text LIKE '%"type":"bundle"%' THEN 1 END)::bigint as bundle_orders,
    COUNT(CASE WHEN items::text LIKE '%"type":"custom"%' THEN 1 END)::bigint as custom_orders,
    COUNT(CASE WHEN items::text LIKE '%"type":"group"%' THEN 1 END)::bigint as group_orders,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' AND items::text LIKE '%"type":"bundle"%' THEN total_amount ELSE 0 END), 0) as bundle_revenue,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' AND items::text LIKE '%"type":"custom"%' THEN total_amount ELSE 0 END), 0) as custom_revenue,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' AND items::text LIKE '%"type":"group"%' THEN total_amount ELSE 0 END), 0) as group_revenue
  FROM public.orders;
END;
$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status) WHERE payment_status = 'completed';
CREATE INDEX IF NOT EXISTS idx_orders_items_type ON public.orders USING gin(items);
CREATE INDEX IF NOT EXISTS idx_bundles_active_featured ON public.bundles(is_active, is_featured) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_custom_items_active ON public.custom_buy_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_group_sessions_status_featured ON public.group_sessions(status, is_featured) WHERE status = 'active';

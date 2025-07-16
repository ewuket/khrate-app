
-- Phase 1: Fix RLS policies to allow admin operations
-- Update bundles policies to ensure admins can create/manage bundles
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;
CREATE POLICY "Admins can manage bundles" ON public.bundles
  FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Update custom_buy_items policies to ensure admins can create/manage items
DROP POLICY IF EXISTS "Admins can manage custom buy items" ON public.custom_buy_items;
CREATE POLICY "Admins can manage custom buy items" ON public.custom_buy_items
  FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Phase 3: Fix group status constraint to allow 'inactive' status
ALTER TABLE public.group_sessions 
DROP CONSTRAINT IF EXISTS group_sessions_status_check;

ALTER TABLE public.group_sessions 
ADD CONSTRAINT group_sessions_status_check 
CHECK (status IN ('active', 'inactive', 'completed'));

-- Phase 4: Create function to get accurate order statistics
CREATE OR REPLACE FUNCTION public.get_admin_order_stats()
RETURNS TABLE(
  total_orders bigint,
  pending_orders bigint,
  total_revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END)::bigint as pending_orders,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END), 0) as total_revenue
  FROM public.orders;
END;
$$;

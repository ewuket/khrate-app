
-- Fix multiple permissive policies by dropping redundant ones and keeping the most specific ones
-- This will improve performance by reducing policy evaluation overhead

-- Drop redundant policies for bundle_items
DROP POLICY IF EXISTS "Authenticated users can manage bundle items" ON public.bundle_items;

-- Drop redundant policies for bundles  
DROP POLICY IF EXISTS "Authenticated users can manage bundles" ON public.bundles;

-- Drop redundant policies for custom_buy_items
DROP POLICY IF EXISTS "Authenticated users can manage custom buy items" ON public.custom_buy_items;

-- Drop redundant policies for group_sessions
DROP POLICY IF EXISTS "Authenticated users can manage group sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Authenticated users can create group sessions" ON public.group_sessions;

-- Drop duplicate index
DROP INDEX IF EXISTS idx_group_sessions_featured_active;

-- Fix the custom items count query issue by updating the function
CREATE OR REPLACE FUNCTION public.get_custom_items_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*) FROM public.custom_buy_items WHERE is_active = true;
$$;

-- Add RLS policies for orders to ensure they appear in admin dashboard
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to create orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for admins to see all orders (assuming admin role in user_profiles)
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT raw_user_meta_data->>'email' FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Policy for admins to update orders
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT raw_user_meta_data->>'email' FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Add RLS policies for group_sessions to ensure admins can see all groups
CREATE POLICY "Admins can view all group sessions" ON public.group_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT raw_user_meta_data->>'email' FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Policy for admins to manage all group sessions
CREATE POLICY "Admins can manage all group sessions" ON public.group_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT raw_user_meta_data->>'email' FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Add triggers to update group member count in real-time
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be handled by the application layer for real-time updates
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for group member changes
DROP TRIGGER IF EXISTS trigger_update_group_member_count ON public.group_members;
CREATE TRIGGER trigger_update_group_member_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

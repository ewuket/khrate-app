
-- Fix database warnings and performance issues

-- 1. Fix function search path security warnings
ALTER FUNCTION public.is_group_member(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.can_access_group(uuid, uuid) SET search_path = '';

-- 2. Clean up multiple permissive policies for better performance

-- Fix bundle_items policies
DROP POLICY IF EXISTS "Allow anonymous users to view bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Authenticated users can manage bundle items" ON public.bundle_items;

CREATE POLICY "Bundle items unified access" ON public.bundle_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage bundle items" ON public.bundle_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix bundles policies
DROP POLICY IF EXISTS "Allow anonymous users to view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Public can view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Authenticated users can manage bundles" ON public.bundles;

CREATE POLICY "Bundles unified access" ON public.bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage bundles" ON public.bundles
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix custom_buy_items policies
DROP POLICY IF EXISTS "Allow anonymous users to view active custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Public can view active custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Authenticated users can manage custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Admins can manage custom buy items" ON public.custom_buy_items;

CREATE POLICY "Custom buy items unified access" ON public.custom_buy_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage custom buy items" ON public.custom_buy_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix user_profiles policies - consolidate overlapping policies
DROP POLICY IF EXISTS "User profiles access policy" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create single comprehensive policy for user_profiles
CREATE POLICY "User profiles comprehensive access" ON public.user_profiles
  FOR ALL USING (
    (SELECT auth.uid()) = id OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  )
  WITH CHECK (
    (SELECT auth.uid()) = id OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  );

-- Remove unused indexes to improve performance
DROP INDEX IF EXISTS idx_bundle_items_bundle_id;
DROP INDEX IF EXISTS idx_cart_items_user_id;
DROP INDEX IF EXISTS idx_group_cart_items_group_session_id;
DROP INDEX IF EXISTS idx_group_cart_items_user_id;
DROP INDEX IF EXISTS idx_group_member_payments_user_id;
DROP INDEX IF EXISTS idx_group_member_payments_group_session_id;
DROP INDEX IF EXISTS idx_group_members_group_session_id;
DROP INDEX IF EXISTS idx_group_sessions_leader_id;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_user_discounts_user_id;
DROP INDEX IF EXISTS idx_orders_user_status;
DROP INDEX IF EXISTS idx_orders_status_created;
DROP INDEX IF EXISTS idx_bundles_active_featured;
DROP INDEX IF EXISTS idx_custom_buy_items_active_category;
DROP INDEX IF EXISTS idx_group_sessions_public_active;

-- Keep only the most useful indexes
CREATE INDEX IF NOT EXISTS idx_group_sessions_featured_active ON public.group_sessions(is_featured, status) WHERE is_featured = true AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_group_members_session_user ON public.group_members(group_session_id, user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON public.orders(status, created_at);

-- Add RLS policies for group_sessions to ensure admins can see all groups
DROP POLICY IF EXISTS "Users can view accessible group sessions" ON public.group_sessions;

CREATE POLICY "Group sessions access policy" ON public.group_sessions
  FOR SELECT USING (
    is_public = true OR 
    (SELECT auth.uid()) = leader_id OR 
    public.is_group_member(id, (SELECT auth.uid())) OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  );

CREATE POLICY "Authenticated users can manage group sessions" ON public.group_sessions
  FOR ALL TO authenticated
  USING (
    (SELECT auth.uid()) = leader_id OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  )
  WITH CHECK (
    (SELECT auth.uid()) = leader_id OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  );

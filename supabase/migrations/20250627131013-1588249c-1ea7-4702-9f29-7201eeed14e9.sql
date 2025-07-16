
-- Phase 1: Security Fixes
-- Fix function search paths for security compliance
ALTER FUNCTION public.update_custom_buy_items_updated_at() SET search_path = '';
ALTER FUNCTION public.update_group_featured_at() SET search_path = '';

-- Phase 2: Database Performance Optimization
-- Fix multiple permissive policies by consolidating them

-- 1. Fix bundle_items table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins can do everything with bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Anyone can read bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Public read access to bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Authenticated users can manage bundle items" ON public.bundle_items;

-- Create single optimized policy for bundle_items
CREATE POLICY "Bundle items access policy" ON public.bundle_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage bundle items" ON public.bundle_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Fix bundles table - consolidate multiple policies
DROP POLICY IF EXISTS "Admins can do everything with bundles" ON public.bundles;
DROP POLICY IF EXISTS "Anyone can read active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Public read access to active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Authenticated users can manage bundles" ON public.bundles;

-- Create single optimized policy for bundles
CREATE POLICY "Public can view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage bundles" ON public.bundles
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Fix custom_buy_items table - consolidate policies
DROP POLICY IF EXISTS "Anyone can view active custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Authenticated users can view all custom buy items" ON public.custom_buy_items;

-- Create single optimized policy for custom_buy_items
CREATE POLICY "Public can view active custom buy items" ON public.custom_buy_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage custom buy items" ON public.custom_buy_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Fix orders table - consolidate policies and fix auth RLS
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Orders access policy" ON public.orders;

-- Create optimized orders policy with proper auth function usage
CREATE POLICY "Orders access policy" ON public.orders
  FOR ALL USING (
    (SELECT auth.uid()) = user_id OR 
    user_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_id OR 
    user_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  );

-- 5. Fix user_profiles table - consolidate policies and fix auth RLS
DROP POLICY IF EXISTS "Admin can view all user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- Create optimized user_profiles policy with proper auth function usage
CREATE POLICY "User profiles access policy" ON public.user_profiles
  FOR SELECT USING (
    (SELECT auth.uid()) = id OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  );

CREATE POLICY "Users can manage own profile" ON public.user_profiles
  FOR ALL USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Phase 2: Add missing indexes for performance (addressing the 13 INFO suggestions)
-- Add indexes for all unindexed foreign keys
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_group_cart_items_group_session_id ON public.group_cart_items(group_session_id);
CREATE INDEX IF NOT EXISTS idx_group_cart_items_user_id ON public.group_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_group_member_payments_user_id ON public.group_member_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_group_member_payments_group_session_id ON public.group_member_payments(group_session_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_session_id ON public.group_members(group_session_id);
CREATE INDEX IF NOT EXISTS idx_group_sessions_leader_id ON public.group_sessions(leader_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_discounts_user_id ON public.user_discounts(user_id);

-- Add composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_bundles_active_featured ON public.bundles(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_custom_buy_items_active_category ON public.custom_buy_items(is_active, category);

-- Remove unused indexes that are not being used
DROP INDEX IF EXISTS idx_group_sessions_featured;
DROP INDEX IF EXISTS idx_group_sessions_location;
DROP INDEX IF EXISTS idx_group_sessions_admin;

-- Add RLS policies for admin access to custom_buy_items
CREATE POLICY "Admins can manage custom buy items" ON public.custom_buy_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
      AND is_active = true
    )
  );

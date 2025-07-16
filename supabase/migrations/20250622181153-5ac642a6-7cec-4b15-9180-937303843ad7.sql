
-- Fix multiple permissive policies by removing duplicates and keeping only the necessary ones

-- 1. Fix bundle_items table - remove admin policy, keep public access
DROP POLICY IF EXISTS "Admins can manage bundle items" ON public.bundle_items;

-- 2. Fix bundles table - remove admin policy, keep public access for active bundles
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;

-- 3. Fix orders table - remove duplicate policies and keep only one comprehensive policy
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;

-- Create single comprehensive order policy
CREATE POLICY "Users can create and view own orders" ON public.orders
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4. Fix user_discounts table - remove duplicate policies
DROP POLICY IF EXISTS "System can insert discounts" ON public.user_discounts;
DROP POLICY IF EXISTS "System can manage user discounts" ON public.user_discounts;
DROP POLICY IF EXISTS "System can manage discounts" ON public.user_discounts;

-- Create single comprehensive user_discounts policy
CREATE POLICY "User discounts management" ON public.user_discounts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for foreign keys to improve performance
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

-- Add composite indexes for commonly queried combinations
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON public.cart_items(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_group_cart_items_session_user ON public.group_cart_items(group_session_id, user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_discounts_user_active ON public.user_discounts(user_id, is_active);

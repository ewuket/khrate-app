-- Fix RLS policies for admin operations

-- 1. Fix admin_users table - remove public read access
DROP POLICY IF EXISTS "Anyone can read admin users for auth checks" ON admin_users;

-- Admin users should only be readable by the is_admin_user function
CREATE POLICY "Admin users readable by function only" ON admin_users
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- 2. Fix group_sessions RLS - private groups should not be publicly visible
DROP POLICY IF EXISTS "Everyone can view public groups" ON group_sessions;

CREATE POLICY "Users can view public or accessible groups" ON group_sessions
  FOR SELECT
  USING (
    is_public = true 
    OR auth.uid() = leader_id 
    OR is_group_member(id, auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- 3. Ensure admin operations work properly for bundles
-- The existing policy should work, but let's make sure it's applied correctly
DROP POLICY IF EXISTS "Admins can manage bundles" ON bundles;

CREATE POLICY "Admins can manage bundles" ON bundles
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Ensure admin operations work properly for custom_buy_items
DROP POLICY IF EXISTS "Admins can manage custom items" ON custom_buy_items;

CREATE POLICY "Admins can manage custom items" ON custom_buy_items
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. Ensure admin operations work for group_sessions
DROP POLICY IF EXISTS "Admins can manage all groups" ON group_sessions;

CREATE POLICY "Admins can manage all groups" ON group_sessions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
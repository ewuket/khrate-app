-- Fix RLS policies for custom_buy_items: allow public read, admin full access
DROP POLICY IF EXISTS "Everyone can view active custom items" ON custom_buy_items;
DROP POLICY IF EXISTS "Admins can manage custom items" ON custom_buy_items;

CREATE POLICY "Public can view active custom items"
ON custom_buy_items
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins have full access to custom items"
ON custom_buy_items
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for bundles: allow public read, admin full access
DROP POLICY IF EXISTS "Everyone can view active bundles" ON bundles;
DROP POLICY IF EXISTS "Admins can manage bundles" ON bundles;

CREATE POLICY "Public can view active bundles"
ON bundles
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins have full access to bundles"
ON bundles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix RLS policies for group_sessions: allow public read of public groups, admin full access
DROP POLICY IF EXISTS "Users can view public or accessible groups" ON group_sessions;
DROP POLICY IF EXISTS "Users can manage their own groups" ON group_sessions;
DROP POLICY IF EXISTS "Admins can manage all groups" ON group_sessions;

CREATE POLICY "Public can view public active groups"
ON group_sessions
FOR SELECT
TO anon, authenticated
USING (is_public = true AND status = 'active');

CREATE POLICY "Users can view accessible groups"
ON group_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = leader_id OR is_group_member(id, auth.uid()));

CREATE POLICY "Users can create their own groups"
ON group_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Users can manage their own groups"
ON group_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = leader_id)
WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Admins have full access to groups"
ON group_sessions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create the admin user role if not exists
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user ID for admin@khrate.com
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@khrate.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Add admin role
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
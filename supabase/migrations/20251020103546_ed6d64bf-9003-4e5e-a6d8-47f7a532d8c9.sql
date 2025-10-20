-- First, ensure demo admin users exist in the database
INSERT INTO public.admin_users (email, role, is_active)
VALUES 
  ('admin@khrate.com', 'admin', true),
  ('bamulneg@gmail.com', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Update RLS policies for admin_users to allow service role operations
DROP POLICY IF EXISTS "Admins can read admin users" ON public.admin_users;

CREATE POLICY "Anyone can read admin users for auth checks"
ON public.admin_users
FOR SELECT
USING (true);

-- Create policy to allow service role to insert admin users
CREATE POLICY "Service role can manage admin users"
ON public.admin_users
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Ensure bundles RLS allows admin operations
DROP POLICY IF EXISTS "Admin full access to bundles" ON public.bundles;
CREATE POLICY "Admin full access to bundles"
ON public.bundles
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Ensure custom_buy_items RLS allows admin operations  
DROP POLICY IF EXISTS "Admin full access to custom items" ON public.custom_buy_items;
CREATE POLICY "Admin full access to custom items"
ON public.custom_buy_items
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Ensure bundle_items RLS allows admin operations
DROP POLICY IF EXISTS "Admin can manage bundle items" ON public.bundle_items;
CREATE POLICY "Admin can manage bundle items"
ON public.bundle_items
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Update group_sessions RLS to ensure admin full access
DROP POLICY IF EXISTS "Group sessions unified access" ON public.group_sessions;
CREATE POLICY "Group sessions unified access"
ON public.group_sessions
FOR ALL
TO authenticated
USING (
  is_admin_user() OR 
  is_public = true OR 
  auth.uid() = leader_id OR 
  is_group_member(id, auth.uid())
)
WITH CHECK (
  is_admin_user() OR 
  auth.uid() = leader_id
);

-- Create a function to safely add admin users
CREATE OR REPLACE FUNCTION public.add_admin_user(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (email, role, is_active)
  VALUES (admin_email, 'admin', true)
  ON CONFLICT (email) DO UPDATE
  SET is_active = true, updated_at = NOW();
END;
$$;

-- Fix RLS policies to allow proper admin management of custom items
-- Drop existing restrictive policy that only allows public read access
DROP POLICY IF EXISTS "Custom buy items public read" ON public.custom_buy_items;

-- Create comprehensive policy for public read access to active items
CREATE POLICY "Public read access to active custom items" ON public.custom_buy_items
  FOR SELECT 
  USING (is_active = true);

-- Ensure admin policy allows all operations for admin users
-- The existing "Admins can manage custom buy items" policy should handle this
-- but let's verify it covers all operations properly

-- Verify the admin function works correctly by updating it
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND is_active = true
  );
$$;

-- Update bundle RLS policies to ensure admins can see all bundles
DROP POLICY IF EXISTS "Bundles access" ON public.bundles;

-- Create separate policies for public and admin access to bundles
CREATE POLICY "Public read access to active bundles" ON public.bundles
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can view all bundles" ON public.bundles
  FOR SELECT 
  TO authenticated
  USING (is_admin_user());

-- Ensure bundle admin management policy exists
CREATE POLICY "Admins can manage all bundles" ON public.bundles
  FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Fix group sessions RLS to ensure admins can manage everything
-- Update the existing policy to be more explicit about admin access
DROP POLICY IF EXISTS "Group sessions optimized access" ON public.group_sessions;

CREATE POLICY "Public read access to active groups" ON public.group_sessions
  FOR SELECT 
  USING (is_public = true AND status = 'active');

CREATE POLICY "User access to their groups" ON public.group_sessions
  FOR ALL 
  TO authenticated
  USING (
    leader_id = auth.uid() OR 
    is_group_member(id, auth.uid())
  )
  WITH CHECK (leader_id = auth.uid());

CREATE POLICY "Admin full access to groups" ON public.group_sessions
  FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

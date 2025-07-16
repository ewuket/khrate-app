
-- Phase 1: Database Cleanup - Remove all existing bundles and custom items as requested
DELETE FROM public.bundle_items;
DELETE FROM public.bundles;
DELETE FROM public.custom_buy_items;

-- Fix admin authentication by ensuring proper admin user exists
-- First, let's make sure the admin user exists in the admin_users table
INSERT INTO public.admin_users (email, is_active, role) 
VALUES ('admin@khrate.com', true, 'admin')
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  role = 'admin';

-- Verify the is_admin_user function works correctly
-- Update the function to be more explicit about checking admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (
      SELECT email FROM auth.users 
      WHERE id = auth.uid()
    )
    AND is_active = true
  );
$$;

-- Update RLS policies for bundles to ensure admin access works properly
DROP POLICY IF EXISTS "Admins can manage all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Users can view active bundles" ON public.bundles;

CREATE POLICY "Admin full access to bundles" ON public.bundles
  FOR ALL USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Public can view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

-- Update RLS policies for custom_buy_items to ensure admin access works properly  
DROP POLICY IF EXISTS "Admins can manage all custom items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Users can view active custom items" ON public.custom_buy_items;

CREATE POLICY "Admin full access to custom items" ON public.custom_buy_items
  FOR ALL USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Public can view active custom items" ON public.custom_buy_items
  FOR SELECT USING (is_active = true);

-- Update bundle_items policies
DROP POLICY IF EXISTS "Bundle items unified access" ON public.bundle_items;

CREATE POLICY "Admin can manage bundle items" ON public.bundle_items
  FOR ALL USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Public can view bundle items" ON public.bundle_items
  FOR SELECT USING (true);

-- Fix orders policies to ensure proper admin access
DROP POLICY IF EXISTS "Orders optimized access" ON public.orders;

CREATE POLICY "Users can manage own orders" ON public.orders
  FOR ALL USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND auth.uid() IS NULL)
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND auth.uid() IS NULL)
  );

CREATE POLICY "Admin full access to orders" ON public.orders
  FOR ALL USING (is_admin_user())
  WITH CHECK (is_admin_user());

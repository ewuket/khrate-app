
-- Fix RLS performance issues and consolidate multiple permissive policies

-- 1. Drop existing problematic policies for orders table
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Orders access policy" ON public.orders;

-- 2. Create optimized single policy for orders with SELECT optimization
CREATE POLICY "Orders comprehensive access" ON public.orders
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

-- 3. Drop existing problematic policies for group_sessions table
DROP POLICY IF EXISTS "Group sessions access policy" ON public.group_sessions;
DROP POLICY IF EXISTS "Admins can view all group sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Admins can manage all group sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Group leaders can delete their sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Group leaders can update their sessions" ON public.group_sessions;

-- 4. Create optimized single policy for group_sessions with SELECT optimization
CREATE POLICY "Group sessions comprehensive access" ON public.group_sessions
  FOR ALL USING (
    is_public = true OR 
    (SELECT auth.uid()) = leader_id OR 
    public.is_group_member(id, (SELECT auth.uid())) OR
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

-- 5. Create a security definer function to check admin status (avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND is_active = true
  );
$$;

-- 6. Update policies to use the security definer function for better performance
DROP POLICY IF EXISTS "Orders comprehensive access" ON public.orders;
CREATE POLICY "Orders optimized access" ON public.orders
  FOR ALL USING (
    (SELECT auth.uid()) = user_id OR 
    user_id IS NULL OR
    public.is_admin_user()
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_id OR 
    user_id IS NULL OR
    public.is_admin_user()
  );

DROP POLICY IF EXISTS "Group sessions comprehensive access" ON public.group_sessions;
CREATE POLICY "Group sessions optimized access" ON public.group_sessions
  FOR ALL USING (
    is_public = true OR 
    (SELECT auth.uid()) = leader_id OR 
    public.is_group_member(id, (SELECT auth.uid())) OR
    public.is_admin_user()
  )
  WITH CHECK (
    (SELECT auth.uid()) = leader_id OR
    public.is_admin_user()
  );

-- 7. Add missing RLS policies for bundle_items to fix bundle update issues
DROP POLICY IF EXISTS "Allow anonymous users to view bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Authenticated users can manage bundle items" ON public.bundle_items;

CREATE POLICY "Bundle items public read" ON public.bundle_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage bundle items" ON public.bundle_items
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- 8. Fix bundles table policies
DROP POLICY IF EXISTS "Allow anonymous users to view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Authenticated users can manage bundles" ON public.bundles;

CREATE POLICY "Bundles public read" ON public.bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage bundles" ON public.bundles
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

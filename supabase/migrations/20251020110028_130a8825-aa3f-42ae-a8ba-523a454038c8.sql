-- Drop old admin_users approach and create proper role-based system
-- This follows security best practices for Supabase RLS

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table with proper foreign key to auth.users
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Grant admin role to existing admin users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email IN ('admin@khrate.com', 'bamulneg@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Update RLS policies to use the new role system

-- Bundles
DROP POLICY IF EXISTS "Admin full access to bundles" ON public.bundles;
DROP POLICY IF EXISTS "Public can view active bundles" ON public.bundles;

CREATE POLICY "Admins can manage bundles"
ON public.bundles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view active bundles"
ON public.bundles
FOR SELECT
USING (is_active = true);

-- Custom Buy Items  
DROP POLICY IF EXISTS "Admin full access to custom items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Public can view active custom items" ON public.custom_buy_items;

CREATE POLICY "Admins can manage custom items"
ON public.custom_buy_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view active custom items"
ON public.custom_buy_items
FOR SELECT
USING (is_active = true);

-- Bundle Items
DROP POLICY IF EXISTS "Admin can manage bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Public can view bundle items" ON public.bundle_items;

CREATE POLICY "Admins can manage bundle items"
ON public.bundle_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view bundle items"
ON public.bundle_items
FOR SELECT
USING (true);

-- Group Sessions
DROP POLICY IF EXISTS "Group sessions unified access" ON public.group_sessions;

CREATE POLICY "Admins can manage all groups"
ON public.group_sessions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their own groups"
ON public.group_sessions
FOR ALL
TO authenticated
USING (auth.uid() = leader_id OR is_group_member(id, auth.uid()))
WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Everyone can view public groups"
ON public.group_sessions
FOR SELECT
USING (is_public = true OR status = 'active');

-- 7. Create helper function to add admin role (for signup flow)
CREATE OR REPLACE FUNCTION public.add_admin_role(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- 8. Update is_admin_user function to use new role system
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Fix infinite recursion in group_members RLS policies by using security definer functions
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave their groups" ON public.group_members;

-- Create security definer function to check group membership without recursion
CREATE OR REPLACE FUNCTION public.is_group_member(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_session_id = group_id AND user_id = user_id
  );
$$;

-- Create security definer function to check if user can access a group
CREATE OR REPLACE FUNCTION public.can_access_group(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_sessions gs
    WHERE gs.id = group_id 
    AND (
      gs.is_public = true 
      OR gs.leader_id = user_id
      OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_session_id = group_id AND gm.user_id = user_id)
    )
  );
$$;

-- Recreate group_members policies using the security definer functions
CREATE POLICY "Users can view members of accessible groups" ON public.group_members
  FOR SELECT USING (public.can_access_group(group_session_id, (select auth.uid())));

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can leave their groups" ON public.group_members
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Fix group_sessions policies to avoid recursion
DROP POLICY IF EXISTS "Users can view accessible group sessions" ON public.group_sessions;

CREATE POLICY "Users can view accessible group sessions" ON public.group_sessions
  FOR SELECT USING (
    is_public = true OR 
    (select auth.uid()) = leader_id OR 
    public.is_group_member(id, (select auth.uid()))
  );

-- Update group_cart_items policies to use security definer function
DROP POLICY IF EXISTS "Users can view group cart items in their groups" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can insert own items in their groups" ON public.group_cart_items;

CREATE POLICY "Users can view group cart items in accessible groups" ON public.group_cart_items
  FOR SELECT USING (public.can_access_group(group_session_id, (select auth.uid())));

CREATE POLICY "Users can insert items in accessible groups" ON public.group_cart_items
  FOR INSERT WITH CHECK (
    (select auth.uid()) = user_id AND 
    public.can_access_group(group_session_id, (select auth.uid()))
  );

-- Fix group_member_payments policies
DROP POLICY IF EXISTS "Users can view group member payments" ON public.group_member_payments;

CREATE POLICY "Users can view payments in accessible groups" ON public.group_member_payments
  FOR SELECT USING (public.can_access_group(group_session_id, (select auth.uid())));

-- Add proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_members_session_user ON public.group_members(group_session_id, user_id);
CREATE INDEX IF NOT EXISTS idx_group_sessions_public_active ON public.group_sessions(is_public, status) WHERE is_public = true AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_group_sessions_featured ON public.group_sessions(is_featured, status) WHERE is_featured = true AND status = 'active';

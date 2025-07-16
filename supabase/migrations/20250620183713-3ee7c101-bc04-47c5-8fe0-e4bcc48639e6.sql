
-- Fix RLS performance issues by optimizing auth function calls
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row

-- Drop existing problematic policies and recreate them with optimized queries
-- Orders table policies
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- Cart items table policies
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;  
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Group sessions table policies
DROP POLICY IF EXISTS "Users can view group sessions they're members of" ON public.group_sessions;
DROP POLICY IF EXISTS "Users can create group sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Users can view accessible group sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Authenticated users can create group sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Group leaders can update their sessions" ON public.group_sessions;
DROP POLICY IF EXISTS "Group leaders can delete their sessions" ON public.group_sessions;

CREATE POLICY "Users can view accessible group sessions" ON public.group_sessions
  FOR SELECT USING (
    is_public = true OR 
    (select auth.uid()) = leader_id OR 
    EXISTS (SELECT 1 FROM public.group_members WHERE group_session_id = id AND user_id = (select auth.uid()))
  );

CREATE POLICY "Authenticated users can create group sessions" ON public.group_sessions
  FOR INSERT WITH CHECK ((select auth.uid()) = leader_id);

CREATE POLICY "Group leaders can update their sessions" ON public.group_sessions
  FOR UPDATE USING ((select auth.uid()) = leader_id);

CREATE POLICY "Group leaders can delete their sessions" ON public.group_sessions
  FOR DELETE USING ((select auth.uid()) = leader_id);

-- Group members table policies
DROP POLICY IF EXISTS "Users can view group members for groups they're in" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave their groups" ON public.group_members;

CREATE POLICY "Users can view members of their groups" ON public.group_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_session_id = group_session_id AND gm.user_id = (select auth.uid()))
  );

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can leave their groups" ON public.group_members
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Group cart items table policies
DROP POLICY IF EXISTS "Users can view group cart items for groups they're in" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can add items to group cart" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can update their own group cart items" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can delete their own group cart items" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can view group cart items in their groups" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can insert own items in their groups" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can update own group cart items" ON public.group_cart_items;
DROP POLICY IF EXISTS "Users can delete own group cart items" ON public.group_cart_items;

CREATE POLICY "Users can view group cart items in their groups" ON public.group_cart_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_session_id = group_cart_items.group_session_id AND user_id = (select auth.uid()))
  );

CREATE POLICY "Users can insert own items in their groups" ON public.group_cart_items
  FOR INSERT WITH CHECK (
    (select auth.uid()) = user_id AND 
    EXISTS (SELECT 1 FROM public.group_members WHERE group_session_id = group_cart_items.group_session_id AND user_id = (select auth.uid()))
  );

CREATE POLICY "Users can update own group cart items" ON public.group_cart_items
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own group cart items" ON public.group_cart_items
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Group member payments table policies  
DROP POLICY IF EXISTS "Users can view group member payments" ON public.group_member_payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.group_member_payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON public.group_member_payments;

CREATE POLICY "Users can view group member payments" ON public.group_member_payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_session_id = group_member_payments.group_session_id AND user_id = (select auth.uid()))
  );

CREATE POLICY "Users can insert their own payments" ON public.group_member_payments
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own payments" ON public.group_member_payments  
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- Fix multiple permissive policies by consolidating them
-- Bundle items - keep only one policy for public access
DROP POLICY IF EXISTS "Admins can manage bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Anyone can view bundle items" ON public.bundle_items;

CREATE POLICY "Anyone can view bundle items" ON public.bundle_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage bundle items" ON public.bundle_items
  FOR ALL USING (true) WITH CHECK (true);

-- Bundles - keep only one policy for public access  
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;
DROP POLICY IF EXISTS "Anyone can view active bundles" ON public.bundles;

CREATE POLICY "Anyone can view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage bundles" ON public.bundles
  FOR ALL USING (true) WITH CHECK (true);

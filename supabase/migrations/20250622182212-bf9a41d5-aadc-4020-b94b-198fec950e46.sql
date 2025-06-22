
-- Fix remaining RLS policy issues and function security

-- 1. Fix the function search path issue
ALTER FUNCTION public.update_bundles_updated_at() SET search_path = '';

-- 2. Fix RLS policies for better performance by using subqueries
-- Drop existing policies that have performance issues
DROP POLICY IF EXISTS "Users can create and view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;

-- Create optimized order policies
CREATE POLICY "Orders access policy" ON public.orders
  FOR ALL USING (
    (SELECT auth.uid()) = user_id OR user_id IS NULL
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_id OR user_id IS NULL
  );

-- Fix user_discounts policies
DROP POLICY IF EXISTS "User discounts management" ON public.user_discounts;
DROP POLICY IF EXISTS "Users can view own discounts" ON public.user_discounts;

-- Create optimized user_discounts policy
CREATE POLICY "User discounts access policy" ON public.user_discounts
  FOR ALL USING (
    (SELECT auth.uid()) = user_id
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_id
  );

-- Add RLS policies for bundles and bundle_items
-- Enable RLS on bundles table
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;

-- Drop existing bundle policies first, then create new ones
DROP POLICY IF EXISTS "Anyone can view active bundles" ON public.bundles;
CREATE POLICY "Anyone can view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

-- Enable RLS on bundle_items table  
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

-- Drop existing bundle_items policies first, then create new ones
DROP POLICY IF EXISTS "Anyone can view bundle items" ON public.bundle_items;
CREATE POLICY "Anyone can view bundle items" ON public.bundle_items
  FOR SELECT USING (true);

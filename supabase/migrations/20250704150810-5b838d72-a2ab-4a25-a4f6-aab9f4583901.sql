
-- Phase 1: Database Security & Performance Fixes

-- 1. Fix function search paths for security compliance
ALTER FUNCTION public.get_custom_items_count() SET search_path = '';
ALTER FUNCTION public.update_group_member_count() SET search_path = '';
ALTER FUNCTION public.notify_admin_on_order() SET search_path = '';

-- 2. Consolidate duplicate RLS policies to improve performance
-- Drop duplicate policies for bundle_items
DROP POLICY IF EXISTS "Bundle items unified access" ON public.bundle_items;
DROP POLICY IF EXISTS "Bundle items public read" ON public.bundle_items;

-- Create single optimized policy for bundle_items
CREATE POLICY "Bundle items access" ON public.bundle_items
  FOR SELECT USING (true);

-- Drop duplicate policies for bundles
DROP POLICY IF EXISTS "Bundles unified access" ON public.bundles;
DROP POLICY IF EXISTS "Bundles public read" ON public.bundles;

-- Create single optimized policy for bundles
CREATE POLICY "Bundles access" ON public.bundles
  FOR SELECT USING (is_active = true);

-- Drop duplicate policies for custom_buy_items (keep only one SELECT policy)
DROP POLICY IF EXISTS "Custom buy items public read" ON public.custom_buy_items;

-- 3. Optimize auth function calls in RLS policies for better performance
-- Fix user_profiles policy to avoid re-evaluation
DROP POLICY IF EXISTS "User profiles comprehensive access" ON public.user_profiles;

CREATE POLICY "User profiles optimized access" ON public.user_profiles
  FOR ALL USING (
    (SELECT auth.uid()) = id OR 
    (SELECT public.is_admin_user())
  )
  WITH CHECK (
    (SELECT auth.uid()) = id OR 
    (SELECT public.is_admin_user())
  );

-- 4. Create optimized function for admin checks to avoid repeated evaluations
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT auth.uid();
$$;

-- Update existing policies to use the optimized function
DROP POLICY IF EXISTS "Orders optimized access" ON public.orders;
CREATE POLICY "Orders optimized access" ON public.orders
  FOR ALL USING (
    (SELECT public.get_current_user_id()) = user_id OR 
    user_id IS NULL OR
    (SELECT public.is_admin_user())
  )
  WITH CHECK (
    (SELECT public.get_current_user_id()) = user_id OR 
    user_id IS NULL OR
    (SELECT public.is_admin_user())
  );

-- Fix group_sessions policy
DROP POLICY IF EXISTS "Group sessions optimized access" ON public.group_sessions;
CREATE POLICY "Group sessions optimized access" ON public.group_sessions
  FOR ALL USING (
    is_public = true OR 
    (SELECT public.get_current_user_id()) = leader_id OR 
    public.is_group_member(id, (SELECT public.get_current_user_id())) OR
    (SELECT public.is_admin_user())
  )
  WITH CHECK (
    (SELECT public.get_current_user_id()) = leader_id OR
    (SELECT public.is_admin_user())
  );

-- 5. Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bundles_active ON public.bundles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_custom_buy_items_active ON public.custom_buy_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_group_sessions_public_status ON public.group_sessions(is_public, status) WHERE is_public = true AND status = 'active';

-- 6. Create function to handle bundle updates safely
CREATE OR REPLACE FUNCTION public.update_bundle_safe(
  bundle_id integer,
  bundle_data jsonb
)
RETURNS TABLE(
  id integer,
  title text,
  description text,
  price numeric,
  original_price numeric,
  image_url text,
  is_featured boolean,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if bundle exists first
  IF NOT EXISTS (SELECT 1 FROM public.bundles WHERE bundles.id = bundle_id) THEN
    RAISE EXCEPTION 'Bundle with ID % not found', bundle_id;
  END IF;

  -- Update the bundle
  RETURN QUERY
  UPDATE public.bundles
  SET 
    title = COALESCE((bundle_data->>'title')::text, bundles.title),
    description = COALESCE((bundle_data->>'description')::text, bundles.description),
    price = COALESCE((bundle_data->>'price')::numeric, bundles.price),
    original_price = COALESCE((bundle_data->>'original_price')::numeric, bundles.original_price),
    image_url = COALESCE((bundle_data->>'image_url')::text, bundles.image_url),
    is_featured = COALESCE((bundle_data->>'is_featured')::boolean, bundles.is_featured),
    is_active = COALESCE((bundle_data->>'is_active')::boolean, bundles.is_active),
    updated_at = NOW()
  WHERE bundles.id = bundle_id
  RETURNING bundles.id, bundles.title, bundles.description, bundles.price, 
           bundles.original_price, bundles.image_url, bundles.is_featured, 
           bundles.is_active, bundles.created_at, bundles.updated_at;
END;
$$;

-- 7. Create function to handle custom item updates safely
CREATE OR REPLACE FUNCTION public.update_custom_item_safe(
  item_id integer,
  item_data jsonb
)
RETURNS TABLE(
  id integer,
  name text,
  description text,
  price numeric,
  unit text,
  category text,
  stock_quantity integer,
  image_url text,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if item exists first
  IF NOT EXISTS (SELECT 1 FROM public.custom_buy_items WHERE custom_buy_items.id = item_id) THEN
    RAISE EXCEPTION 'Custom item with ID % not found', item_id;
  END IF;

  -- Update the item
  RETURN QUERY
  UPDATE public.custom_buy_items
  SET 
    name = COALESCE((item_data->>'name')::text, custom_buy_items.name),
    description = COALESCE((item_data->>'description')::text, custom_buy_items.description),
    price = COALESCE((item_data->>'price')::numeric, custom_buy_items.price),
    unit = COALESCE((item_data->>'unit')::text, custom_buy_items.unit),
    category = COALESCE((item_data->>'category')::text, custom_buy_items.category),
    stock_quantity = COALESCE((item_data->>'stock_quantity')::integer, custom_buy_items.stock_quantity),
    image_url = COALESCE((item_data->>'image_url')::text, custom_buy_items.image_url),
    is_active = COALESCE((item_data->>'is_active')::boolean, custom_buy_items.is_active),
    updated_at = NOW()
  WHERE custom_buy_items.id = item_id
  RETURNING custom_buy_items.id, custom_buy_items.name, custom_buy_items.description, 
           custom_buy_items.price, custom_buy_items.unit, custom_buy_items.category,
           custom_buy_items.stock_quantity, custom_buy_items.image_url, 
           custom_buy_items.is_active, custom_buy_items.created_at, custom_buy_items.updated_at;
END;
$$;

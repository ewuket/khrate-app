
-- Fix RLS policies to allow public access to bundles and custom items

-- 1. Drop existing restrictive policies for bundles
DROP POLICY IF EXISTS "Public can view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Authenticated users can manage bundles" ON public.bundles;

-- 2. Create new public read policy for bundles (allows anonymous users to see active bundles)
CREATE POLICY "Allow anonymous users to view active bundles" ON public.bundles
  FOR SELECT USING (is_active = true);

-- 3. Create admin management policy for bundles
CREATE POLICY "Authenticated users can manage bundles" ON public.bundles
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Drop existing restrictive policies for custom_buy_items
DROP POLICY IF EXISTS "Public can view active custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Authenticated users can manage custom buy items" ON public.custom_buy_items;
DROP POLICY IF EXISTS "Admins can manage custom buy items" ON public.custom_buy_items;

-- 5. Create new public read policy for custom_buy_items (allows anonymous users to see active items)
CREATE POLICY "Allow anonymous users to view active custom buy items" ON public.custom_buy_items
  FOR SELECT USING (is_active = true);

-- 6. Create admin management policy for custom_buy_items
CREATE POLICY "Authenticated users can manage custom buy items" ON public.custom_buy_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Drop existing restrictive policies for bundle_items
DROP POLICY IF EXISTS "Bundle items access policy" ON public.bundle_items;
DROP POLICY IF EXISTS "Authenticated users can manage bundle items" ON public.bundle_items;

-- 8. Create new public read policy for bundle_items (needed for bundle details)
CREATE POLICY "Allow anonymous users to view bundle items" ON public.bundle_items
  FOR SELECT USING (true);

-- 9. Create admin management policy for bundle_items
CREATE POLICY "Authenticated users can manage bundle items" ON public.bundle_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

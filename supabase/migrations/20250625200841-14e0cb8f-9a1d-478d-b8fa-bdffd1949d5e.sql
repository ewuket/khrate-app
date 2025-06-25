
-- Phase 1: Remove problematic RLS policies and make bundles publicly accessible

-- Drop all existing RLS policies on bundles table
DROP POLICY IF EXISTS "Allow public read access to bundles" ON public.bundles;
DROP POLICY IF EXISTS "Anyone can view active bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;

-- Drop all existing RLS policies on bundle_items table  
DROP POLICY IF EXISTS "Allow public read access to bundle_items" ON public.bundle_items;
DROP POLICY IF EXISTS "Anyone can view bundle items" ON public.bundle_items;
DROP POLICY IF EXISTS "Admins can manage bundle items" ON public.bundle_items;

-- Disable RLS on bundles table temporarily to allow public access
ALTER TABLE public.bundles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on bundle_items table temporarily to allow public access
ALTER TABLE public.bundle_items DISABLE ROW LEVEL SECURITY;

-- Create simple public read policies for bundles
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to active bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (is_active = true);

-- Create simple public read policies for bundle_items
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to bundle items" 
  ON public.bundle_items 
  FOR SELECT 
  USING (true);

-- Ensure admin users can manage bundles (for later admin functionality)
CREATE POLICY "Authenticated users can manage bundles" 
  ON public.bundles 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage bundle items" 
  ON public.bundle_items 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

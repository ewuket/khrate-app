
-- Fix multiple permissive policies warnings by removing duplicates
-- Keep only one policy per table for public access

-- Drop duplicate policies for bundles table
DROP POLICY IF EXISTS "Anyone can view active bundles" ON public.bundles;

-- Drop duplicate policies for bundle_items table  
DROP POLICY IF EXISTS "Anyone can view bundle items" ON public.bundle_items;

-- The remaining policies "Allow public read access to bundles" and "Allow public read access to bundle_items" 
-- will handle all the access needs for public data

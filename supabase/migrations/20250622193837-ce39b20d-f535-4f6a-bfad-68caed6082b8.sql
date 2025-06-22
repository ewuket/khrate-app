
-- Add Row Level Security policies for bundles table
-- Allow everyone to read bundles (public data)
CREATE POLICY "Allow public read access to bundles" 
  ON public.bundles 
  FOR SELECT 
  USING (is_active = true);

-- Add Row Level Security policies for bundle_items table  
-- Allow everyone to read bundle items (public data)
CREATE POLICY "Allow public read access to bundle_items" 
  ON public.bundle_items 
  FOR SELECT 
  USING (true);

-- Enable RLS on both tables
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

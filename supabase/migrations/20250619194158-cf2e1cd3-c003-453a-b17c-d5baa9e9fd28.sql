
-- Fix RLS policies for user_profiles table
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    
    -- Create optimized policies
    CREATE POLICY "Users can view own profile" ON user_profiles
      FOR SELECT USING ((select auth.uid()) = id);

    CREATE POLICY "Users can update own profile" ON user_profiles
      FOR UPDATE USING ((select auth.uid()) = id);

    CREATE POLICY "Users can insert own profile" ON user_profiles
      FOR INSERT WITH CHECK ((select auth.uid()) = id);
END $$;

-- Fix RLS policies for user_discounts table
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own discounts" ON user_discounts;
    DROP POLICY IF EXISTS "System can insert discounts" ON user_discounts;
    
    CREATE POLICY "Users can view own discounts" ON user_discounts
      FOR SELECT USING ((select auth.uid()) = user_id);

    CREATE POLICY "System can insert discounts" ON user_discounts
      FOR INSERT WITH CHECK (true);
END $$;

-- Fix RLS policies for orders table
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own orders" ON orders;
    DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
    
    CREATE POLICY "Users can view own orders" ON orders
      FOR SELECT USING ((select auth.uid()) = user_id);

    CREATE POLICY "Anyone can insert orders" ON orders
      FOR INSERT WITH CHECK (true);
END $$;

-- Fix RLS policies for cart_items table
DO $$ 
BEGIN
    -- Drop all existing cart policies
    DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
    DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
    DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
    DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
    DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
    
    CREATE POLICY "Users can view own cart" ON cart_items
      FOR SELECT USING ((select auth.uid()) = user_id);

    CREATE POLICY "Users can insert own cart items" ON cart_items
      FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can update own cart items" ON cart_items
      FOR UPDATE USING ((select auth.uid()) = user_id);

    CREATE POLICY "Users can delete own cart items" ON cart_items
      FOR DELETE USING ((select auth.uid()) = user_id);
END $$;

-- Fix RLS policies for bundles table
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view active bundles" ON bundles;
    DROP POLICY IF EXISTS "Admins can manage bundles" ON bundles;
    
    CREATE POLICY "Anyone can view active bundles" ON bundles
      FOR SELECT USING (is_active = true);

    CREATE POLICY "Admins can manage bundles" ON bundles
      FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Fix RLS policies for bundle_items table  
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view bundle items" ON bundle_items;
    DROP POLICY IF EXISTS "Admins can manage bundle items" ON bundle_items;
    
    CREATE POLICY "Anyone can view bundle items" ON bundle_items
      FOR SELECT USING (true);

    CREATE POLICY "Admins can manage bundle items" ON bundle_items
      FOR ALL USING (true) WITH CHECK (true);
END $$;

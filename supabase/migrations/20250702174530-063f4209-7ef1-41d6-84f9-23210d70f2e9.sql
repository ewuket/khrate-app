
-- Fix permission issues by updating admin access function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND is_active = true
  );
$$;

-- Fix RLS policies for user_profiles to allow admin access
DROP POLICY IF EXISTS "User profiles comprehensive access" ON public.user_profiles;
CREATE POLICY "User profiles comprehensive access" ON public.user_profiles
  FOR ALL USING (
    auth.uid() = id OR 
    public.is_admin_user()
  )
  WITH CHECK (
    auth.uid() = id OR 
    public.is_admin_user()
  );

-- Fix custom_buy_items RLS to allow admin management
DROP POLICY IF EXISTS "Custom buy items unified access" ON public.custom_buy_items;
CREATE POLICY "Custom buy items public read" ON public.custom_buy_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage custom buy items" ON public.custom_buy_items
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Create admin_notifications table for notification system
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system',
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin notifications
CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Create function to create admin notifications
CREATE OR REPLACE FUNCTION public.create_admin_notification(
  p_title text,
  p_message text,
  p_type text DEFAULT 'system'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.admin_notifications (title, message, type)
  VALUES (p_title, p_message, p_type)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create triggers for automatic notifications
CREATE OR REPLACE FUNCTION public.notify_admin_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for new orders
  IF TG_OP = 'INSERT' THEN
    PERFORM public.create_admin_notification(
      'New Order Received',
      'Order #' || NEW.id || ' has been placed with total amount ' || NEW.total_amount,
      'order'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order notifications
DROP TRIGGER IF EXISTS trigger_notify_admin_on_order ON public.orders;
CREATE TRIGGER trigger_notify_admin_on_order
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION notify_admin_on_order();

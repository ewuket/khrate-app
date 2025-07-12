
-- Insert the new admin user with the specified credentials
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('bamulneg@gmail.com', 'admin', true)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  role = 'admin',
  updated_at = NOW();

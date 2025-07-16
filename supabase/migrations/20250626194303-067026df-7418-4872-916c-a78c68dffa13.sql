
-- Add new fields to group_sessions table for enhanced admin management
ALTER TABLE public.group_sessions 
ADD COLUMN is_featured boolean DEFAULT false,
ADD COLUMN location text,
ADD COLUMN region text,
ADD COLUMN featured_at timestamp with time zone,
ADD COLUMN admin_notes text;

-- Create index for better performance on featured groups
CREATE INDEX idx_group_sessions_featured ON public.group_sessions(is_featured, status) WHERE is_featured = true;

-- Create index for location-based queries
CREATE INDEX idx_group_sessions_location ON public.group_sessions(location, region, status);

-- Create index for admin management queries
CREATE INDEX idx_group_sessions_admin ON public.group_sessions(status, order_status, created_at);

-- Add trigger to update featured_at when is_featured changes
CREATE OR REPLACE FUNCTION update_group_featured_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = true AND OLD.is_featured = false THEN
    NEW.featured_at = NOW();
  ELSIF NEW.is_featured = false AND OLD.is_featured = true THEN
    NEW.featured_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_group_featured_at
  BEFORE UPDATE ON public.group_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_group_featured_at();

-- Create function to get featured groups for homepage
CREATE OR REPLACE FUNCTION get_featured_groups()
RETURNS TABLE(
  id uuid,
  name text,
  location text,
  region text,
  member_count bigint,
  max_participants integer,
  discount_percentage integer,
  status text,
  join_code text,
  created_at timestamp with time zone,
  items jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gs.id,
    gs.name,
    gs.location,
    gs.region,
    COUNT(gm.user_id) as member_count,
    gs.max_participants,
    gs.discount_percentage,
    gs.status,
    gs.join_code,
    gs.created_at,
    gs.items
  FROM group_sessions gs
  LEFT JOIN group_members gm ON gs.id = gm.group_session_id
  WHERE gs.is_featured = true 
    AND gs.status = 'active'
  GROUP BY gs.id, gs.name, gs.location, gs.region, gs.max_participants, 
           gs.discount_percentage, gs.status, gs.join_code, gs.created_at, gs.items
  ORDER BY gs.featured_at DESC, gs.created_at DESC
  LIMIT 6;
END;
$$;

-- Create function to get groups by location
CREATE OR REPLACE FUNCTION get_groups_by_location(p_location text DEFAULT NULL, p_region text DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  name text,
  location text,
  region text,
  member_count bigint,
  max_participants integer,
  discount_percentage integer,
  status text,
  join_code text,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gs.id,
    gs.name,
    gs.location,
    gs.region,
    COUNT(gm.user_id) as member_count,
    gs.max_participants,
    gs.discount_percentage,
    gs.status,
    gs.join_code,
    gs.created_at
  FROM group_sessions gs
  LEFT JOIN group_members gm ON gs.id = gm.group_session_id
  WHERE gs.status = 'active'
    AND (p_location IS NULL OR gs.location ILIKE '%' || p_location || '%')
    AND (p_region IS NULL OR gs.region ILIKE '%' || p_region || '%')
  GROUP BY gs.id, gs.name, gs.location, gs.region, gs.max_participants, 
           gs.discount_percentage, gs.status, gs.join_code, gs.created_at
  ORDER BY gs.created_at DESC;
END;
$$;

-- Create function for admin group statistics
CREATE OR REPLACE FUNCTION get_admin_group_stats()
RETURNS TABLE(
  total_groups bigint,
  active_groups bigint,
  featured_groups bigint,
  completed_groups bigint,
  total_members bigint,
  avg_group_size numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_groups,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_groups,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_groups,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_groups,
    (SELECT COUNT(*) FROM group_members) as total_members,
    COALESCE(AVG(member_counts.member_count), 0) as avg_group_size
  FROM group_sessions gs
  LEFT JOIN (
    SELECT group_session_id, COUNT(*) as member_count
    FROM group_members
    GROUP BY group_session_id
  ) member_counts ON gs.id = member_counts.group_session_id;
END;
$$;

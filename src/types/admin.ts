
import { Json } from "@/integrations/supabase/types";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AdminStats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  active_groups: number;
  total_users: number;
}

export interface AdminOrder {
  id: string;
  user_id: string | null;
  items: any[];
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  delivery_date: string | null;
  delivery_time_slot: string | null;
  payment_method: string;
  created_at: string | null;
  phone_number: string | null;
  guest_email?: string | null;
  user_profile: {
    full_name: string;
    email: string;
    phone: string | null;
  };
}

export interface AdminBundle {
  id: number;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  items?: any[];
  items_count?: number;
}

export interface AdminCustomItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  stock_quantity: number | null;
  image_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminGroupSession {
  id: string;
  name: string | null;
  join_code: string;
  leader_id: string;
  min_participants: number;
  max_participants: number;
  discount_percentage: number;
  status: 'active' | 'inactive' | 'completed';
  order_status: string | null;
  created_at: string;
  updated_at: string;
  group_type: string;
  is_public: boolean;
  is_featured: boolean;
  location: string | null;
  region: string | null;
  featured_at: string | null;
  admin_notes: string | null;
  items?: any;
  member_count?: number;
  total_amount?: number;
}

export interface GroupStats {
  total_groups: number;
  active_groups: number;
  featured_groups: number;
  completed_groups: number;
  total_members: number;
  avg_group_size: number;
}

export interface OrderSourceStats {
  bundle_orders: number;
  custom_orders: number;
  group_orders: number;
  bundle_revenue: number;
  custom_revenue: number;
  group_revenue: number;
}

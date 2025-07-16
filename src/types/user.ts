
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  profile_image_url?: string;
  total_orders?: number;
  discount_orders_remaining?: number;
  first_order_discount_used?: boolean;
  created_at?: string;
  updated_at?: string;
}

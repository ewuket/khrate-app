
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  discount_orders_remaining: number;
  total_orders: number;
  profile_image_url?: string;
}

export interface UserDiscount {
  id: string;
  user_id: string;
  discount_type: 'first_time_user';
  discount_percentage: number;
  orders_remaining: number;
  created_at: string;
}

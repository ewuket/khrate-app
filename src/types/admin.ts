
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login?: string;
}

export interface AdminOrder {
  id: string;
  user_id?: string;
  items: any[];
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  delivery_date?: string;
  created_at: string;
  user_profile?: {
    full_name?: string;
    email: string;
    phone?: string;
  };
}

export interface AdminGroupSession {
  id: string;
  name?: string;
  join_code: string;
  leader_id: string;
  member_count: number;
  total_amount: number;
  status: string;
  order_status: string;
  created_at: string;
}

export interface AdminStats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  active_groups: number;
  total_users: number;
}

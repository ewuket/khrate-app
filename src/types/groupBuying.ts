
export interface GroupSession {
  id: string;
  name: string;
  join_code: string;
  leader_id: string;
  min_participants: number;
  max_participants: number;
  discount_percentage: number;
  status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  group_type: string;
  is_public: boolean;
  items?: any;
  member_count?: number;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_session_id: string;
  joined_at: string;
  user_profile?: {
    full_name?: string;
    email: string;
  };
}

export interface GroupCartItem {
  id: string;
  user_id: string;
  group_session_id?: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_unit: string;
  product_type: string;
  product_items?: any;
  created_at?: string;
  updated_at?: string;
}

export interface GroupPayment {
  id: string;
  user_id: string;
  group_session_id: string;
  amount: number;
  payment_status: string;
  payment_method?: string;
  created_at: string;
}

export interface GroupSummary {
  member_count: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  qualifies_for_discount: boolean;
}

export interface GroupPaymentSummary {
  total_members: number;
  paid_members: number;
  pending_members: number;
  total_amount_paid: number;
  group_ready: boolean;
}

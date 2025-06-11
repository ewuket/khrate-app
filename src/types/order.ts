
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  type?: 'bundle' | 'custom' | 'group';
  items?: string[];
}

export interface Order {
  id: string;
  user_id?: string;
  items: OrderItem[];
  total_amount: number;
  original_amount: number;
  discount_applied?: number;
  discount_percentage?: number;
  status: OrderStatus;
  delivery_date?: string;
  delivery_time_slot?: string;
  delivery_address: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

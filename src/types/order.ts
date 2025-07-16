
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

export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export const timeSlots = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM'
];


export type OrderStatus = "pending" | "processing" | "delivered";
export type PaymentStatus = "pending" | "completed" | "failed";

export interface Order {
  id: string;
  user_id?: string;
  guest_email?: string;
  items: any[];
  total_amount: number;
  original_amount: number;
  discount_applied?: number;
  discount_percentage?: number;
  status: OrderStatus;
  delivery_address: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  payment_method: string;
  payment_status: PaymentStatus;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800"
};

export const timeSlots: Record<string, string> = {
  morning: "8AM–11AM",
  midday: "11AM–2PM",
  afternoon: "2PM–5PM",
  evening: "5PM–8PM"
};

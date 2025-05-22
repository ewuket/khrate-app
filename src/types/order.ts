
export type OrderStatus = "pending" | "processing" | "delivered";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  deliveryAddress: string;
  deliverySchedule?: {
    date: string;
    timeSlot: string;
  };
  rating?: {
    submitted: boolean;
    date?: string;
  };
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

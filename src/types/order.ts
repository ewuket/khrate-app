
export type OrderStatus = "pending" | "processing" | "delivered";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  deliveryAddress: string;
}

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800"
};

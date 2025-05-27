
import { Order } from "@/types/order";

export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    created_at: "2025-05-15T00:00:00Z",
    status: "delivered",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil"],
    total_amount: 35000,
    original_amount: 35000,
    delivery_address: "123 University Hostel, KN 5 Ave, Kigali, Rwanda",
    payment_method: "mtn",
    payment_status: "completed"
  },
  {
    id: "ORD-002",
    created_at: "2025-05-10T00:00:00Z",
    status: "delivered",
    items: ["Eggs", "Milk", "Bread", "Sugar", "Tea"],
    total_amount: 22500,
    original_amount: 22500,
    delivery_address: "123 University Hostel, KN 5 Ave, Kigali, Rwanda",
    payment_method: "mtn",
    payment_status: "completed"
  },
  {
    id: "ORD-003",
    created_at: "2025-05-18T00:00:00Z",
    status: "processing",
    items: ["Rice", "Beans", "Salt", "Oil", "Onions", "Tomatoes"],
    total_amount: 42750,
    original_amount: 42750,
    delivery_address: "123 University Hostel, KN 5 Ave, Kigali, Rwanda",
    payment_method: "mtn",
    payment_status: "pending"
  },
  {
    id: "ORD-004",
    created_at: "2025-05-20T00:00:00Z",
    status: "pending",
    items: ["Flour", "Sugar", "Eggs", "Milk", "Baking Powder"],
    total_amount: 28990,
    original_amount: 28990,
    delivery_address: "123 University Hostel, KN 5 Ave, Kigali, Rwanda",
    payment_method: "mtn",
    payment_status: "pending"
  }
];

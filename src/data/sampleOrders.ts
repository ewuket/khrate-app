
import { Order } from "@/types/order";

export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2025-05-15",
    status: "delivered",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil"],
    total: 35000,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  },
  {
    id: "ORD-002",
    date: "2025-05-10",
    status: "delivered",
    items: ["Eggs", "Milk", "Bread", "Sugar", "Tea"],
    total: 22500,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  },
  {
    id: "ORD-003",
    date: "2025-05-18",
    status: "processing",
    items: ["Rice", "Beans", "Salt", "Oil", "Onions", "Tomatoes"],
    total: 42750,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  },
  {
    id: "ORD-004",
    date: "2025-05-20",
    status: "pending",
    items: ["Flour", "Sugar", "Eggs", "Milk", "Baking Powder"],
    total: 28990,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  }
];

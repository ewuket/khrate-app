
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Order } from "@/types/order";
import { sampleOrders } from "@/data/sampleOrders";
import OrdersFilter from "@/components/orders/OrdersFilter";
import OrderCard from "@/components/orders/OrderCard";
import OrdersEmptyState from "@/components/orders/OrdersEmptyState";
import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";
import OrderRatingDialog from "@/components/orders/OrderRatingDialog";

type FilterType = "all" | "pending" | "processing" | "delivered";

const Orders = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  
  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleRateOrder = (order: Order) => {
    setSelectedOrder(order);
    setRatingOpen(true);
  };

  const handleRatingSubmit = (ratedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === ratedOrder.id 
        ? { ...order, rating: { submitted: true, date: new Date().toISOString() } }
        : order
    ));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
            <p className="mt-2 max-w-lg">
              Track and manage your orders
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            <OrdersFilter filter={filter} onFilterChange={setFilter} />
            
            {filteredOrders.length === 0 ? (
              <OrdersEmptyState />
            ) : (
              <div className="space-y-6">
                {filteredOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order}
                    onViewDetails={handleViewDetails}
                    onRateOrder={handleRateOrder}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <OrderDetailsDialog 
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        order={selectedOrder}
      />

      {selectedOrder && (
        <OrderRatingDialog
          open={ratingOpen}
          onOpenChange={setRatingOpen}
          order={selectedOrder}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Orders;

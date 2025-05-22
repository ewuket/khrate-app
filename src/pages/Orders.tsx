
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Order } from "@/types/order";
import OrdersFilter from "@/components/orders/OrdersFilter";
import OrderCard from "@/components/orders/OrderCard";
import OrdersEmptyState from "@/components/orders/OrdersEmptyState";
import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";
import OrderRatingDialog from "@/components/orders/OrderRatingDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "pending" | "processing" | "delivered";

const Orders = () => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Load user-specific orders from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `khrate_orders_${user.id}`;
      const storedOrders = localStorage.getItem(storageKey);
      
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
        } catch (error) {
          console.error("Failed to parse orders", error);
        }
      }
    } else {
      // For guest users, try to load guest orders
      const guestOrders = localStorage.getItem('khrate_guest_orders');
      
      if (guestOrders) {
        try {
          const parsedOrders = JSON.parse(guestOrders);
          setOrders(parsedOrders);
        } catch (error) {
          console.error("Failed to parse guest orders", error);
        }
      }
    }
  }, [isAuthenticated, user]);
  
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
    const updatedOrders = orders.map(order => 
      order.id === ratedOrder.id 
        ? { ...order, rating: { submitted: true, date: new Date().toISOString() } }
        : order
    );
    
    setOrders(updatedOrders);
    
    // Save updated orders to localStorage
    if (isAuthenticated && user) {
      localStorage.setItem(`khrate_orders_${user.id}`, JSON.stringify(updatedOrders));
    } else {
      localStorage.setItem('khrate_guest_orders', JSON.stringify(updatedOrders));
    }
  };

  // For authenticated users who need to log in
  if (!isAuthenticated) {
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
            <div className="container mx-auto text-center">
              <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-semibold mb-4">Sign in to view your orders</h2>
                <p className="text-gray-600 mb-6">
                  Please log in or create an account to view and manage your order history.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={openAuthModal}
                    className="bg-khrate-500 hover:bg-khrate-600 w-full"
                  >
                    Sign In / Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    );
  }
  
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

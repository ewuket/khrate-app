
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderCard from "@/components/orders/OrderCard";
import OrdersEmptyState from "@/components/orders/OrdersEmptyState";
import OrdersFilter from "@/components/orders/OrdersFilter";
import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";
import { Order, OrderStatus } from "@/types/order";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your orders");
      navigate("/");
      setTimeout(() => {
        openAuthModal();
      }, 500);
      return;
    }
  }, [isAuthenticated, navigate, openAuthModal]);

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID, checking localStorage for guest orders');
      const guestOrders = JSON.parse(localStorage.getItem(`khrate_orders_guest`) || '[]');
      setOrders(guestOrders);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);

      // Fetch from Supabase
      const { data: supabaseOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Fetched orders from Supabase:', supabaseOrders);

      // Also check localStorage as backup
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Local storage orders:', localOrders);

      // Combine and deduplicate orders
      const allOrders = [...(supabaseOrders || []), ...localOrders];
      const uniqueOrders = allOrders.reduce((acc, current) => {
        const existingOrder = acc.find(order => order.id === current.id);
        if (!existingOrder) {
          acc.push(current);
        }
        return acc;
      }, [] as Order[]);

      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Fallback to localStorage only
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      setOrders(localOrders);
      
      if (localOrders.length === 0) {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [user?.id, isAuthenticated]);

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  if (!isAuthenticated || !user) {
    return null; // Component will redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
            <p className="text-gray-600">
              Track your orders and view your purchase history
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khrate-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <OrdersEmptyState />
          ) : (
            <>
              <div className="mb-6">
                <OrdersFilter 
                  filter={statusFilter}
                  onFilterChange={setStatusFilter}
                />
              </div>
              
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={showDetailsDialog}
          onOpenChange={(open) => {
            setShowDetailsDialog(open);
            if (!open) {
              setSelectedOrder(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Orders;

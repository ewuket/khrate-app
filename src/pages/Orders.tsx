
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

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID, checking localStorage for guest orders');
      // Check localStorage for guest orders
      const guestOrders = JSON.parse(localStorage.getItem(`khrate_orders_guest`) || '[]');
      setOrders(guestOrders);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);

      // Fetch from Supabase first
      const { data: supabaseOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Supabase orders:', supabaseOrders);

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

      console.log('Combined unique orders:', uniqueOrders);

      // Sort by creation date
      uniqueOrders.sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );

      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Fallback to localStorage only
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Fallback to localStorage orders:', localOrders);
      setOrders(localOrders);
      
      if (localOrders.length === 0) {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleReorder = async (order: Order) => {
    toast.success("Items added to your cart");
    // In a real app, we would add the items to the cart here
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600">You need to sign in to view your order history.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
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

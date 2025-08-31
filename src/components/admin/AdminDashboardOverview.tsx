
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Clock, 
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { AdminOrder } from "@/types/admin";

const AdminDashboardOverview = () => {
  const { stats, orders, bundles, loading, refreshAllData } = useAdminData();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOperations();
  const [activeOrderTab, setActiveOrderTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const newStatus = prompt(`Change status from "${currentStatus}" to:`, currentStatus);
    
    if (newStatus && statusOptions.includes(newStatus) && newStatus !== currentStatus) {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        setTimeout(() => refreshAllData(), 1000);
      }
    }
  };

  const handlePaymentStatusChange = async (orderId: string, currentStatus: string) => {
    const paymentOptions = ['pending', 'completed', 'failed'];
    const newStatus = prompt(`Change payment status from "${currentStatus}" to:`, currentStatus);
    
    if (newStatus && paymentOptions.includes(newStatus) && newStatus !== currentStatus) {
      const success = await updatePaymentStatus(orderId, newStatus);
      if (success) {
        setTimeout(() => refreshAllData(), 1000);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    switch (activeOrderTab) {
      case 'pending': return order.status === 'pending';
      case 'processing': return ['confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
      case 'completed': return order.status === 'delivered';
      case 'cancelled': return order.status === 'cancelled';
      default: return true;
    }
  });

  const recentOrders = orders.slice(0, 10);
  const activeBundles = bundles.filter(bundle => bundle.is_active).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_orders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_orders}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {stats.total_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_groups}</div>
            <p className="text-xs text-muted-foreground">Group buying sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Management Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Manage and track all orders</CardDescription>
                </div>
                <Button
                  onClick={refreshAllData}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeOrderTab} className="space-y-4 mt-4">
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No orders found in this category
                      </div>
                    ) : (
                      filteredOrders.map((order: AdminOrder) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Order #{order.id.slice(-8)}</p>
                              <p className="text-sm text-gray-600">
                                {order.user_profile?.full_name || 'Guest'} • RWF {order.total_amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.created_at || '').toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, order.status)}
                              >
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePaymentStatusChange(order.id, order.payment_status)}
                              >
                                <Badge className={getPaymentStatusColor(order.payment_status)}>
                                  {order.payment_status}
                                </Badge>
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Items: {Array.isArray(order.items) ? order.items.length : 0} • 
                            Delivery: {order.delivery_address || 'Not specified'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Active Bundles Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Bundles
              </CardTitle>
              <CardDescription>Currently available bundles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeBundles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No active bundles
                  </div>
                ) : (
                  activeBundles.map((bundle) => (
                    <div key={bundle.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <img
                          src={bundle.image_url || '/placeholder.svg'}
                          alt={bundle.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{bundle.title}</p>
                          <p className="text-xs text-gray-600">
                            RWF {bundle.price.toLocaleString()}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {bundle.is_featured && (
                              <Badge variant="secondary" className="text-xs">Featured</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {bundle.items_count || 0} items
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;

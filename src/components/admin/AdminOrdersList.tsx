
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminOrder } from "@/types/admin";
import { statusColors } from "@/types/order";
import { DollarSign, Edit, Eye, Phone } from "lucide-react";
import AdminOrderStatusDialog from "./AdminOrderStatusDialog";
import AdminOrderDetailsModal from "./AdminOrderDetailsModal";

interface AdminOrdersListProps {
  orders: AdminOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: string) => Promise<boolean>;
  onUpdatePaymentStatus: (orderId: string, newStatus: string) => Promise<boolean>;
}

const AdminOrdersList = ({ 
  orders, 
  onUpdateOrderStatus, 
  onUpdatePaymentStatus 
}: AdminOrdersListProps) => {
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    orderId: string;
    currentStatus: string;
    type: 'order' | 'payment';
  }>({
    open: false,
    orderId: '',
    currentStatus: '',
    type: 'order'
  });

  const [orderDetailsModal, setOrderDetailsModal] = useState<{
    open: boolean;
    order: AdminOrder | null;
  }>({
    open: false,
    order: null
  });

  const handleOpenStatusDialog = (orderId: string, currentStatus: string, type: 'order' | 'payment') => {
    setStatusDialog({
      open: true,
      orderId,
      currentStatus,
      type
    });
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (statusDialog.type === 'order') {
      return await onUpdateOrderStatus(orderId, newStatus);
    } else {
      return await onUpdatePaymentStatus(orderId, newStatus);
    }
  };

  const handleViewOrderDetails = (order: AdminOrder) => {
    setOrderDetailsModal({
      open: true,
      order
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          ) : (
            orders.slice(0, 15).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleViewOrderDetails(order)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">
                      {order.user_profile?.full_name || 'Guest User'}
                    </span>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge 
                      variant={order.payment_status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.payment_status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {order.total_amount.toLocaleString()} RWF • {order.items.length} items
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(order.created_at || '').toLocaleDateString()}</span>
                    {order.phone_number && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{order.phone_number}</span>
                      </div>
                    )}
                    <span className="text-blue-600 hover:text-blue-800">Click to view details</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenStatusDialog(order.id, order.payment_status, 'payment');
                    }}
                    title="Update Payment Status"
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenStatusDialog(order.id, order.status, 'order');
                    }}
                    title="Update Order Status"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOrderDetails(order);
                    }}
                    title="View Order Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AdminOrderStatusDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog(prev => ({ ...prev, open }))}
        currentStatus={statusDialog.currentStatus}
        orderId={statusDialog.orderId}
        onStatusUpdate={handleStatusUpdate}
        type={statusDialog.type}
      />

      <AdminOrderDetailsModal
        open={orderDetailsModal.open}
        onOpenChange={(open) => setOrderDetailsModal(prev => ({ ...prev, open }))}
        order={orderDetailsModal.order}
      />
    </>
  );
};

export default AdminOrdersList;

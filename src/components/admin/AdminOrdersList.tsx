
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminOrder } from "@/types/admin";
import { statusColors } from "@/types/order";
import { DollarSign, Edit, Eye } from "lucide-react";
import AdminOrderStatusDialog from "./AdminOrderStatusDialog";

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
            orders.slice(0, 10).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">
                      {order.user_profile?.full_name || 'Guest User'}
                    </span>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.total_amount.toLocaleString()} RWF • {order.items.length} items
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenStatusDialog(order.id, order.payment_status, 'payment')}
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenStatusDialog(order.id, order.status, 'order')}
                  >
                    <Edit className="h-4 w-4" />
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
    </>
  );
};

export default AdminOrdersList;

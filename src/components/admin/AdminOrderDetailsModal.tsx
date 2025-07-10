
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AdminOrder } from "@/types/admin";
import { statusColors } from "@/types/order";

interface AdminOrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
}

const AdminOrderDetailsModal = ({ open, onOpenChange, order }: AdminOrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {order.user_profile?.full_name || 'Guest User'}</p>
                <p><span className="font-medium">Email:</span> {order.user_profile?.email || order.guest_email || 'N/A'}</p>
                <p><span className="font-medium">Phone:</span> {order.phone_number || order.user_profile?.phone || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Order Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Order Status:</span>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Payment Status:</span>
                  <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                    {order.payment_status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Address:</span> {order.delivery_address}</p>
              <p><span className="font-medium">Date:</span> {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Not specified'}</p>
              <p><span className="font-medium">Time Slot:</span> {order.delivery_time_slot || 'Not specified'}</p>
              <p><span className="font-medium">Payment Method:</span> {order.payment_method}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Unit Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <div>
                          <p className="font-medium">{item.name || item.title}</p>
                          {item.type && (
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">{item.quantity} {item.unit || 'pcs'}</td>
                      <td className="px-4 py-2">{item.price?.toLocaleString()} RWF</td>
                      <td className="px-4 py-2">{(item.price * item.quantity)?.toLocaleString()} RWF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span>{order.total_amount.toLocaleString()} RWF</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Order placed on {new Date(order.created_at || '').toLocaleString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderDetailsModal;

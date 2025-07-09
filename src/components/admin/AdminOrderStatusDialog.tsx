
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

interface AdminOrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string;
  orderId: string;
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<boolean>;
  type: 'order' | 'payment';
}

const AdminOrderStatusDialog = ({
  open,
  onOpenChange,
  currentStatus,
  orderId,
  onStatusUpdate,
  type
}: AdminOrderStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  const paymentStatuses = ['pending', 'completed', 'failed'];

  const statuses = type === 'order' ? orderStatuses : paymentStatuses;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) {
      onOpenChange(false);
      return;
    }

    setIsUpdating(true);
    const success = await onStatusUpdate(orderId, selectedStatus);
    setIsUpdating(false);
    
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Update {type === 'order' ? 'Order' : 'Payment'} Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Current Status
            </label>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              New Status
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(status)} variant="outline">
                        {status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || selectedStatus === currentStatus}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderStatusDialog;

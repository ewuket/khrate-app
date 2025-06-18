
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    id: string;
    items: any[];
    total_amount: number;
    delivery_address: string;
    delivery_date?: string;
    delivery_time_slot?: string;
    payment_method: string;
  };
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'To be scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            Order Placed Successfully!
          </DialogTitle>
        </DialogHeader>
        
        {orderData && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Order ID</p>
              <Badge variant="secondary" className="text-sm font-mono">
                {orderData.id.slice(0, 8).toUpperCase()}
              </Badge>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-khrate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Items Ordered</p>
                  <div className="text-sm text-gray-600">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-khrate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-600">{orderData.delivery_address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-khrate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Delivery Schedule</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(orderData.delivery_date)}
                    {orderData.delivery_time_slot && (
                      <span className="block">{orderData.delivery_time_slot}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-bold text-khrate-600">
                    {formatPrice(orderData.total_amount)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Payment Method: {orderData.payment_method}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                We'll send you updates about your order via email. 
                You can also track your order in the Orders section.
              </p>
            </div>

            <Button onClick={onClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;

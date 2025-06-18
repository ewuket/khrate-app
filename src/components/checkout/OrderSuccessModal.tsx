
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Clock, MapPin, CreditCard } from 'lucide-react';
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
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateOrderId = (id: string) => {
    return id.slice(0, 8).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <DialogTitle className="text-xl text-green-600">
              Order Placed Successfully!
            </DialogTitle>
            <p className="text-khrate-600 font-medium">
              Thank you for ordering with Khrate!
            </p>
          </div>
        </DialogHeader>
        
        {orderData && (
          <div className="space-y-4 mt-4">
            <div className="text-center bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2 text-sm">Order ID</p>
              <Badge variant="secondary" className="text-lg font-mono px-4 py-2">
                {generateOrderId(orderData.id)}
              </Badge>
            </div>

            <div className="bg-khrate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-khrate-700">Total Amount</span>
                <span className="text-xl font-bold text-khrate-600">
                  {formatPrice(orderData.total_amount)}
                </span>
              </div>
              <p className="text-sm text-khrate-600">
                Payment: {orderData.payment_method.replace('_', ' ').toUpperCase()}
              </p>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-khrate-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Items Ordered</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    {orderData.items.map((item, index) => (
                      <div key={index}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-khrate-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Delivery Address</p>
                  <p className="text-xs text-gray-600">{orderData.delivery_address}</p>
                </div>
              </div>

              {(orderData.delivery_date || orderData.delivery_time_slot) && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-khrate-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Delivery Schedule</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(orderData.delivery_date)}
                      {orderData.delivery_time_slot && (
                        <span className="block">{orderData.delivery_time_slot}</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                We'll contact you shortly to confirm your order details. 
                You can track your order status in your profile.
              </p>
            </div>

            <Button onClick={onClose} className="w-full bg-khrate-500 hover:bg-khrate-600">
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, MapPin, Calendar, CreditCard } from "lucide-react";

interface OrderDetails {
  id?: string;
  total_amount: number;
  delivery_address: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  payment_method: string;
  items?: any[];
}

interface EnhancedOrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: OrderDetails | null;
}

const EnhancedOrderSuccessModal: React.FC<EnhancedOrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Order Placed Successfully! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {orderData && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Order Total</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(orderData.total_amount)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Delivery Address</p>
                    <p className="text-sm text-gray-600">{orderData.delivery_address}</p>
                  </div>
                </div>

                {orderData.delivery_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Schedule</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(orderData.delivery_date)}
                        {orderData.delivery_time_slot && ` at ${orderData.delivery_time_slot}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Payment Method</p>
                    <p className="text-sm text-gray-600 capitalize">{orderData.payment_method}</p>
                  </div>
                </div>
              </div>

              {orderData.payment_method === 'momo' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium text-blue-800 mb-2">Payment Instructions</p>
                  <p className="text-sm text-blue-700">
                    Please send <span className="font-bold">{formatPrice(orderData.total_amount)}</span> to:
                  </p>
                  <p className="text-lg font-bold text-blue-900 mt-1">0795754391</p>
                </div>
              )}
            </>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              Thank you for your order! We'll contact you soon to confirm delivery details.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            className="bg-khrate-500 hover:bg-khrate-600 px-8"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOrderSuccessModal;

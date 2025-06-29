
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Clock, MapPin, Phone, Mail, Copy } from "lucide-react";
import { Order, OrderItem } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface EnhancedOrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const EnhancedOrderSuccessModal: React.FC<EnhancedOrderSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  order 
}) => {
  if (!order) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success('Order ID copied to clipboard!');
  };

  const getDeliveryMessage = () => {
    if (order.delivery_date && order.delivery_time_slot) {
      return `${new Date(order.delivery_date).toLocaleDateString()} at ${order.delivery_time_slot}`;
    }
    return 'We will contact you to schedule delivery';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Order Placed Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
            <p className="text-green-700">
              Your order has been successfully placed and will be processed shortly.
            </p>
          </div>

          {/* Order Details */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyOrderId}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {order.id.substring(0, 8)}...
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className="mt-1">
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge variant="outline" className="mt-1">
                    {order.payment_status}
                  </Badge>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Items Ordered
                </h4>
                {order.items.map((item: OrderItem, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} {item.unit || 'item'}(s)
                      </p>
                      {item.items && item.items.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Bundle includes: {item.items.join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-2">
                {order.original_amount && order.original_amount !== order.total_amount && (
                  <div className="flex justify-between text-sm">
                    <span>Original Amount</span>
                    <span className="line-through text-muted-foreground">
                      {formatCurrency(order.original_amount)}
                    </span>
                  </div>
                )}
                {order.discount_applied && order.discount_applied > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      Discount Applied ({order.discount_percentage || 0}%)
                    </span>
                    <span>-{formatCurrency(order.discount_applied)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expected Delivery
                  </p>
                  <p className="font-medium">{getDeliveryMessage()}</p>
                </div>
                {order.phone_number && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Contact Number
                    </p>
                    <p className="font-medium">{order.phone_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">What's Next?</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email confirmation shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Our team will contact you to confirm delivery details</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Track your order status in your profile</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="flex-1 bg-khrate-500 hover:bg-khrate-600">
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/orders'} className="flex-1">
              View Order History
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOrderSuccessModal;

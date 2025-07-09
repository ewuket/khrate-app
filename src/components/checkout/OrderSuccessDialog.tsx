
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Calendar, MapPin } from "lucide-react";
import { Order } from "@/types/order";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onContinueShopping: () => void;
}

const OrderSuccessDialog = ({ 
  open, 
  onOpenChange, 
  order, 
  onContinueShopping 
}: OrderSuccessDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-green-800">
            Order Placed Successfully! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <p className="text-green-800 font-medium">
                  Thank you for your order!
                </p>
                <div className="text-2xl font-bold text-green-900">
                  {order.total_amount.toLocaleString()} RWF
                </div>
                <p className="text-sm text-green-700">
                  Payment amount charged
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Package className="w-4 h-4 text-gray-500" />
              <span>{order.items.length} items ordered</span>
            </div>
            
            {order.delivery_date && (
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Delivery: {new Date(order.delivery_date).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <span className="flex-1">{order.delivery_address}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Order ID:</strong> {order.id.slice(0, 8)}...
            </p>
            <p className="text-xs text-blue-700 mt-1">
              You can track your order status in the Orders section of your account.
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={onContinueShopping}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;

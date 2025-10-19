
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBasket, Star } from "lucide-react";
import { toast } from "sonner";
import { Order, statusColors } from "@/types/order";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onRateOrder?: (order: Order) => void;
}

const OrderCard = ({ order, onViewDetails, onRateOrder }: OrderCardProps) => {
  const handleOrderAgain = (order: Order) => {
    // Add order items back to cart
    const cartItems = Array.isArray(order.items) ? order.items : [];
    
    cartItems.forEach((item: any) => {
      const cartItem = {
        id: item.id || Math.random().toString(),
        product_id: item.id || 0,
        product_name: item.name || 'Item',
        product_price: item.price || 0,
        quantity: item.quantity || 1,
        product_unit: item.unit || 'item',
        product_type: (item.type || 'custom') as 'bundle' | 'custom' | 'group',
        product_items: item.items || []
      };
      
      // Store in localStorage for immediate cart update
      const currentCart = JSON.parse(localStorage.getItem('khrate_cart') || '[]');
      const existingIndex = currentCart.findIndex((ci: any) => 
        ci.product_id === cartItem.product_id && ci.product_type === cartItem.product_type
      );
      
      if (existingIndex >= 0) {
        currentCart[existingIndex].quantity += cartItem.quantity;
      } else {
        currentCart.push(cartItem);
      }
      
      localStorage.setItem('khrate_cart', JSON.stringify(currentCart));
    });
    
    toast.success(`${cartItems.length} items added to your cart`);
    window.dispatchEvent(new Event('storage')); // Trigger cart update
  };

  const canRate = order.status === "delivered" && onRateOrder;

  return (
    <Card key={order.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold text-lg">{order.id}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              Ordered on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
            </p>
            
            <div className="text-sm text-muted-foreground mb-3">
              <span className="font-medium">Items:</span> {Array.isArray(order.items) ? order.items.map(item => typeof item === 'string' ? item : item.name || 'Item').join(", ") : 'No items'}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Delivery Address:</span> {order.delivery_address}
            </div>

            {order.delivery_date && order.delivery_time_slot && (
              <div className="text-sm text-muted-foreground mt-3">
                <span className="font-medium">Delivery Schedule:</span> {new Date(order.delivery_date).toLocaleDateString()} ({order.delivery_time_slot})
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold mb-4">{order.total_amount.toLocaleString()} RWF</div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full md:w-auto"
                onClick={() => onViewDetails(order)}
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {canRate && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => onRateOrder(order)}
                >
                  Rate Order
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full md:w-auto"
                onClick={() => handleOrderAgain(order)}
              >
                Order Again
                <ShoppingBasket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

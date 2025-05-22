
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { Order, statusColors } from "@/types/order";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const handleOrderAgain = (order: Order) => {
    toast.success("Items added to your cart");
    // In a real app, we would add the items to the cart here
  };

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
              Ordered on {new Date(order.date).toLocaleDateString()}
            </p>
            
            <div className="text-sm text-muted-foreground mb-3">
              <span className="font-medium">Items:</span> {order.items.join(", ")}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Delivery Address:</span> {order.deliveryAddress}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold mb-4">{order.total.toLocaleString()} RWF</div>
            
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

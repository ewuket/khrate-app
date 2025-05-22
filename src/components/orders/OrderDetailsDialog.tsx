
import React from "react";
import { Button } from "@/components/ui/button";
import { X, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Order, statusColors } from "@/types/order";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const OrderDetailsDialog = ({ open, onOpenChange, order }: OrderDetailsDialogProps) => {
  const handleOrderAgain = (order: Order) => {
    toast.success("Items added to your cart");
    // In a real app, we would add the items to the cart here
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Order Details
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{order.id}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">
              Ordered on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          
          <div className="border-t border-b py-3">
            <h4 className="font-medium mb-2">Items</h4>
            <ul className="space-y-1">
              {order.items.map((item, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-sm"><span className="font-medium">Delivery Address:</span> {order.deliveryAddress}</p>
          </div>
          
          <div className="flex justify-between items-center font-bold">
            <span>Total Amount:</span>
            <span>{order.total.toLocaleString()} RWF</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="bg-khrate-500 hover:bg-khrate-600 w-full"
            onClick={() => {
              handleOrderAgain(order);
              onOpenChange(false);
            }}
          >
            Order Again
            <ShoppingBasket className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;

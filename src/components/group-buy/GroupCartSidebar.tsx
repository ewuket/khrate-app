
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

interface GroupCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupCartSidebar: React.FC<GroupCartSidebarProps> = ({ isOpen, onClose }) => {
  const { 
    groupCart, 
    groupSummary,
    groupMembers,
    updateGroupCartItemQuantity,
    removeItemFromGroupCart
  } = useGroupBuying();

  const getGroupTotal = () => {
    return groupCart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // TODO: Implement group checkout logic
    console.log('Group checkout clicked');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Group Cart
            <Badge variant="secondary">{groupMembers.length} members</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {groupCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">Your group cart is empty</p>
                <Button onClick={onClose} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {groupCart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.product_price)} per {item.product_unit}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGroupCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGroupCartItemQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemFromGroupCart(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {groupCart.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(getGroupTotal())}</span>
                </div>
                
                {groupSummary && groupSummary.qualifies_for_discount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Group Discount:</span>
                    <span>-{formatCurrency(groupSummary.discount_amount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(groupSummary?.final_amount || getGroupTotal())}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-khrate-500 hover:bg-khrate-600"
                onClick={handleCheckout}
              >
                Proceed to Group Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GroupCartSidebar;

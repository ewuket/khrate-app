
import React, { useEffect } from 'react';
import { X, ShoppingCart, Users, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import CartItem from "@/components/cart/CartItem";

interface GroupCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupCartSidebar: React.FC<GroupCartSidebarProps> = ({ isOpen, onClose }) => {
  const { 
    currentGroup,
    groupCart, 
    groupSummary,
    removeItemFromGroupCart,
    updateGroupCartItemQuantity,
    completeGroupPayment,
    getGroupTotal
  } = useGroupBuying();

  // Listen for custom event to open group cart
  useEffect(() => {
    const handleOpenGroupCart = () => {
      if (currentGroup) {
        // Force the cart to open
        window.dispatchEvent(new CustomEvent('openGroupCartSidebar'));
      }
    };

    window.addEventListener('openGroupCart', handleOpenGroupCart);
    return () => window.removeEventListener('openGroupCart', handleOpenGroupCart);
  }, [currentGroup]);

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  const handleCheckout = async () => {
    const success = await completeGroupPayment();
    if (success) {
      onClose();
    }
  };

  if (!currentGroup) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row justify-between items-center">
          <SheetTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Group Cart
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>

        <div className="py-4">
          <div className="mb-4 p-3 bg-khrate-50 rounded-lg">
            <h3 className="font-medium text-khrate-700 mb-1">{currentGroup.name}</h3>
            <p className="text-sm text-khrate-600">
              {groupSummary?.member_count || 0} members • {groupSummary?.qualifies_for_discount ? `${currentGroup.discount_percentage}% discount active` : 'No discount yet'}
            </p>
          </div>

          {groupCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-20" />
              <div>
                <h3 className="font-medium mb-1">Your group cart is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Add items from bundles or custom buy to get started.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {groupCart.map((item) => (
                  <CartItem 
                    key={item.id}
                    item={{
                      id: item.product_id,
                      name: item.product_name,
                      price: item.product_price,
                      quantity: item.quantity,
                      unit: item.product_unit
                    }}
                    formatPrice={formatPrice}
                    onUpdateQuantity={(id, quantity) => updateGroupCartItemQuantity(item.id, quantity)}
                    onRemoveFromCart={() => removeItemFromGroupCart(item.id)}
                  />
                ))}
              </div>

              {groupSummary && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4" />
                    <span className="font-medium">Group Summary</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(groupSummary.total_amount)}</span>
                    </div>
                    
                    {groupSummary.qualifies_for_discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Group Discount ({currentGroup.discount_percentage}%)</span>
                        <span>-{formatPrice(groupSummary.discount_amount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>{formatPrice(groupSummary.final_amount)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-khrate-500 hover:bg-khrate-600 mt-4"
                  >
                    Complete Payment
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GroupCartSidebar;


import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import CartSummary from "./CartSummary";
import CheckoutDialog from "../checkout/CheckoutDialog";
import GuestCheckoutOption from "../checkout/GuestCheckoutOption";

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    syncCart 
  } = useCartContext();
  
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showGuestOptions, setShowGuestOptions] = useState(false);

  // Sync cart when sidebar opens to ensure latest data
  useEffect(() => {
    if (isCartOpen) {
      syncCart();
    }
  }, [isCartOpen, syncCart]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isAuthenticated) {
      setShowGuestOptions(true);
      return;
    }
    
    setCheckoutOpen(true);
    closeCart();
  };

  const handleGuestCheckout = () => {
    setShowGuestOptions(false);
    setCheckoutOpen(true);
    closeCart();
  };

  const handleSignUp = () => {
    setShowGuestOptions(false);
    closeCart();
    openAuthModal();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " RWF";
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0 flex flex-col h-full">
          <SheetHeader className="flex flex-row justify-between items-center p-4 border-b flex-shrink-0">
            <SheetTitle className="flex items-center text-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart ({cart.length})
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeCart} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {cart.length === 0 ? (
              <div className="p-4 h-full flex items-center justify-center">
                <EmptyCart onClose={closeCart} />
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.map((item) => (
                  <CartItem 
                    key={item.id}
                    item={{
                      id: parseInt(item.id.split('-')[0]) || item.product_id,
                      name: item.product_name,
                      price: item.product_price,
                      quantity: item.quantity,
                      unit: item.product_unit
                    }}
                    formatPrice={formatPrice}
                    onUpdateQuantity={(id, quantity) => updateQuantity(item.id, quantity)}
                    onRemoveFromCart={() => removeFromCart(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <SheetFooter className="p-4 border-t flex-shrink-0">
              <CartSummary 
                getCartTotal={getCartTotal}
                formatPrice={formatPrice}
                onCheckout={handleCheckout}
                onClearCart={clearCart}
              />
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Guest Checkout Options */}
      <Sheet open={showGuestOptions} onOpenChange={setShowGuestOptions}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Checkout Options</SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <GuestCheckoutOption
              onContinueAsGuest={handleGuestCheckout}
              onSignUp={handleSignUp}
            />
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        getCartTotal={getCartTotal}
        formatPrice={formatPrice}
        cartItems={cart.map(item => ({
          id: item.product_id,
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          unit: item.product_unit
        }))}
        clearCart={clearCart}
        saveOrder={() => {}}
      />
    </>
  );
};

export default CartSidebar;

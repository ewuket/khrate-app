
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

  // Sync cart when sidebar opens
  useEffect(() => {
    if (isCartOpen && isAuthenticated) {
      syncCart();
    }
  }, [isCartOpen, isAuthenticated]);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

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
  };

  const handleSignInAndCheckout = () => {
    setShowGuestOptions(false);
    closeCart();
    openAuthModal();
  };

  const handleGuestCheckout = () => {
    setShowGuestOptions(false);
    setCheckoutOpen(true);
  };

  const saveOrder = () => {
    console.log('Order saved successfully');
    toast.success('Order placed successfully!');
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shopping Cart ({cart.length})
              </SheetTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeCart}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {cart.length === 0 ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>

              <div className="flex-shrink-0 border-t pt-4 space-y-4">
                <CartSummary 
                  total={getCartTotal()}
                  formatPrice={formatPrice}
                />
                
                <SheetFooter className="flex-col space-y-2">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <GuestCheckoutOption
        isOpen={showGuestOptions}
        onClose={() => setShowGuestOptions(false)}
        onSignIn={handleSignInAndCheckout}
        onGuestCheckout={handleGuestCheckout}
      />

      <CheckoutDialog
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart.map(item => ({
          id: parseInt(item.product_id.toString()),
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          unit: item.product_unit
        }))}
        total={getCartTotal()}
        onSuccess={() => {
          clearCart();
          setCheckoutOpen(false);
        }}
      />
    </>
  );
};

export default CartSidebar;

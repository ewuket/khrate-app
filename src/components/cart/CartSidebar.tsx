
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import CartSummary from "./CartSummary";
import CheckoutDialog from "../checkout/CheckoutDialog";

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  
  const { isAuthenticated, user } = useAuth();
  
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
    closeCart();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " RWF";
  };
  
  const saveOrder = () => {
    if (cart.length === 0) return;
    
    const orderId = `order_${Date.now()}`;
    const orderItems = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
    }));
    
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      status: "pending",
      items: orderItems,
      total: getCartTotal(),
      deliveryAddress: "Default Address", // In a real app, this would be user's address
      deliverySchedule: {
        date: "", // Will be set in the checkout dialog
        timeSlot: "afternoon"
      }
    };
    
    // Get user-specific storage key
    const storageKey = isAuthenticated && user?.id 
      ? `khrate_orders_${user.id}` 
      : 'khrate_guest_orders';
    
    // Get existing orders or create empty array
    const existingOrdersStr = localStorage.getItem(storageKey);
    const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    
    // Add new order and save
    const updatedOrders = [order, ...existingOrders];
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="flex flex-row justify-between items-center">
            <SheetTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetHeader>
          
          {cart.length === 0 ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <>
              <div className="py-6 space-y-4">
                {cart.map((item) => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    formatPrice={formatPrice}
                    onUpdateQuantity={updateQuantity}
                    onRemoveFromCart={removeFromCart}
                  />
                ))}
              </div>
              
              <SheetFooter>
                <CartSummary 
                  getCartTotal={getCartTotal}
                  formatPrice={formatPrice}
                  onCheckout={handleCheckout}
                  onClearCart={clearCart}
                />
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        getCartTotal={getCartTotal}
        formatPrice={formatPrice}
        cartItems={cart}
        clearCart={clearCart}
        saveOrder={saveOrder}
      />
    </>
  );
};

export default CartSidebar;

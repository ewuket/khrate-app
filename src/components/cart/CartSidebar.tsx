
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { toast } from "sonner";
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
  } = useSupabaseCart();
  
  const { isAuthenticated, user } = useAuth();
  
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout");
      return;
    }
    
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
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      quantity: item.quantity,
      unit: item.product_unit,
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

  // Convert Supabase cart items to format expected by CheckoutDialog
  const cartItems = cart.map(item => ({
    id: item.product_id,
    name: item.product_name,
    price: item.product_price,
    quantity: item.quantity,
    unit: item.product_unit,
    type: item.product_type
  }));

  if (!isAuthenticated) {
    return (
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
          
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to view your cart</p>
            <Button onClick={closeCart} className="bg-khrate-500 hover:bg-khrate-600">
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

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
        cartItems={cartItems}
        clearCart={clearCart}
        saveOrder={saveOrder}
      />
    </>
  );
};

export default CartSidebar;

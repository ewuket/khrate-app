
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CartItem from "./CartItem";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CustomBuyCheckoutDialog from "./CustomBuyCheckoutDialog";

interface CartProps {
  cart: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
  }>;
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (productId: number) => void;
  calculateTotal: () => string;
}

const CustomBuyCart = ({ 
  cart, 
  products, 
  onAddToCart, 
  onRemoveFromCart, 
  calculateTotal 
}: CartProps) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
  };
  
  const saveOrder = () => {
    if (cart.length === 0) return;
    
    const orderId = `order_${Date.now()}`;
    const order = {
      id: orderId,
      items: cart,
      total: parseFloat(calculateTotal().replace(/,/g, '')),
      date: new Date().toISOString(),
      status: "pending"
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
      <Card className="sticky top-24">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {cart.map(item => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    unit={item.unit}
                    onAddToCart={onAddToCart}
                    onRemoveFromCart={onRemoveFromCart}
                    products={products}
                  />
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>{calculateTotal()} RWF</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Delivery (included):</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-orange-500">{calculateTotal()} RWF</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              
              <Button variant="outline" className="w-full mt-2">
                Save as Bundle
              </Button>
            </>
          )}
        </div>
      </Card>

      <CustomBuyCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        calculateTotal={calculateTotal}
        saveOrder={saveOrder}
      />
    </>
  );
};

export default CustomBuyCart;

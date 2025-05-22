
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import CartItem from "./CartItem";
import CustomBuyCheckoutDialog from "./CustomBuyCheckoutDialog";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CustomBuyCartProps {
  cart: CartItem[];
  products: any[];
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (productId: number) => void;
  calculateTotal: () => string;
}

const CustomBuyCart = ({
  cart,
  products,
  onAddToCart,
  onRemoveFromCart,
  calculateTotal,
}: CustomBuyCartProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    setIsCheckoutOpen(true);
  };
  
  const handleCheckoutSuccess = () => {
    console.log("Checkout successful");
  };
  
  const saveOrder = () => {
    // Save order functionality would go here in a real implementation
    console.log("Order saved");
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <span className="bg-khrate-100 text-khrate-700 text-sm py-1 px-2 rounded-full">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-20" />
          <div>
            <h3 className="font-medium mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">
              Add items from the product list to get started.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onAddToCart={() => {
                  const product = products.find(p => p.id === item.id);
                  if (product) {
                    onAddToCart(product);
                  }
                }}
                onRemoveFromCart={() => onRemoveFromCart(item.id)}
              />
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">UGX {calculateTotal()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>UGX {calculateTotal()}</span>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                className="w-full bg-khrate-500 hover:bg-khrate-600"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => {
                  // Clear cart functionality
                  cart.forEach(item => onRemoveFromCart(item.id));
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <CustomBuyCheckoutDialog 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default CustomBuyCart;

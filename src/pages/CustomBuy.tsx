
import { useState } from "react";
import ProductList from "@/components/custom-buy/ProductList";
import CustomBuyCart from "@/components/custom-buy/CustomBuyCart";
import CustomBuyCheckoutDialog from "@/components/custom-buy/CustomBuyCheckoutDialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Footer from "@/components/layout/Footer";

interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
}

const CustomBuy = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with orange background and white text */}
      <div className="bg-khrate-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Custom Buy</h1>
              <p className="text-xl max-w-2xl opacity-90">
                Build your own custom bundle by selecting exactly what you need. 
                Perfect for specific dietary requirements or unique preferences.
              </p>
            </div>
            
            {/* Floating Cart Button */}
            <Button
              onClick={() => setShowCart(true)}
              className="bg-white text-khrate-500 hover:bg-gray-100 relative"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({getCartItemCount()})
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {getCartItemCount()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <ProductList onAddToCart={addToCart} />
      </main>

      <CustomBuyCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
        getCartTotal={getCartTotal}
      />

      <CustomBuyCheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        cart={cart}
        getCartTotal={getCartTotal}
        clearCart={clearCart}
      />

      <Footer />
    </div>
  );
};

export default CustomBuy;

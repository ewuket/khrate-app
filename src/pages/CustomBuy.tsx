
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ProductList from "@/components/custom-buy/ProductList";
import CustomBuyCart from "@/components/custom-buy/CustomBuyCart";
import CustomBuyCheckoutDialog from "@/components/custom-buy/CustomBuyCheckoutDialog";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const CustomBuy = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const addToCart = (product: any) => {
    console.log('Adding product to cart:', product);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          unit: product.unit
        }];
      }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartTotal = () => {
    return calculateTotal();
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared!');
  };

  const handleCheckoutOpen = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-khrate-600 mb-4">Custom Buy</h1>
          <p className="text-gray-600 text-lg">Build your perfect bundle with fresh, quality products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductList onAddToCart={addToCart} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg border-2 border-khrate-100">
                <CardHeader className="bg-gradient-to-r from-khrate-500 to-khrate-600 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Cart</span>
                    <span className="bg-white text-khrate-600 text-sm py-1 px-3 rounded-full">
                      {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <p className="text-sm text-gray-400">Add items from the product list to get started.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-khrate-600 font-semibold">
                                {item.price.toLocaleString()} RWF x {item.quantity} {item.unit}(s)
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => addToCart({ 
                                  id: item.id, 
                                  name: item.name, 
                                  price: item.price, 
                                  unit: item.unit 
                                })}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total</span>
                          <span className="text-2xl font-bold text-khrate-600">
                            {calculateTotal().toLocaleString()} RWF
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3"
                            onClick={handleCheckoutOpen}
                          >
                            Proceed to Checkout
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={clearCart}
                          >
                            Clear Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CustomBuyCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        getCartTotal={getCartTotal}
        clearCart={clearCart}
      />
    </div>
  );
};

export default CustomBuy;


import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/custom-buy/ProductList";
import Cart from "@/components/custom-buy/Cart";
import products from "@/components/custom-buy/productsData";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const CustomBuy = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        unit: product.unit
      }]);
    }
  };
  
  const removeFromCart = (productId: number) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  const getItemQuantity = (productId: number) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Custom Buy</h1>
            <p className="mt-2 max-w-lg">
              Build your own grocery list with exactly what you need
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Products Section */}
              <div className="lg:w-2/3">
                <ProductList 
                  products={products}
                  getItemQuantity={getItemQuantity}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                />
              </div>
              
              {/* Cart Section */}
              <div className="lg:w-1/3">
                <Cart 
                  cart={cart}
                  products={products}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  calculateTotal={calculateTotal}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomBuy;

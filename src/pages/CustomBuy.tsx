
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/custom-buy/ProductList";
import CustomBuyCart from "@/components/custom-buy/CustomBuyCart";
import products from "@/components/custom-buy/productsData";
import { useState } from "react";

const CustomBuy = () => {
  const [localCart, setLocalCart] = useState<Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>>([]);

  const handleAddToCart = (product: any) => {
    setLocalCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.unit
      }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setLocalCart(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const calculateTotal = () => {
    return localCart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString();
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products List - 2/3 width on large screens */}
              <div className="lg:col-span-2">
                <ProductList 
                  products={products} 
                  onAddToCart={handleAddToCart}
                />
              </div>
              
              {/* Cart - 1/3 width on large screens, sticky on desktop */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                  <CustomBuyCart
                    cart={localCart}
                    products={products}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    calculateTotal={calculateTotal}
                  />
                </div>
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

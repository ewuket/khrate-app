
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/custom-buy/ProductList";
import CustomBuyCart from "@/components/custom-buy/CustomBuyCart";
import CustomBuyCheckoutDialog from "@/components/custom-buy/CustomBuyCheckoutDialog";
import { products } from "@/components/custom-buy/productsData";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const categories = [
    "all",
    ...Array.from(new Set(products.map(product => product.category)))
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
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

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-8 sm:py-12 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Custom Buy</h1>
            <p className="mt-2 max-w-lg text-sm sm:text-base">
              Choose your own items and create your perfect shopping list
            </p>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1">
                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full">
                      {categories.map(category => (
                        <TabsTrigger 
                          key={category} 
                          value={category} 
                          className="text-xs sm:text-sm capitalize truncate"
                        >
                          {category === "all" ? "All" : category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Products Grid */}
                <ProductList products={filteredProducts} onAddToCart={addToCart} />
              </div>

              {/* Cart Sidebar - Hidden on mobile, use floating button instead */}
              <div className="hidden lg:block lg:w-80 xl:w-96">
                <div className="sticky top-4">
                  <CustomBuyCart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onClearCart={clearCart}
                    onCheckout={() => setShowCheckout(true)}
                    getCartTotal={getCartTotal}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Cart Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowCart(true)}
          className="bg-khrate-500 hover:bg-khrate-600 rounded-full h-14 w-14 shadow-lg"
          size="lg"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </div>
        </Button>
      </div>

      {/* Mobile Cart Sheet */}
      {showCart && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowCart(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>×</Button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <CustomBuyCart
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
                getCartTotal={getCartTotal}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />

      <CustomBuyCheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        cart={cart}
        getCartTotal={getCartTotal}
        clearCart={clearCart}
      />
    </div>
  );
};

export default CustomBuy;

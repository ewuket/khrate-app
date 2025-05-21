import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBasket, Plus, Minus } from "lucide-react";

// Sample product data
const products = [
  {
    id: 1,
    name: "Rice",
    price: 2.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2680&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 2,
    name: "Beans",
    price: 1.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1593855856339-8322a8143996?q=80&w=2574&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 3,
    name: "Tomatoes",
    price: 1.49,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?q=80&w=2680&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 4,
    name: "Onions",
    price: 0.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1620574387735-3624d75e5972?q=80&w=2680&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 5,
    name: "Cooking Oil",
    price: 5.99,
    unit: "litre",
    image: "https://images.unsplash.com/photo-1620705464770-c1e4a61882c7?q=80&w=2680&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 6,
    name: "Salt",
    price: 0.75,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1616316788344-eda641d86199?q=80&w=2680&auto=format&fit=crop",
    category: "household"
  },
  {
    id: 7,
    name: "Soap",
    price: 1.25,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1607006555447-60394120caaa?q=80&w=2680&auto=format&fit=crop",
    category: "household"
  },
  {
    id: 8,
    name: "Cabbage",
    price: 1.29,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1603049404411-13c2ca81a316?q=80&w=2680&auto=format&fit=crop",
    category: "perishable"
  }
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const CustomBuy = () => {
  const [category, setCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);
    
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
                <Tabs 
                  defaultValue="all" 
                  className="mb-8"
                  onValueChange={setCategory}
                  value={category}
                >
                  <div className="border-b mb-6">
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="all" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                        All Items
                      </TabsTrigger>
                      <TabsTrigger value="perishable" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                        Perishables
                      </TabsTrigger>
                      <TabsTrigger value="non-perishable" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                        Non-Perishables
                      </TabsTrigger>
                      <TabsTrigger value="household" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                        Household
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const quantity = getItemQuantity(product.id);
                    
                    return (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{product.name}</h3>
                            <span className="font-semibold">${product.price}/{product.unit}</span>
                          </div>
                          
                          <div className="mt-4">
                            {quantity === 0 ? (
                              <Button 
                                className="w-full bg-khrate-500 hover:bg-khrate-600"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingBasket className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                            ) : (
                              <div className="flex items-center justify-between">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => removeFromCart(product.id)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-medium">{quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => addToCart(product)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              {/* Cart Section */}
              <div className="lg:w-1/3">
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
                            <div key={item.id} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price} x {item.quantity} {item.unit}(s)
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => {
                                    // Find the full product to add to cart
                                    const productToAdd = products.find(p => p.id === item.id);
                                    if (productToAdd) {
                                      addToCart(productToAdd);
                                    }
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span>${calculateTotal()}</span>
                          </div>
                          <div className="flex justify-between mb-4">
                            <span>Delivery (included):</span>
                            <span className="text-green-600">Free</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculateTotal()}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-6 bg-khrate-500 hover:bg-khrate-600">
                          Proceed to Checkout
                        </Button>
                        
                        <Button variant="outline" className="w-full mt-2">
                          Save as Bundle
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
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

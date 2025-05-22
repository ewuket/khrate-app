
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BundleCard from "@/components/bundles/BundleCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";

// Sample bundle data
const allBundles = [
  {
    id: 1,
    name: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 25000,
    image: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=2070&auto=format&fit=crop",
    items: ["Rice (1kg)", "Beans (500g)", "Tomatoes (6)", "Onions (4)", "Oil (500ml)", "Salt (250g)", "Eggs (12)"],
    category: "single"
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 45000,
    image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?q=80&w=2460&auto=format&fit=crop",
    items: ["Rice (2kg)", "Beans (1kg)", "Tomatoes (10)", "Onions (8)", "Oil (1L)", "Salt (500g)", "Eggs (24)", "Bread (2)", "Milk (2L)"],
    category: "medium"
  },
  {
    id: 3,
    name: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 75000,
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=2587&auto=format&fit=crop",
    items: ["Rice (5kg)", "Beans (2kg)", "Tomatoes (15)", "Onions (10)", "Oil (2L)", "Salt (1kg)", "Eggs (30)", "Bread (4)", "Milk (4L)", "Flour (2kg)", "Sugar (2kg)"],
    category: "large"
  },
  {
    id: 4,
    name: "Vegetables Bundle",
    description: "Fresh vegetables for the week",
    price: 19999,
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2574&auto=format&fit=crop",
    items: ["Tomatoes (10)", "Onions (8)", "Carrots (8)", "Lettuce (2)", "Peppers (6)", "Cucumber (4)"],
    category: "single"
  },
  {
    id: 5,
    name: "Breakfast Bundle",
    description: "Start your day right",
    price: 29999,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2680&auto=format&fit=crop",
    items: ["Bread (2)", "Eggs (24)", "Milk (2L)", "Cereal (500g)", "Jam (300g)", "Butter (250g)", "Coffee (200g)"],
    category: "medium"
  },
  {
    id: 6,
    name: "Pantry Essentials",
    description: "Stock your pantry with basics",
    price: 49999,
    image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=2080&auto=format&fit=crop",
    items: ["Rice (3kg)", "Flour (2kg)", "Sugar (2kg)", "Oil (2L)", "Salt (1kg)", "Pasta (3 packs)", "Beans (2kg)", "Lentils (1kg)", "Spices (assorted)"],
    category: "large"
  }
];

const Bundles = () => {
  const [category, setCategory] = useState<string>("all");
  const { addToCart } = useCart();
  
  const filteredBundles = category === "all" 
    ? allBundles 
    : allBundles.filter(bundle => bundle.category === category);
  
  const handleAddToCart = (bundle: any) => {
    addToCart(bundle, 'bundle');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Grocery Bundles</h1>
            <p className="mt-2 max-w-lg">
              Pre-curated grocery packages with everything you need, delivered to your door
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            <Tabs 
              defaultValue="all" 
              className="mb-8"
              onValueChange={setCategory}
              value={category}
            >
              <div className="border-b mb-6">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="all" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                    All Bundles
                  </TabsTrigger>
                  <TabsTrigger value="single" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                    Single
                  </TabsTrigger>
                  <TabsTrigger value="medium" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                    Medium
                  </TabsTrigger>
                  <TabsTrigger value="large" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                    Large
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBundles.map(bundle => (
                  <BundleCard 
                    key={bundle.id} 
                    bundle={bundle} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bundles;

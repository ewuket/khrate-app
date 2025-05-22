
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
    image: "/lovable-uploads/464ca869-8797-4eb8-9526-98af04334e84.png",
    items: ["Rice (1kg)", "Beans (500g)", "Tomatoes (6)", "Onions (4)", "Oil (500ml)", "Salt (250g)", "Eggs (12)"],
    category: "single"
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 45000,
    image: "/lovable-uploads/2455b7e0-b0f8-4f2a-aaca-995dcd6da943.png",
    items: ["Rice (2kg)", "Beans (1kg)", "Tomatoes (10)", "Onions (8)", "Oil (1L)", "Salt (500g)", "Eggs (24)", "Bread (2)", "Milk (2L)"],
    category: "medium"
  },
  {
    id: 3,
    name: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 75000,
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png",
    items: ["Rice (5kg)", "Beans (2kg)", "Tomatoes (15)", "Onions (10)", "Oil (2L)", "Salt (1kg)", "Eggs (30)", "Bread (4)", "Milk (4L)", "Flour (2kg)", "Sugar (2kg)"],
    category: "large"
  },
  {
    id: 4,
    name: "Vegetables Bundle",
    description: "Fresh vegetables for the week",
    price: 19999,
    image: "/lovable-uploads/464ca869-8797-4eb8-9526-98af04334e84.png",
    items: ["Tomatoes (10)", "Onions (8)", "Carrots (8)", "Lettuce (2)", "Peppers (6)", "Cucumber (4)"],
    category: "single"
  },
  {
    id: 5,
    name: "Breakfast Bundle",
    description: "Start your day right",
    price: 29999,
    image: "/lovable-uploads/2455b7e0-b0f8-4f2a-aaca-995dcd6da943.png",
    items: ["Bread (2)", "Eggs (24)", "Milk (2L)", "Cereal (500g)", "Jam (300g)", "Butter (250g)", "Coffee (200g)"],
    category: "medium"
  },
  {
    id: 6,
    name: "Pantry Essentials",
    description: "Stock your pantry with basics",
    price: 49999,
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png",
    items: ["Rice (3kg)", "Flour (2kg)", "Sugar (2kg)", "Oil (2L)", "Salt (1kg)", "Pasta (3 packs)", "Beans (2kg)", "Lentils (1kg)", "Spices (assorted)"],
    category: "large"
  },
  // New fruit bundles
  {
    id: 7,
    name: "Small Fruit Bundle",
    description: "Fresh seasonal fruits for 1-2 people",
    price: 15000,
    image: "/lovable-uploads/d0db3cc3-a1fc-43b8-b251-a4efba68113a.png",
    items: ["Oranges (4)", "Apples (4)", "Bananas (6)", "Grapes (1 bunch)", "Strawberries (500g)"],
    category: "fruit"
  },
  {
    id: 8,
    name: "Medium Fruit Bundle",
    description: "Variety pack for a small family",
    price: 28000,
    image: "/lovable-uploads/d0db3cc3-a1fc-43b8-b251-a4efba68113a.png",
    items: ["Oranges (6)", "Apples (6)", "Bananas (8)", "Grapes (2 bunches)", "Strawberries (750g)", "Pineapple (1)", "Mango (2)"],
    category: "fruit"
  },
  {
    id: 9,
    name: "Large Fruit Bundle",
    description: "Complete fruit assortment for families",
    price: 42000,
    image: "/lovable-uploads/d0db3cc3-a1fc-43b8-b251-a4efba68113a.png",
    items: ["Oranges (10)", "Apples (10)", "Bananas (12)", "Grapes (3 bunches)", "Strawberries (1kg)", "Pineapple (2)", "Mango (4)", "Blueberries (250g)", "Raspberries (250g)"],
    category: "fruit"
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
                  <TabsTrigger value="fruit" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
                    Fruit
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


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
    price: 32700,
    image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png", // Keeping existing image
    items: ["Rice (10kg)", "Beans (2kg)", "Tomatoes (1kg)", "Onions (2kg)", "Green Paper (1kg)", "peas (1kg)", "Oil (1L)", "Sugar (1kg)", "Salt (100g)", "Eggs (10)"],
    category: "single"
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 69240,
    image: "/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png", // Keeping existing image
    items: ["Rice (15kg)", "Beans (5kg)", "Tomatoes (3kg)", "Onions (3kg)", "Green Paper (3kg)", "Oil (3L)", "Sugar (3kg)", "Salt (150g)", "Eggs (12)", "Slice Bread (1pack)", "Milk (2L)"],
    category: "medium"
  },
  {
    id: 3,
    name: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 119000,
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png", // Keeping original image
    items: ["Rice (25kg)", "Beans (10kg)", "Tomatoes (5kg)", "Onions (5kg)", "Oil (5L)", "Salt (250g)", "Eggs (24pieces)", "Slice Bread (3pack)", "Milk (4L)", "Cassava Flour (5kg)", "Sugar (5kg)"],
    category: "large"
  },
  {
    id: 4,
    name: "Vegetables Bundle",
    description: "Fresh vegetables for the week",
    price: 19999,
    image: "/lovable-uploads/4049f27e-26db-4497-9920-9b60326fe5f7.png", // Keeping existing image
    items: ["Tomatoes (1kg)", "Onions (1kg)", "Carrots (3pieces)", "Lettuce (2)", "Peppers (4pieces)", "Cucumber (2pieces)"],
    category: "single"
  },
  {
    id: 5,
    name: "Breakfast Bundle",
    description: "Start your day right",
    price: 29999,
    image: "/lovable-uploads/f54999c2-780a-4e38-9b60-7d31fd0fd9bc.png", // Updated with new breakfast image
    items: ["Bread (2)", "Eggs (24)", "Milk (2L)", "Cereal (500g)", "Jam (300g)", "Butter (250g)", "Coffee (200g)"],
    category: "medium"
  },
  {
    id: 6,
    name: "Pantry Essentials",
    description: "Stock your pantry with basics",
    price: 49999,
    image: "/lovable-uploads/64610299-1b2e-480f-ad10-ca5f00ac3808.png", // Updated with new pantry essentials image
    items: ["Rice (3kg)", "Wheat Flour (2kg)", "Sugar (2kg)", "Oil (2L)", "Salt (1kg)", "Pasta (3 packs)", "Beans (2kg)", "Lentils (1kg)", "Spices (assorted)"],
    category: "large"
  },
  // Fruit bundles with updated images
  {
    id: 7,
    name: "Small Fruit Bundle",
    description: "Fresh seasonal fruits for 1-2 people",
    price: 8500,
    image: "/lovable-uploads/0225ce03-0269-4b10-b603-3c14cf3e55ca.png", // Updated small fruit bundle image
    items: ["Oranges (4)", "Apples (4)", "Bananas (6)", "Grapes (1 bunch)", "Strawberries (500g)"],
    category: "fruit"
  },
  {
    id: 8,
    name: "Medium Fruit Bundle",
    description: "Variety pack for a small family",
    price: 16000,
    image: "/lovable-uploads/44536f37-66fe-4604-a318-5afc62c7fcdf.png", // Updated medium fruit bundle image
    items: ["Oranges (6)", "Apples (6)", "Bananas (8)", "Grapes (2 bunches)", "Strawberries (750g)", "Pineapple (1)", "Mango (2)"],
    category: "fruit"
  },
  {
    id: 9,
    name: "Large Fruit Bundle",
    description: "Complete fruit assortment for families",
    price: 2900,
    image: "/lovable-uploads/09c44f3e-b941-47e8-b1c7-86fee2bd1286.png", // Updated large fruit bundle image
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

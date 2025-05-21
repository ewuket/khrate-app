
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BundleCard from "@/components/bundles/BundleCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample bundle data
const allBundles = [
  {
    id: 1,
    name: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 25.99,
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=2574&auto=format&fit=crop",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt", "Eggs"],
    category: "single"
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt", "Eggs", "Bread", "Milk"],
    category: "medium"
  },
  {
    id: 3,
    name: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 75.99,
    image: "https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=2574&auto=format&fit=crop",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt", "Eggs", "Bread", "Milk", "Flour", "Sugar"],
    category: "large"
  },
  {
    id: 4,
    name: "Vegetables Bundle",
    description: "Fresh vegetables for the week",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2574&auto=format&fit=crop",
    items: ["Tomatoes", "Onions", "Carrots", "Lettuce", "Peppers", "Cucumber"],
    category: "single"
  },
  {
    id: 5,
    name: "Breakfast Bundle",
    description: "Start your day right",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2680&auto=format&fit=crop",
    items: ["Bread", "Eggs", "Milk", "Cereal", "Jam", "Butter", "Coffee"],
    category: "medium"
  },
  {
    id: 6,
    name: "Pantry Essentials",
    description: "Stock your pantry with basics",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=2574&auto=format&fit=crop",
    items: ["Rice", "Flour", "Sugar", "Oil", "Salt", "Pasta", "Beans", "Lentils", "Spices"],
    category: "large"
  }
];

const Bundles = () => {
  const [category, setCategory] = useState<string>("all");
  
  const filteredBundles = category === "all" 
    ? allBundles 
    : allBundles.filter(bundle => bundle.category === category);
  
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
                  <BundleCard key={bundle.id} bundle={bundle} />
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

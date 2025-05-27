
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BundleCard from "@/components/bundles/BundleCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample bundle data
const allBundles = [
  {
    id: 1,
    title: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 32700,
    image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png",
    items: [
      { name: "Rice", quantity: 10 },
      { name: "Beans", quantity: 2 },
      { name: "Tomatoes", quantity: 1 },
      { name: "Onions", quantity: 2 },
      { name: "Green Paper", quantity: 1 },
      { name: "Peas", quantity: 1 },
      { name: "Oil", quantity: 1 },
      { name: "Sugar", quantity: 1 },
      { name: "Salt", quantity: 0.1 },
      { name: "Eggs", quantity: 10 }
    ],
    category: "single"
  },
  {
    id: 2,
    title: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 69240,
    image: "/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png",
    items: [
      { name: "Rice", quantity: 15 },
      { name: "Beans", quantity: 5 },
      { name: "Tomatoes", quantity: 3 },
      { name: "Onions", quantity: 3 },
      { name: "Green Paper", quantity: 3 },
      { name: "Oil", quantity: 3 },
      { name: "Sugar", quantity: 3 },
      { name: "Salt", quantity: 0.15 },
      { name: "Eggs", quantity: 12 },
      { name: "Slice Bread", quantity: 1 },
      { name: "Milk", quantity: 2 }
    ],
    category: "medium"
  },
  {
    id: 3,
    title: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 119000,
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png",
    items: [
      { name: "Rice", quantity: 25 },
      { name: "Beans", quantity: 10 },
      { name: "Tomatoes", quantity: 5 },
      { name: "Onions", quantity: 5 },
      { name: "Oil", quantity: 5 },
      { name: "Salt", quantity: 0.25 },
      { name: "Eggs", quantity: 24 },
      { name: "Slice Bread", quantity: 3 },
      { name: "Milk", quantity: 4 },
      { name: "Cassava Flour", quantity: 5 },
      { name: "Sugar", quantity: 5 }
    ],
    category: "large"
  },
  {
    id: 4,
    title: "Vegetables Bundle",
    description: "Fresh vegetables for the week",
    price: 19999,
    image: "/lovable-uploads/4049f27e-26db-4497-9920-9b60326fe5f7.png",
    items: [
      { name: "Tomatoes", quantity: 1 },
      { name: "Onions", quantity: 1 },
      { name: "Carrots", quantity: 3 },
      { name: "Lettuce", quantity: 2 },
      { name: "Peppers", quantity: 4 },
      { name: "Cucumber", quantity: 2 }
    ],
    category: "single"
  },
  {
    id: 5,
    title: "Breakfast Bundle",
    description: "Start your day right",
    price: 19999,
    image: "/lovable-uploads/f54999c2-780a-4e38-9b60-7d31fd0fd9bc.png",
    items: [
      { name: "Slice Bread", quantity: 2 },
      { name: "Eggs", quantity: 24 },
      { name: "Milk", quantity: 5 },
      { name: "Breakfast Cereal", quantity: 1 },
      { name: "Jam", quantity: 0.3 },
      { name: "Butter", quantity: 0.5 },
      { name: "Coffee", quantity: 0.25 }
    ],
    category: "medium"
  },
  {
    id: 6,
    title: "Pantry Essentials",
    description: "Stock your pantry with basics",
    price: 39999,
    image: "/lovable-uploads/64610299-1b2e-480f-ad10-ca5f00ac3808.png",
    items: [
      { name: "Rice", quantity: 10 },
      { name: "Wheat Flour", quantity: 5 },
      { name: "Sugar", quantity: 2 },
      { name: "Oil", quantity: 3 },
      { name: "Salt", quantity: 0.1 },
      { name: "Pasta", quantity: 3 },
      { name: "Beans", quantity: 3 },
      { name: "Lentils", quantity: 2 },
      { name: "Spices", quantity: 1 }
    ],
    category: "large"
  },
  {
    id: 7,
    title: "Small Fruit Bundle",
    description: "Fresh seasonal fruits for 1-2 people",
    price: 8500,
    image: "/lovable-uploads/0225ce03-0269-4b10-b603-3c14cf3e55ca.png",
    items: [
      { name: "Oranges", quantity: 4 },
      { name: "Apples", quantity: 4 },
      { name: "Bananas", quantity: 6 },
      { name: "Grapes", quantity: 1 },
      { name: "Strawberries", quantity: 0.5 }
    ],
    category: "fruit"
  },
  {
    id: 8,
    title: "Medium Fruit Bundle",
    description: "Variety pack for a small family",
    price: 16000,
    image: "/lovable-uploads/44536f37-66fe-4604-a318-5afc62c7fcdf.png",
    items: [
      { name: "Oranges", quantity: 6 },
      { name: "Apples", quantity: 6 },
      { name: "Bananas", quantity: 8 },
      { name: "Grapes", quantity: 2 },
      { name: "Strawberries", quantity: 0.75 },
      { name: "Pineapple", quantity: 1 },
      { name: "Mango", quantity: 2 }
    ],
    category: "fruit"
  },
  {
    id: 9,
    title: "Large Fruit Bundle",
    description: "Complete fruit assortment for families",
    price: 29000,
    image: "/lovable-uploads/09c44f3e-b941-47e8-b1c7-86fee2bd1286.png",
    items: [
      { name: "Oranges", quantity: 10 },
      { name: "Apples", quantity: 10 },
      { name: "Bananas", quantity: 12 },
      { name: "Grapes", quantity: 3 },
      { name: "Strawberries", quantity: 1 },
      { name: "Pineapple", quantity: 2 },
      { name: "Mango", quantity: 4 },
      { name: "Blueberries", quantity: 0.25 },
      { name: "Raspberries", quantity: 0.25 }
    ],
    category: "fruit"
  }
];

const Bundles = () => {
  const [category, setCategory] = useState<string>("all");
  
  const filteredBundles = category === "all" 
    ? allBundles 
    : allBundles.filter(bundle => bundle.category === category);
  
  const handleSaveBundle = (bundleId: number) => {
    console.log('Bundle saved:', bundleId);
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
                    onSaveBundle={handleSaveBundle}
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

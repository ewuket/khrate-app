import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BundleCard from "@/components/bundles/BundleCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";

// Sample bundle data
const allBundles = [
  {
    id: 1,
    title: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 32700,
    image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png",
    items: [
      { name: "Rice", quantity: "10kg" },
      { name: "Beans", quantity: "2kg" },
      { name: "Tomatoes", quantity: "1kg" },
      { name: "Onions", quantity: "2kg" },
      { name: "Green Paper", quantity: "1kg" },
      { name: "Peas", quantity: "1kg" },
      { name: "Oil", quantity: "1L" },
      { name: "Sugar", quantity: "1kg" },
      { name: "Salt", quantity: "100g" },
      { name: "Eggs", quantity: "10" }
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
      { name: "Rice", quantity: "15kg" },
      { name: "Beans", quantity: "5kg" },
      { name: "Tomatoes", quantity: "3kg" },
      { name: "Onions", quantity: "3kg" },
      { name: "Green Paper", quantity: "3kg" },
      { name: "Oil", quantity: "3L" },
      { name: "Sugar", quantity: "3kg" },
      { name: "Salt", quantity: "150g" },
      { name: "Eggs", quantity: "12" },
      { name: "Slice Bread", quantity: "1pack" },
      { name: "Milk", quantity: "2L" }
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
      { name: "Rice", quantity: "25kg" },
      { name: "Beans", quantity: "10kg" },
      { name: "Tomatoes", quantity: "5kg" },
      { name: "Onions", quantity: "5kg" },
      { name: "Oil", quantity: "5L" },
      { name: "Salt", quantity: "250g" },
      { name: "Eggs", quantity: "24pieces" },
      { name: "Slice Bread", quantity: "3pack" },
      { name: "Milk", quantity: "4L" },
      { name: "Cassava Flour", quantity: "5kg" },
      { name: "Sugar", quantity: "5kg" }
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
      { name: "Tomatoes", quantity: "1kg" },
      { name: "Onions", quantity: "1kg" },
      { name: "Carrots", quantity: "3pieces" },
      { name: "Lettuce", quantity: "2" },
      { name: "Peppers", quantity: "4pieces" },
      { name: "Cucumber", quantity: "2pieces" }
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
      { name: "Slice Bread", quantity: "2pack" },
      { name: "Eggs", quantity: "24" },
      { name: "Milk", quantity: "5L" },
      { name: "Breakfast Cereal", quantity: "1kg" },
      { name: "Jam", quantity: "300g" },
      { name: "Butter", quantity: "500g" },
      { name: "Coffee", quantity: "250g" }
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
      { name: "Rice", quantity: "10kg" },
      { name: "Wheat Flour", quantity: "5kg" },
      { name: "Sugar", quantity: "2kg" },
      { name: "Oil", quantity: "3L" },
      { name: "Salt", quantity: "100g" },
      { name: "Pasta", quantity: "3 packs" },
      { name: "Beans", quantity: "3kg" },
      { name: "Lentils", quantity: "2kg" },
      { name: "Spices", quantity: "assorted" }
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
      { name: "Oranges", quantity: "4" },
      { name: "Apples", quantity: "4" },
      { name: "Bananas", quantity: "6" },
      { name: "Grapes", quantity: "1 bunch" },
      { name: "Strawberries", quantity: "500g" }
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
      { name: "Oranges", quantity: "6" },
      { name: "Apples", quantity: "6" },
      { name: "Bananas", quantity: "8" },
      { name: "Grapes", quantity: "2 bunches" },
      { name: "Strawberries", quantity: "750g" },
      { name: "Pineapple", quantity: "1" },
      { name: "Mango", quantity: "2" }
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
      { name: "Oranges", quantity: "10" },
      { name: "Apples", quantity: "10" },
      { name: "Bananas", quantity: "12" },
      { name: "Grapes", quantity: "3 bunches" },
      { name: "Strawberries", quantity: "1kg" },
      { name: "Pineapple", quantity: "2" },
      { name: "Mango", quantity: "4" },
      { name: "Blueberries", quantity: "250g" },
      { name: "Raspberries", quantity: "250g" }
    ],
    category: "fruit"
  }
];

const Bundles = () => {
  const [category, setCategory] = useState<string>("all");
  const { addToCart } = useSupabaseCart();
  
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

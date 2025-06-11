
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BundleCard from "@/components/bundles/BundleCard";
import Footer from "@/components/layout/Footer";

const bundlesData = [
  {
    id: 1,
    title: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 32700,
    originalPrice: 40000,
    image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png",
    items: [
      { name: "Rice", quantity: 10, unit: "kg" },
      { name: "Beans", quantity: 2, unit: "kg" },
      { name: "Tomatoes", quantity: 1, unit: "kg" },
      { name: "Onions", quantity: 2, unit: "kg" },
      { name: "Green Paper", quantity: 1, unit: "kg" },
      { name: "Peas", quantity: 1, unit: "kg" },
      { name: "Oil", quantity: 1, unit: "liter" },
      { name: "Sugar", quantity: 1, unit: "kg" },
      { name: "Salt", quantity: 0.1, unit: "kg" },
      { name: "Eggs", quantity: 10, unit: "pieces" }
    ]
  },
  {
    id: 2,
    title: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 69240,
    originalPrice: 85000,
    image: "/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png",
    items: [
      { name: "Rice", quantity: 15, unit: "kg" },
      { name: "Beans", quantity: 5, unit: "kg" },
      { name: "Tomatoes", quantity: 3, unit: "kg" },
      { name: "Onions", quantity: 3, unit: "kg" },
      { name: "Green Paper", quantity: 3, unit: "kg" },
      { name: "Oil", quantity: 3, unit: "liter" },
      { name: "Sugar", quantity: 3, unit: "kg" },
      { name: "Salt", quantity: 0.15, unit: "kg" },
      { name: "Eggs", quantity: 12, unit: "pieces" },
      { name: "Slice Bread", quantity: 1, unit: "loaf" },
      { name: "Milk", quantity: 2, unit: "liter" }
    ]
  },
  {
    id: 3,
    title: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 119000,
    originalPrice: 150000,
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png",
    items: [
      { name: "Rice", quantity: 25, unit: "kg" },
      { name: "Beans", quantity: 10, unit: "kg" },
      { name: "Tomatoes", quantity: 5, unit: "kg" },
      { name: "Onions", quantity: 5, unit: "kg" },
      { name: "Oil", quantity: 5, unit: "liter" },
      { name: "Salt", quantity: 0.25, unit: "kg" },
      { name: "Eggs", quantity: 24, unit: "pieces" },
      { name: "Slice Bread", quantity: 3, unit: "loaf" },
      { name: "Milk", quantity: 4, unit: "liter" },
      { name: "Cassava Flour", quantity: 5, unit: "kg" },
      { name: "Sugar", quantity: 5, unit: "kg" }
    ]
  },
  {
    id: 4,
    title: "Vegetables Bundle",
    description: "Fresh vegetables for the week",
    price: 19999,
    originalPrice: 25000,
    image: "/lovable-uploads/e0cc7a56-c962-4b80-90b7-edf92f2a5162.png",
    items: [
      { name: "Tomatoes", quantity: 3, unit: "kg" },
      { name: "Onions", quantity: 2, unit: "kg" },
      { name: "Carrots", quantity: 2, unit: "kg" },
      { name: "Cabbage", quantity: 1, unit: "head" },
      { name: "Green Beans", quantity: 1, unit: "kg" },
      { name: "Bell Peppers", quantity: 1, unit: "kg" },
      { name: "Spinach", quantity: 1, unit: "bunch" },
      { name: "Lettuce", quantity: 2, unit: "heads" }
    ]
  },
  {
    id: 5,
    title: "Breakfast Bundle",
    description: "Start your day right",
    price: 19999,
    originalPrice: 25000,
    image: "/lovable-uploads/0d93dc66-4bae-4f1a-a8d0-99ad18115c40.png",
    items: [
      { name: "Eggs", quantity: 12, unit: "pieces" },
      { name: "Bread", quantity: 2, unit: "loaves" },
      { name: "Milk", quantity: 2, unit: "liters" },
      { name: "Butter", quantity: 1, unit: "pack" },
      { name: "Jam", quantity: 1, unit: "jar" },
      { name: "Cereal", quantity: 1, unit: "box" },
      { name: "Bananas", quantity: 6, unit: "pieces" }
    ]
  },
  {
    id: 6,
    title: "Pantry Essentials",
    description: "Stock your pantry with basics",
    price: 39999,
    originalPrice: 50000,
    image: "/lovable-uploads/710b4c9d-82af-42d8-a869-ea7b86e0d412.png",
    items: [
      { name: "Rice", quantity: 5, unit: "kg" },
      { name: "Sugar", quantity: 2, unit: "kg" },
      { name: "Salt", quantity: 1, unit: "kg" },
      { name: "Oil", quantity: 2, unit: "liters" },
      { name: "Flour", quantity: 2, unit: "kg" },
      { name: "Tea", quantity: 1, unit: "pack" },
      { name: "Coffee", quantity: 1, unit: "pack" }
    ]
  },
  {
    id: 7,
    title: "Small Fruit Bundle",
    description: "Fresh seasonal fruits for 1-2 people",
    price: 8500,
    originalPrice: 12000,
    image: "/lovable-uploads/280f9459-3e15-4683-85fb-0295c65c6045.png",
    items: [
      { name: "Bananas", quantity: 6, unit: "pieces" },
      { name: "Apples", quantity: 4, unit: "pieces" },
      { name: "Oranges", quantity: 4, unit: "pieces" },
      { name: "Pineapple", quantity: 1, unit: "piece" },
      { name: "Mangoes", quantity: 3, unit: "pieces" }
    ]
  },
  {
    id: 8,
    title: "Medium Fruit Bundle",
    description: "Variety pack for a small family",
    price: 16000,
    originalPrice: 20000,
    image: "/lovable-uploads/bca8e1ad-44ee-4a9a-a33a-af0189f97b9c.png",
    items: [
      { name: "Bananas", quantity: 12, unit: "pieces" },
      { name: "Apples", quantity: 8, unit: "pieces" },
      { name: "Oranges", quantity: 8, unit: "pieces" },
      { name: "Pineapple", quantity: 2, unit: "pieces" },
      { name: "Mangoes", quantity: 6, unit: "pieces" },
      { name: "Avocados", quantity: 4, unit: "pieces" },
      { name: "Lemons", quantity: 6, unit: "pieces" }
    ]
  },
  {
    id: 9,
    title: "Large Fruit Bundle",
    description: "Abundant fruit selection for families",
    price: 29000,
    originalPrice: 35000,
    image: "/lovable-uploads/ac33e2f2-2a58-4fae-af4a-cc509ae3aae0.png",
    items: [
      { name: "Bananas", quantity: 24, unit: "pieces" },
      { name: "Apples", quantity: 12, unit: "pieces" },
      { name: "Oranges", quantity: 12, unit: "pieces" },
      { name: "Pineapple", quantity: 3, unit: "pieces" },
      { name: "Mangoes", quantity: 10, unit: "pieces" },
      { name: "Avocados", quantity: 8, unit: "pieces" },
      { name: "Watermelon", quantity: 1, unit: "piece" },
      { name: "Grapes", quantity: 2, unit: "bunches" }
    ]
  }
];

const Bundles = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with orange background and white text */}
      <div className="bg-khrate-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Bundles</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Choose from our carefully curated bundles designed to meet your household needs. 
            Save time and money with our pre-selected combinations of essential items.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {bundlesData.map((bundle) => (
            <BundleCard
              key={bundle.id}
              id={bundle.id}
              title={bundle.title}
              price={bundle.price}
              originalPrice={bundle.originalPrice}
              items={bundle.items.map(item => `${item.name} (${item.quantity} ${item.unit})`)}
              image={bundle.image}
              description={bundle.description}
            />
          ))}
        </div>

        <Card className="bg-white border-khrate-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-khrate-600">Why Choose Our Bundles?</CardTitle>
            <CardDescription className="text-lg">
              Save time, money, and effort with our expertly curated grocery bundles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-khrate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Great Savings</h3>
                <p className="text-gray-600">Save up to 20% compared to buying items individually</p>
              </div>
              <div className="text-center">
                <div className="bg-khrate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="font-semibold mb-2">Time Saving</h3>
                <p className="text-gray-600">No need to select individual items - we've done the work for you</p>
              </div>
              <div className="text-center">
                <div className="bg-khrate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-semibold mb-2">Convenience</h3>
                <p className="text-gray-600">Everything you need in one package, delivered to your door</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bundles;

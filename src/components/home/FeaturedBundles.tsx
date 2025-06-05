
import { Button } from "@/components/ui/button";
import BundleCard from "@/components/bundles/BundleCard";
import { Link } from "react-router-dom";

// Sample data for bundles - updated to match expected structure
const bundles = [
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
      { name: "Oil", quantity: 1 },
      { name: "Sugar", quantity: 1 },
      { name: "Salt", quantity: 0.1 },
      { name: "Eggs", quantity: 10 }
    ]
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
    ]
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
    ]
  }
];

const FeaturedBundles = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Bundles</h2>
            <p className="text-muted-foreground mt-2">Pre-curated grocery packages with the best savings</p>
          </div>
          <Button variant="link" className="text-khrate-500 hover:text-khrate-600 p-0" asChild>
            <Link to="/bundles">View all bundles →</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {bundles.map((bundle) => (
            <BundleCard 
              key={bundle.id} 
              bundle={bundle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBundles;

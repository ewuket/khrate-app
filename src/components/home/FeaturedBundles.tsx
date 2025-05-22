
import { Button } from "@/components/ui/button";
import BundleCard from "@/components/bundles/BundleCard";
import { Link } from "react-router-dom";

// Sample data for bundles
const bundles = [
  {
    id: 1,
    name: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 25000,
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=2574&auto=format&fit=crop",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt", "Eggs"]
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 45000,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt", "Eggs", "Bread", "Milk"]
  },
  {
    id: 3,
    name: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 75000,
    image: "https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=2574&auto=format&fit=crop",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt", "Eggs", "Bread", "Milk", "Flour", "Sugar"]
  }
];

const FeaturedBundles = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Bundles</h2>
            <p className="text-muted-foreground mt-2">Pre-curated grocery packages with the best savings</p>
          </div>
          <Button variant="link" className="text-khrate-500 hover:text-khrate-600 p-0" asChild>
            <Link to="/bundles">View all bundles →</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBundles;

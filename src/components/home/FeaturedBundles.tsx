
import { Button } from "@/components/ui/button";
import BundleCard from "@/components/bundles/BundleCard";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

// Sample data for bundles
const bundles = [
  {
    id: 1,
    name: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 25000,
    image: "/lovable-uploads/464ca869-8797-4eb8-9526-98af04334e84.png",
    items: ["Rice (1kg)", "Beans (500g)", "Tomatoes (6)", "Onions (4)", "Oil (500ml)", "Salt (250g)", "Eggs (12)"]
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 45000,
    image: "/lovable-uploads/2455b7e0-b0f8-4f2a-aaca-995dcd6da943.png",
    items: ["Rice (2kg)", "Beans (1kg)", "Tomatoes (10)", "Onions (8)", "Oil (1L)", "Salt (500g)", "Eggs (24)", "Bread (2)", "Milk (2L)"]
  },
  {
    id: 7,
    name: "Small Fruit Bundle",
    description: "Fresh seasonal fruits for 1-2 people",
    price: 15000,
    image: "/lovable-uploads/d0db3cc3-a1fc-43b8-b251-a4efba68113a.png",
    items: ["Oranges (4)", "Apples (4)", "Bananas (6)", "Grapes (1 bunch)", "Strawberries (500g)"]
  }
];

const FeaturedBundles = () => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (bundle: any) => {
    addToCart(bundle, 'bundle');
  };
  
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
            <BundleCard 
              key={bundle.id} 
              bundle={bundle} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBundles;

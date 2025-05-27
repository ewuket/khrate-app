
import { Button } from "@/components/ui/button";
import BundleCard from "@/components/bundles/BundleCard";
import { Link } from "react-router-dom";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";

// Sample data for bundles - updated prices to match Bundles page
const bundles = [
  {
    id: 1,
    name: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 32700, // Updated to match Bundles page
    image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png", // Keeping existing image
    items: ["Rice (10kg)", "Beans (2kg)", "Tomatoes (1kg)", "Onions (2kg)", "Green Paper (1kg)", "peas (1kg)", "Oil (1L)", "Sugar (1kg)", "Salt (100g)", "Eggs (10)"]
  },
  {
    id: 2,
    name: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 69240, // Updated to match Bundles page
    image: "/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png", // Keeping existing image
    items: ["Rice (15kg)", "Beans (5kg)", "Tomatoes (3kg)", "Onions (3kg)", "Green Paper (3kg)", "Oil (3L)", "Sugar (3kg)", "Salt (150g)", "Eggs (12)", "Slice Bread (1pack)", "Milk (2L)"]
  },
  {
    id: 3,
    name: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 119000, // Updated to match Bundles page
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png", // Keeping original image
    items: ["Rice (25kg)", "Beans (10kg)", "Tomatoes (5kg)", "Onions (5kg)", "Oil (5L)", "Salt (250g)", "Eggs (24pieces)", "Slice Bread (3pack)", "Milk (4L)", "Cassava Flour (5kg)", "Sugar (5kg)"]
  }
];

const FeaturedBundles = () => {
  const { addToCart } = useSupabaseCart();
  
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

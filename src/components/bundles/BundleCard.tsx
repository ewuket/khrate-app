
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";
import { toast } from "sonner";

interface BundleCardProps {
  bundle: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    items: string[];
    category?: string;
  };
}

const BundleCard = ({ bundle }: BundleCardProps) => {
  const handleAddToCart = () => {
    toast.success(`${bundle.name} added to cart!`);
    // In a real app, this would add to cart state or context
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={bundle.image} 
          alt={bundle.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{bundle.name}</h3>
        <p className="text-muted-foreground mb-4">{bundle.description}</p>
        
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-2">Includes:</div>
          <div className="flex flex-wrap gap-1">
            {bundle.items.slice(0, 5).map((item, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-xs px-2 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
            {bundle.items.length > 5 && (
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                +{bundle.items.length - 5} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-khrate-500">{bundle.price.toLocaleString()} RWF</div>
          <Button 
            size="sm" 
            className="bg-khrate-500 hover:bg-khrate-600"
            onClick={handleAddToCart}
          >
            <ShoppingBasket className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleCard;

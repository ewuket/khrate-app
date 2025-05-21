
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";

interface Bundle {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  items: string[];
}

interface BundleCardProps {
  bundle: Bundle;
}

const BundleCard = ({ bundle }: BundleCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={bundle.image} 
          alt={bundle.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{bundle.name}</h3>
            <p className="text-muted-foreground text-sm">{bundle.description}</p>
          </div>
          <div className="text-xl font-bold text-khrate-500">${bundle.price}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-1">
          {bundle.items.slice(0, 5).map((item, index) => (
            <span 
              key={index} 
              className="text-xs bg-khrate-50 text-khrate-700 px-2 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
          {bundle.items.length > 5 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              +{bundle.items.length - 5} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-khrate-500 hover:bg-khrate-600">
          <ShoppingBasket className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BundleCard;

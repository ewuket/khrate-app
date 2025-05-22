
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBasket, Eye } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  onAddToCart: (bundle: any) => void;
}

const BundleCard = ({ bundle, onAddToCart }: BundleCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(bundle);
    toast.success(`${bundle.name} added to cart!`);
  };
  
  return (
    <>
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
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                size="sm" 
                className="bg-khrate-500 hover:bg-khrate-600"
                onClick={handleAddToCart}
              >
                <ShoppingBasket className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{bundle.name} Contents</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {bundle.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-khrate-500"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="font-bold text-khrate-500">{bundle.price.toLocaleString()} RWF</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(false)}
            >
              Close
            </Button>
            <Button
              className="bg-khrate-500 hover:bg-khrate-600"
              onClick={() => {
                handleAddToCart();
                setPreviewOpen(false);
              }}
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BundleCard;

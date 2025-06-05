
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Users, Package, Eye } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import BundlePreviewModal from "./BundlePreviewModal";

interface BundleItem {
  name: string;
  quantity: number;
}

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  items: BundleItem[];
}

interface BundleCardProps {
  bundle: Bundle;
  onSaveBundle?: (bundleId: number) => void;
}

const BundleCard = ({ bundle, onSaveBundle }: BundleCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { addToCart } = useCartContext();
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleSaveBundle = () => {
    setIsSaved(!isSaved);
    onSaveBundle?.(bundle.id);
    toast.success(isSaved ? "Bundle removed from favorites" : "Bundle saved to favorites");
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple clicks
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsAddingToCart(true);
    try {
      const bundleItem = {
        id: bundle.id,
        name: bundle.title,
        price: bundle.price,
        unit: 'bundle',
        type: 'bundle' as const,
        items: bundle.items.map(item => item.name)
      };

      await addToCart(bundleItem);
      toast.success(`${bundle.title} added to cart!`);
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add bundle to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  // Show only first 3 items in card, rest in preview
  const displayItems = bundle.items.slice(0, 3);
  const remainingCount = bundle.items.length - displayItems.length;

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-khrate-300 bg-white overflow-hidden">
        <div className="relative overflow-hidden">
          <img 
            src={bundle.image} 
            alt={bundle.title}
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveBundle}
              className={`h-8 w-8 rounded-full backdrop-blur-sm transition-colors ${
                isSaved 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-khrate-500 text-white font-medium px-2 py-1 text-xs">
              <Package className="h-3 w-3 mr-1" />
              Bundle
            </Badge>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {bundle.title}
            </CardTitle>
            <div className="text-right ml-2 flex-shrink-0">
              <div className="text-xl font-bold text-khrate-600">
                {formatPrice(bundle.price)}
              </div>
            </div>
          </div>
          <CardDescription className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {bundle.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center">
              <Package className="h-4 w-4 mr-1 text-khrate-500" />
              Items included ({bundle.items.length}):
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              {displayItems.map((item, index) => (
                <div key={index} className="flex justify-between py-0.5">
                  <span className="truncate mr-1">{item.name}</span>
                  <span className="text-khrate-600 font-medium flex-shrink-0">
                    {typeof item.quantity === 'number' && item.quantity < 1 
                      ? `${item.quantity}kg` 
                      : item.quantity
                    }
                  </span>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="text-center text-khrate-500 font-medium py-1">
                  +{remainingCount} more items
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button 
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Bundle
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-khrate-500 hover:bg-khrate-600 text-white font-medium py-2 px-4 transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              
              <GroupBuyButton 
                item={{
                  id: bundle.id,
                  name: bundle.title,
                  price: bundle.price,
                  unit: 'bundle',
                  type: 'bundle',
                  items: bundle.items.map(item => item.name)
                }}
                variant="outline"
                className="flex-1 sm:flex-initial border-khrate-500 text-khrate-600 hover:bg-khrate-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <BundlePreviewModal
        bundle={bundle}
        open={showPreview}
        onOpenChange={setShowPreview}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default BundleCard;

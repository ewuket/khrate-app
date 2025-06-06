
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart } from "lucide-react";

interface BundleItem {
  name: string;
  quantity: number;
  unit?: string;
}

export interface Bundle {
  id: number;
  title: string;
  description?: string;
  price: number;
  originalPrice: number;
  image?: string;
  items: BundleItem[];
  category?: string;
}

interface BundlePreviewModalProps {
  bundle: Bundle;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  isAdding: boolean;
}

const BundlePreviewModal = ({
  bundle,
  isOpen,
  onClose,
  onAddToCart,
  isAdding
}: BundlePreviewModalProps) => {
  const savings = bundle.originalPrice - bundle.price;
  const savingsPercentage = Math.round((savings / bundle.originalPrice) * 100);

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{bundle.title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {bundle.image && (
            <div className="relative">
              <img 
                src={bundle.image} 
                alt={bundle.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Badge 
                variant="destructive" 
                className="absolute top-3 right-3 bg-green-500 hover:bg-green-600"
              >
                Save {savingsPercentage}%
              </Badge>
            </div>
          )}

          {bundle.description && (
            <p className="text-gray-600">{bundle.description}</p>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's included:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bundle.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-khrate-600 font-semibold">
                    {typeof item.quantity === 'number' && item.quantity < 1 
                      ? `${item.quantity}kg` 
                      : item.quantity
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Price:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-khrate-600">
                  {formatPrice(bundle.price)}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(bundle.originalPrice)}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={onAddToCart}
              disabled={isAdding}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlePreviewModal;

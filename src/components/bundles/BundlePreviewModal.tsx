
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";

interface BundlePreviewModalProps {
  bundle: {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    items: Array<{ name: string; quantity: number | string; unit?: string }>;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  isAdding: boolean;
}

const BundlePreviewModal: React.FC<BundlePreviewModalProps> = ({
  bundle,
  isOpen,
  onClose,
  onAddToCart,
  isAdding
}) => {
  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  const calculateSavings = () => {
    if (bundle.originalPrice) {
      const savings = bundle.originalPrice - bundle.price;
      const percentage = Math.round((savings / bundle.originalPrice) * 100);
      return { amount: savings, percentage };
    }
    return null;
  };

  const savings = calculateSavings();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(e);
  };

  const handleCheckout = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      currentTarget: null
    } as React.MouseEvent;
    
    onAddToCart(syntheticEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {bundle.title}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          {/* Bundle Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={bundle.image} 
              alt={bundle.title}
              className="w-full h-48 object-cover"
            />
            {savings && (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                Save {savings.percentage}% (RWF {savings.amount.toLocaleString()})
              </div>
            )}
          </div>
          
          {/* Price Section */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-khrate-600">
              {formatPrice(bundle.price)}
            </div>
            {bundle.originalPrice && (
              <div className="text-lg text-gray-500 line-through">
                {formatPrice(bundle.originalPrice)}
              </div>
            )}
            <p className="text-sm text-gray-600">
              Great for 2-3 people, weekly essentials
            </p>
          </div>
          
          {/* What's Included Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">What's included:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {bundle.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    • {typeof item.quantity === 'number' && item.quantity < 1 
                      ? `${item.quantity}kg` 
                      : item.quantity
                    } {item.unit ? item.unit + ' ' : ''}{item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-medium"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            
            <Button
              onClick={handleCheckout}
              variant="outline"
              className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50 py-3 text-lg font-medium"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlePreviewModal;

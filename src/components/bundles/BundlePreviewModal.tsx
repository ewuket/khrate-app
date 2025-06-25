
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, CreditCard, Package, Star, Truck, Clock } from "lucide-react";
import CheckoutDialog from "../checkout/CheckoutDialog";

interface BundlePreviewModalProps {
  bundle: {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    items: Array<{ name: string; quantity: number | string; unit?: string }>;
    description?: string;
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
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

  const handleProceedToCheckout = () => {
    onClose();
    setCheckoutOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-r from-khrate-500 to-khrate-600 text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5" />
              {bundle.title}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="p-4">
            {/* Compact Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Bundle Image */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg shadow-md h-48">
                  <img 
                    src={bundle.image} 
                    alt={bundle.title}
                    className="w-full h-full object-cover"
                  />
                  {savings && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                      -{savings.percentage}% OFF
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bundle Info */}
              <div className="flex flex-col justify-center space-y-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 mb-1">{bundle.title}</h1>
                  <p className="text-gray-600 text-sm mb-3">
                    {bundle.description || "Fresh, quality ingredients delivered to your door"}
                  </p>
                  
                  {/* Price Section */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-khrate-600 mb-1">
                      {formatPrice(bundle.price)}
                    </div>
                    {bundle.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(bundle.originalPrice)}
                        </span>
                        <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                          Save {formatPrice(savings?.amount || 0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Compact Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1 text-xs bg-green-50 px-2 py-1 rounded">
                      <Star className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">Premium</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded">
                      <Truck className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-700">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-orange-50 px-2 py-1 rounded">
                      <Clock className="h-3 w-3 text-orange-600" />
                      <span className="text-orange-700">Same Day</span>
                    </div>
                  </div>
                </div>
                
                {/* Compact Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-2 text-sm font-semibold"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  
                  <Button
                    onClick={handleProceedToCheckout}
                    variant="outline"
                    className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50 py-2 text-sm font-semibold"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Compact Items Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                What's included ({bundle.items.length} items)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {bundle.items.map((item, index) => (
                  <div key={index} className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-khrate-500 rounded-full flex-shrink-0"></div>
                        <span className="font-medium text-gray-800 text-sm">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-khrate-600 font-bold text-sm">
                        {typeof item.quantity === 'number' && item.quantity < 1 
                          ? `${item.quantity}kg` 
                          : item.quantity
                        } {item.unit || ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Why Choose Section */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center p-2">
                <div className="w-10 h-10 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-5 w-5 text-khrate-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm">Fast Delivery</h4>
                <p className="text-xs text-gray-600">Same day delivery</p>
              </div>
              <div className="text-center p-2">
                <div className="w-10 h-10 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-5 w-5 text-khrate-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm">Premium Quality</h4>
                <p className="text-xs text-gray-600">Fresh ingredients</p>
              </div>
              <div className="text-center p-2">
                <div className="w-10 h-10 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="h-5 w-5 text-khrate-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm">Great Value</h4>
                <p className="text-xs text-gray-600">Save money</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
};

export default BundlePreviewModal;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, CreditCard } from "lucide-react";
import CheckoutDialog from "../checkout/CheckoutDialog";

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

  const bundleCartItem = {
    id: bundle.id,
    name: bundle.title,
    price: bundle.price,
    quantity: 1,
    unit: 'bundle'
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-900">
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
          
          <div className="p-6 space-y-6">
            {/* Bundle Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={bundle.image} 
                alt={bundle.title}
                className="w-full h-64 object-cover"
              />
              {savings && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg">
                  Save {savings.percentage}%
                </div>
              )}
            </div>
            
            {/* Price Section */}
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-khrate-600">
                {formatPrice(bundle.price)}
              </div>
              {bundle.originalPrice && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(bundle.originalPrice)}
                  </span>
                  <span className="text-lg text-green-600 font-semibold">
                    Save {formatPrice(savings?.amount || 0)}
                  </span>
                </div>
              )}
              <p className="text-gray-600">
                Perfect for families • Fresh ingredients • Ready to deliver
              </p>
            </div>
            
            {/* What's Included Section */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-xl border-b pb-2">What's included:</h4>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                {bundle.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-khrate-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-khrate-600 font-semibold">
                      {typeof item.quantity === 'number' && item.quantity < 1 
                        ? `${item.quantity}kg` 
                        : item.quantity
                      } {item.unit || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-4 text-lg font-semibold"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
              
              <Button
                onClick={handleProceedToCheckout}
                variant="outline"
                className="w-full border-2 border-khrate-500 text-khrate-600 hover:bg-khrate-50 py-4 text-lg font-semibold"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        getCartTotal={() => bundle.price}
        formatPrice={formatPrice}
        cartItems={[bundleCartItem]}
        clearCart={() => {}}
        saveOrder={() => {}}
      />
    </>
  );
};

export default BundlePreviewModal;

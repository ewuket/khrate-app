
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
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 bg-white">
          <DialogHeader className="flex flex-row items-center justify-between p-6 border-b bg-gradient-to-r from-khrate-500 to-khrate-600 text-white">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
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
          
          <div className="p-6">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Bundle Image */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-lg h-80">
                  <img 
                    src={bundle.image} 
                    alt={bundle.title}
                    className="w-full h-full object-cover"
                  />
                  {savings && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{savings.percentage}% OFF
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bundle Info */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{bundle.title}</h1>
                  <p className="text-gray-600 text-lg mb-4">
                    {bundle.description || "Fresh, quality ingredients delivered to your door"}
                  </p>
                  
                  {/* Price Section */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-khrate-600 mb-2">
                      {formatPrice(bundle.price)}
                    </div>
                    {bundle.originalPrice && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(bundle.originalPrice)}
                        </span>
                        <span className="text-lg text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                          Save {formatPrice(savings?.amount || 0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-full">
                      <Star className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-full">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-orange-50 px-3 py-2 rounded-full">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-700">Same Day</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
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
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Items Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What's included in this bundle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundle.items.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-khrate-500 rounded-full flex-shrink-0"></div>
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-khrate-600 font-bold">
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

            {/* Why Choose Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-8 w-8 text-khrate-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600">Same day delivery available to your doorstep</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-khrate-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Premium Quality</h4>
                <p className="text-sm text-gray-600">Handpicked fresh ingredients for your family</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-8 w-8 text-khrate-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Great Value</h4>
                <p className="text-sm text-gray-600">Save money with our bundled packages</p>
              </div>
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

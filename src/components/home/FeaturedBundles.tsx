import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import BundlePreviewModal from "@/components/bundles/BundlePreviewModal";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import BundleAddToCartButton from "@/components/bundles/BundleAddToCartButton";

// Use the actual bundles from the Bundles page
const featuredBundles = [
  {
    id: 1,
    title: "Single Bundle",
    description: "Perfect for 1 person, 7-day essentials",
    price: 32700,
    originalPrice: 40000,
    image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png",
    items: [
      { name: "Rice", quantity: 10 },
      { name: "Beans", quantity: 2 },
      { name: "Tomatoes", quantity: 1 },
      { name: "Onions", quantity: 2 },
      { name: "Green Paper", quantity: 1 },
      { name: "Peas", quantity: 1 },
      { name: "Oil", quantity: 1 },
      { name: "Sugar", quantity: 1 },
      { name: "Salt", quantity: 0.1 },
      { name: "Eggs", quantity: 10 }
    ]
  },
  {
    id: 2,
    title: "Medium Bundle",
    description: "Great for 2-3 people, weekly essentials",
    price: 69240,
    originalPrice: 85000,
    image: "/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png",
    items: [
      { name: "Rice", quantity: 15 },
      { name: "Beans", quantity: 5 },
      { name: "Tomatoes", quantity: 3 },
      { name: "Onions", quantity: 3 },
      { name: "Green Paper", quantity: 3 },
      { name: "Oil", quantity: 3 },
      { name: "Sugar", quantity: 3 },
      { name: "Salt", quantity: 0.15 },
      { name: "Eggs", quantity: 12 },
      { name: "Slice Bread", quantity: 1 },
      { name: "Milk", quantity: 2 }
    ]
  },
  {
    id: 3,
    title: "Large Bundle",
    description: "Family size, complete weekly groceries",
    price: 119000,
    originalPrice: 150000,
    image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png",
    items: [
      { name: "Rice", quantity: 25 },
      { name: "Beans", quantity: 10 },
      { name: "Tomatoes", quantity: 5 },
      { name: "Onions", quantity: 5 },
      { name: "Oil", quantity: 5 },
      { name: "Salt", quantity: 0.25 },
      { name: "Eggs", quantity: 24 },
      { name: "Slice Bread", quantity: 3 },
      { name: "Milk", quantity: 4 },
      { name: "Cassava Flour", quantity: 5 },
      { name: "Sugar", quantity: 5 }
    ]
  }
];

const FeaturedBundles = () => {
  const { addToCart, isAddingToCart } = useCartContext();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [selectedBundle, setSelectedBundle] = useState<typeof featuredBundles[0] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleAddToCart = async (bundle: typeof featuredBundles[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      const bundleItem = {
        id: bundle.id,
        name: bundle.title,
        price: bundle.price,
        unit: 'bundle',
        type: 'bundle' as const,
        items: bundle.items.map(item => item.name)
      };

      console.log('Adding featured bundle to cart:', bundleItem);
      await addToCart(bundleItem);
      toast.success(`${bundle.title} added to cart!`);
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add bundle to cart');
    }
  };

  const handlePreview = (bundle: typeof featuredBundles[0]) => {
    setSelectedBundle(bundle);
    setShowPreview(true);
  };

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bundles</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Save time and money with our carefully curated bundles
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBundles.map((bundle) => {
              const isCurrentlyAdding = isAddingToCart(bundle.id, 'bundle');
              
              return (
                <Card key={bundle.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={bundle.image} 
                      alt={bundle.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-semibold">
                        {bundle.title}
                      </CardTitle>
                      <div className="text-xl font-bold text-khrate-600">
                        {formatPrice(bundle.price)}
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {bundle.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Items included:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {bundle.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.name}</span>
                            <span className="text-khrate-600 font-medium">
                              {typeof item.quantity === 'number' && item.quantity < 1 
                                ? `${item.quantity}kg` 
                                : item.quantity
                              }
                            </span>
                          </div>
                        ))}
                        {bundle.items.length > 3 && (
                          <div className="text-center text-khrate-500 font-medium">
                            +{bundle.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handlePreview(bundle)}
                        variant="outline"
                        className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50 touch-manipulation"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Bundle
                      </Button>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <BundleAddToCartButton
                          onAddToCart={(e) => handleAddToCart(bundle, e)}
                          isAdding={isCurrentlyAdding}
                          className="flex-1"
                        />
                        
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
                          className="flex-1 sm:flex-initial border-khrate-500 text-khrate-600 hover:bg-khrate-50 touch-manipulation"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {selectedBundle && (
        <BundlePreviewModal
          bundle={selectedBundle}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onAddToCart={() => handleAddToCart(selectedBundle, {} as React.MouseEvent)}
          isAdding={isAddingToCart(selectedBundle.id, 'bundle')}
        />
      )}
    </>
  );
};

export default FeaturedBundles;


import { useBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Bundles = () => {
  const { bundles, loading, error, loadBundles } = useBundles();
  
  console.log('Bundles page render:', { bundlesCount: bundles.length, loading, error });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Bundle Collection</h1>
          <p className="text-lg text-gray-600">Discover amazing deals with our curated bundles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Bundles</h2>
          <p className="text-gray-600 mb-6">We're having trouble loading our bundles. Please try again.</p>
          <Button 
            onClick={() => loadBundles()} 
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bundles Available</h2>
          <p className="text-gray-600">Check back soon for new bundle deals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Bundle Collection</h1>
        <p className="text-lg text-gray-600">Discover amazing deals with our curated bundles</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bundles.map((bundle) => {
          const discount = bundle.original_price 
            ? Math.round(((bundle.original_price - bundle.price) / bundle.original_price) * 100)
            : 0;
          
          return (
            <BundleCard
              key={bundle.id}
              id={bundle.id}
              title={bundle.title}
              price={bundle.price}
              originalPrice={bundle.original_price || bundle.price}
              discount={discount}
              items={bundle.items?.map(item => `${item.item_name} (${item.quantity} ${item.unit})`) || []}
              image={bundle.image_url || ''}
              description={bundle.description || ''}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Bundles;

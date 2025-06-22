
import { useBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const Bundles = () => {
  const { data: bundles, isLoading, error, refetch } = useBundles();

  console.log('Bundles page - Loading:', isLoading, 'Error:', error, 'Data:', bundles);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
            <p className="text-gray-600 text-lg">Choose from our carefully curated food bundles</p>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <Loader2 className="h-8 w-8 animate-spin text-khrate-500" />
            <span className="ml-2 text-lg text-gray-600">Loading bundles...</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading bundles:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
            <p className="text-gray-600 text-lg">Choose from our carefully curated food bundles</p>
          </div>
          
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load bundles. Please try again later.
              <button 
                onClick={() => refetch()} 
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!bundles || bundles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
            <p className="text-gray-600 text-lg">Choose from our carefully curated food bundles</p>
          </div>
          
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No bundles available</h2>
            <p className="text-gray-500 mb-6">We're working on adding new bundles. Please check back soon!</p>
            <button 
              onClick={() => refetch()} 
              className="bg-khrate-500 hover:bg-khrate-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
          <p className="text-gray-600 text-lg">Choose from our carefully curated food bundles</p>
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
    </div>
  );
};

export default Bundles;

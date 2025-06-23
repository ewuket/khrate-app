
import { useFeaturedBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FeaturedBundles = () => {
  const { data: bundles, isLoading, error, refetch, isFetching } = useFeaturedBundles();
  
  console.log('FeaturedBundles render:', { 
    bundlesCount: bundles?.length || 0, 
    isLoading, 
    isFetching, 
    error: error?.message 
  });

  if (error) {
    console.error('FeaturedBundles error:', error);
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="max-w-md mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load featured bundles. Please try again.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button 
                onClick={() => refetch()} 
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading || isFetching) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bundles || bundles.length === 0) {
    console.log('No featured bundles to display');
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No featured bundles available at the moment.</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
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
                items={bundle.items?.map(item => `${item.item_name} (${item.quantity} ${item.unit || 'pieces'})`) || []}
                image={bundle.image_url || '/placeholder.svg'}
                description={bundle.description || ''}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBundles;

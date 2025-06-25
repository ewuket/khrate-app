
import { useFeaturedBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FeaturedBundles = () => {
  const { data: bundles, isLoading, error, refetch, isFetching } = useFeaturedBundles();
  
  console.log('FeaturedBundles - Data:', { 
    bundlesCount: bundles?.length, 
    isLoading, 
    isFetching, 
    error,
    bundles: bundles?.slice(0, 2) // Log first 2 featured bundles for debugging
  });

  if (error) {
    console.error('Featured bundles error:', error);
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="max-w-md mx-auto text-center">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load featured bundles: {error.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => refetch()} 
              className="bg-khrate-500 hover:bg-khrate-600"
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Loading...' : 'Retry'}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    console.log('Featured bundles - Loading state');
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
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
    console.log('Featured bundles - No bundles found');
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No featured bundles available right now.</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </section>
    );
  }

  console.log('Featured bundles - Rendering bundles:', bundles.length);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => {
            const discount = bundle.original_price && bundle.original_price > bundle.price
              ? Math.round(((bundle.original_price - bundle.price) / bundle.original_price) * 100)
              : 0;
            
            const itemsDisplay = bundle.items.map(item => 
              `${item.item_name} (${item.quantity} ${item.unit})`
            );
            
            console.log('Rendering featured bundle:', {
              id: bundle.id,
              title: bundle.title,
              isFeatured: bundle.is_featured,
              itemsCount: bundle.items.length
            });
            
            return (
              <BundleCard
                key={String(bundle.id)}
                id={bundle.id}
                title={bundle.title}
                price={bundle.price}
                originalPrice={bundle.original_price || bundle.price}
                discount={discount}
                items={itemsDisplay}
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

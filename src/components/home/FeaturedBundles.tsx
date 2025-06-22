
import { useFeaturedBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedBundles = () => {
  const { data: bundles, isLoading, error } = useFeaturedBundles();
  
  console.log('FeaturedBundles render:', { bundlesCount: bundles?.length || 0, isLoading, error });

  if (isLoading) {
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

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="text-center py-12">
            <p className="text-red-600">Error loading bundles: {error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-khrate-500 text-white rounded hover:bg-khrate-600"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!bundles || bundles.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Bundles</h2>
          <div className="text-center py-12">
            <p className="text-gray-600">No featured bundles available at the moment.</p>
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
                items={bundle.items?.map(item => `${item.item_name} (${item.quantity} ${item.unit})`) || []}
                image={bundle.image_url || ''}
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

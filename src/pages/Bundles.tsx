
import { useBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

const Bundles = () => {
  const { bundles, loading, error, refetch } = useBundles();

  console.log('📄 Bundles page - Current state:', { 
    bundlesCount: bundles?.length, 
    loading, 
    error,
    bundles: bundles?.slice(0, 2) // Log first 2 bundles for debugging
  });

  if (error) {
    console.error('❌ Bundles page error:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
            <p className="text-gray-600 text-lg">Discover our curated food bundles</p>
          </div>
          
          <div className="max-w-md mx-auto text-center">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load bundles: {error}
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => refetch()} 
              className="bg-khrate-500 hover:bg-khrate-600"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Try Again'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('⏳ Bundles page - Loading state');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
            <p className="text-gray-600 text-lg">Discover our curated food bundles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
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

  if (!bundles || bundles.length === 0) {
    console.log('📭 Bundles page - No bundles found');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
            <p className="text-gray-600 text-lg">Discover our curated food bundles</p>
          </div>
          
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No bundles available</h2>
            <p className="text-gray-500 mb-6">Check back soon for new bundles!</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Bundles page - Rendering bundles:', bundles.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-khrate-600 mb-4">Our Bundles</h1>
          <p className="text-gray-600 text-lg">Discover our curated food bundles - {bundles.length} available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => {
            const discount = bundle.original_price && bundle.original_price > bundle.price
              ? Math.round(((bundle.original_price - bundle.price) / bundle.original_price) * 100)
              : 0;
            
            const itemsDisplay = bundle.items?.map(item => 
              `${item.item_name} (${item.quantity} ${item.unit})`
            ) || [];
            
            console.log('🎨 Rendering bundle:', {
              id: bundle.id,
              title: bundle.title,
              itemsCount: bundle.items?.length || 0,
              imageUrl: bundle.image_url
            });
            
            return (
              <BundleCard
                key={bundle.id}
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
    </div>
  );
};

export default Bundles;

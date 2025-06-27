
import React, { useEffect } from 'react';
import { useBundles } from '@/hooks/useBundles';
import BundleCard from '@/components/bundles/BundleCard';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedBundles = () => {
  const { featuredBundles, loading, error, fetchFeaturedBundles } = useBundles();

  useEffect(() => {
    console.log('🏠 FeaturedBundles component mounted, fetching featured bundles...');
    fetchFeaturedBundles();
  }, []);

  console.log('🏠 FeaturedBundles component render state:', {
    featuredBundlesCount: featuredBundles?.length,
    loading,
    error,
    featuredBundles: featuredBundles?.slice(0, 2) // Log first 2 for debugging
  });

  if (error) {
    console.error('❌ FeaturedBundles - Error state:', error);
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bundles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium bundles designed to give you the best value
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error loading featured bundles: {error}</p>
            <button 
              onClick={fetchFeaturedBundles}
              className="bg-khrate-500 hover:bg-khrate-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    console.log('⏳ FeaturedBundles - Loading state');
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bundles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium bundles designed to give you the best value
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
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

  if (!featuredBundles || featuredBundles.length === 0) {
    console.log('📭 FeaturedBundles - No featured bundles found');
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bundles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium bundles designed to give you the best value
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No featured bundles available at the moment.</p>
            <p className="text-sm text-gray-400">Check back soon for new featured bundles!</p>
            <button 
              onClick={fetchFeaturedBundles}
              className="mt-4 bg-khrate-500 hover:bg-khrate-600 text-white px-4 py-2 rounded"
            >
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }

  console.log('✅ FeaturedBundles - Rendering featured bundles:', featuredBundles.length);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bundles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collection of premium bundles designed to give you the best value
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBundles.map((bundle) => {
            const discount = bundle.original_price && bundle.original_price > bundle.price
              ? Math.round(((bundle.original_price - bundle.price) / bundle.original_price) * 100)
              : 0;
            
            const itemsDisplay = bundle.items?.map(item => 
              `${item.item_name} (${item.quantity} ${item.unit})`
            ) || [];
            
            console.log('🎨 Rendering featured bundle:', {
              id: bundle.id,
              title: bundle.title,
              itemsCount: bundle.items?.length || 0
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
    </section>
  );
};

export default FeaturedBundles;

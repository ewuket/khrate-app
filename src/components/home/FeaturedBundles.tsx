
import React, { useEffect } from 'react';
import { useBundles } from '@/hooks/useBundles';
import BundleCard from '@/components/bundles/BundleCard';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedBundles = () => {
  const { featuredBundles, loading, fetchFeaturedBundles } = useBundles();

  useEffect(() => {
    fetchFeaturedBundles();
  }, []);

  if (loading) {
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
            <p className="text-gray-500">No featured bundles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

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

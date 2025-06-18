
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BundleCard from "@/components/bundles/BundleCard";
import { useBundles } from "@/hooks/useBundles";

const Bundles = () => {
  const { bundles, loading } = useBundles();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khrate-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-khrate-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Bundles</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Choose from our carefully curated bundles designed to meet your household needs. 
            Save time and money with our pre-selected combinations of essential items.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                image={bundle.image_url}
                description={bundle.description || ''}
              />
            );
          })}
        </div>

        <Card className="bg-white border-khrate-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-khrate-600">Why Choose Our Bundles?</CardTitle>
            <CardDescription className="text-lg">
              Save time, money, and effort with our expertly curated grocery bundles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-khrate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Great Savings</h3>
                <p className="text-gray-600">Save up to 20% compared to buying items individually</p>
              </div>
              <div className="text-center">
                <div className="bg-khrate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="font-semibold mb-2">Time Saving</h3>
                <p className="text-gray-600">No need to select individual items - we've done the work for you</p>
              </div>
              <div className="text-center">
                <div className="bg-khrate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-semibold mb-2">Convenience</h3>
                <p className="text-gray-600">Everything you need in one package, delivered to your door</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Bundles;

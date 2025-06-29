
import { useFeaturedBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";

const FeaturedBundles = () => {
  const { data: featuredBundles = [], isLoading, error } = useFeaturedBundles();
  const { isAuthenticated, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Bundles</h2>
            <p className="text-gray-600">Popular food bundles chosen just for you</p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured bundles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Bundles</h2>
            <p className="text-gray-600">Popular food bundles chosen just for you</p>
          </div>
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Unable to load bundles</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredBundles.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Bundles</h2>
            <p className="text-gray-600">Popular food bundles chosen just for you</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">No featured bundles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Bundles</h2>
          <p className="text-gray-600">Popular food bundles chosen just for you</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredBundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onAuthRequired={openAuthModal}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBundles;

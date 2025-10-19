
import { useState } from "react";
import { useBundles } from "@/hooks/useBundles";
import BundleCard from "@/components/bundles/BundleCard";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search } from "lucide-react";
import VoiceSearch from "@/components/search/VoiceSearch";

const Bundles = () => {
  const { data: bundles = [], isLoading, error } = useBundles();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bundles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Unable to Load Bundles</h3>
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredBundles = bundles.filter(bundle =>
    bundle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Food Bundles</h1>
        <p className="text-gray-600 mb-4">
          Discover our curated food bundles designed to save you time and money.
        </p>
        
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bundles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <VoiceSearch onResult={setSearchQuery} />
        </div>
      </div>

      {filteredBundles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No bundles found" : "No Bundles Available"}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try a different search term" : "Check back later for new bundle offerings."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              id={bundle.id}
              title={bundle.title}
              description={bundle.description}
              price={bundle.price}
              originalPrice={bundle.original_price}
              image={bundle.image_url}
              onAuthRequired={openAuthModal}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bundles;

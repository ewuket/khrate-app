
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket, Clock } from "lucide-react";

interface BundleType {
  id: number;
  name: string;
  items: string[];
  lastOrdered: string;
}

interface SavedBundlesTabProps {
  savedBundles: BundleType[];
}

const SavedBundlesTab = ({ savedBundles }: SavedBundlesTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Saved Bundles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedBundles.map(bundle => (
          <Card key={bundle.id} className="border shadow-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{bundle.name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {bundle.items.join(", ")}
                  </div>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Last ordered: {new Date(bundle.lastOrdered).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center text-khrate-500 border-khrate-500 hover:bg-khrate-50"
                  >
                    <ShoppingBasket className="h-4 w-4 mr-1" />
                    Order Again
                  </Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default SavedBundlesTab;

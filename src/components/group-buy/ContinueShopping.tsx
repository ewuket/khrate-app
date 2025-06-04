
import { Button } from "@/components/ui/button";

const ContinueShopping = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">
        Continue shopping to add more items to your group cart
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild variant="outline">
          <a href="/bundles">Browse Bundles</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/custom-buy">Custom Shopping</a>
        </Button>
      </div>
    </div>
  );
};

export default ContinueShopping;

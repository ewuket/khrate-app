
import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, Percent } from "lucide-react";

interface GroupBuyHeroProps {
  onJoinGroup: () => void;
}

const GroupBuyHero: React.FC<GroupBuyHeroProps> = ({ onJoinGroup }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Group Buying Made Simple
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Join others in your community to buy in bulk and save money on groceries, 
          household items, and more
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Find Your Community</h3>
            <p className="opacity-80">Connect with neighbors and friends for group purchases</p>
          </div>
          
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Shop Together</h3>
            <p className="opacity-80">Add items to shared carts and reach minimum quantities</p>
          </div>
          
          <div className="text-center">
            <Percent className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Save Money</h3>
            <p className="opacity-80">Unlock bulk discounts when your group reaches the target</p>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="bg-white text-khrate-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          onClick={onJoinGroup}
        >
          Get Started - Join a Group
        </Button>
      </div>
    </div>
  );
};

export default GroupBuyHero;


import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

interface GroupBuyHeroProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

const GroupBuyHero = ({ onCreateGroup, onJoinGroup }: GroupBuyHeroProps) => {
  return (
    <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold">Group Buy</h1>
        <p className="mt-2 max-w-lg">
          Join forces with others to unlock bigger discounts and share delivery costs
        </p>
      </div>
    </section>
  );
};

export default GroupBuyHero;

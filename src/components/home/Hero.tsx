
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Package, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-white py-24">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-khrate-500">
              Big Savings in Every Crate
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
              KHRATE brings affordable groceries to your doorstep. Shop pre-curated bundles or build your own custom order.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-khrate-500 text-white hover:bg-khrate-600"
                asChild
              >
                <Link to="/bundles">
                  <ShoppingBasket className="mr-2 h-5 w-5" />
                  Shop Bundles
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-khrate-500 text-khrate-500 hover:bg-khrate-50"
                asChild
              >
                <Link to="/custom-buy">
                  <Package className="mr-2 h-5 w-5" />
                  Custom Buy
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-khrate-500 text-khrate-500 hover:bg-khrate-50"
                asChild
              >
                <Link to="/group-buy">
                  <Users className="mr-2 h-5 w-5" />
                  Group Buy
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img 
                src="/lovable-uploads/6394ed03-1023-4873-bb46-921839e56f26.png" 
                alt="KHRATE grocery delivery" 
                className="max-w-xs md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

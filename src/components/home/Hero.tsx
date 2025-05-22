
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Package, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-khrate-500 to-khrate-600 py-24 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Big Savings in Every Crate
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
              KHRATE brings affordable groceries to your doorstep. Shop pre-curated bundles or build your own custom order.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-khrate-600 hover:bg-gray-100"
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
                className="bg-transparent text-white border-white hover:bg-white/20"
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
                className="bg-transparent text-white border-white hover:bg-white/20"
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
            <div className="bg-white p-4 rounded-lg shadow-xl transform -rotate-2">
              <img 
                src="/lovable-uploads/6394ed03-1023-4873-bb46-921839e56f26.png" 
                alt="KHRATE grocery delivery" 
                className="max-w-xs md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-1/3 bg-white/10 -z-10 rounded-tl-full"></div>
      <div className="hidden md:block absolute left-0 top-0 w-1/4 h-1/4 bg-white/10 -z-10 rounded-br-full"></div>
    </section>
  );
};

export default Hero;

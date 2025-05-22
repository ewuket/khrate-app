
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Package } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-white py-12 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-black">Big Savings in</span><br />
              <span className="text-khrate-500">Every Crate</span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg">
              The affordable grocery delivery platform that brings fresh produce and essentials to your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-khrate-500 text-white hover:bg-khrate-600 rounded-full px-8"
                asChild
              >
                <Link to="/bundles">
                  Shop Bundles
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-khrate-500 text-khrate-500 hover:bg-khrate-50 rounded-full px-8"
                asChild
              >
                <Link to="/custom-buy">
                  Custom Buy
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span>Zero delivery fees</span>
              <span className="text-lg">•</span>
              <span>Group discounts</span>
              <span className="text-lg">•</span>
              <span>Fresh quality</span>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center relative">
            <div className="bg-khrate-50 p-4 rounded-3xl overflow-hidden">
              <img 
                src="/lovable-uploads/11112569-f41f-4966-9d17-8140d0bfa26d.png" 
                alt="Fresh groceries display" 
                className="rounded-2xl"
              />
              
              <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg">
                <div className="font-bold text-khrate-500">Save up to</div>
                <div className="text-5xl font-bold">30%</div>
                <div className="text-gray-600">with group buy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

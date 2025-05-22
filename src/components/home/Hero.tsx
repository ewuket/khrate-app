
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-white py-12 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-black">Big Savings in</span><br />
              <span className="text-khrate-500">Every Crate</span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-lg">
              The affordable grocery delivery platform that brings fresh produce and essentials to your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Button 
                asChild
                className="bg-khrate-500 hover:bg-khrate-600 text-white rounded-full px-8 py-6 text-base font-medium"
              >
                <Link to="/bundles">
                  Shop Bundles
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                asChild
                className="border-2 border-khrate-500 text-khrate-500 hover:bg-khrate-50 rounded-full px-8 py-6 text-base font-medium"
              >
                <Link to="/custom-buy">
                  Custom Buy
                </Link>
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="border-2 border-khrate-500 text-khrate-500 hover:bg-khrate-50 rounded-full px-8 py-6 text-base font-medium"
              >
                <Link to="/group-buy">
                  <Users className="mr-2 h-5 w-5" />
                  Group Buy
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Zero delivery fees</span>
              <span className="text-gray-400 mx-1">•</span>
              <span>Group discounts</span>
              <span className="text-gray-400 mx-1">•</span>
              <span>Fresh quality</span>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-end relative">
            <div className="bg-khrate-50 p-4 rounded-3xl overflow-hidden relative">
              <img 
                src="/lovable-uploads/4952f015-4df9-4021-b52c-406fd91d5dba.png" 
                alt="Fresh groceries display" 
                className="rounded-2xl w-full"
              />
              
              <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg">
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

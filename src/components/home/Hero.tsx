
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Big Savings in <span className="text-khrate-500">Every Crate</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The affordable grocery delivery platform that brings fresh produce and essentials to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-khrate" asChild>
                <Link to="/bundles">Shop Bundles</Link>
              </Button>
              <Button className="btn-outline" asChild>
                <Link to="/custom-buy">Custom Buy</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Zero delivery fees • Group discounts • Fresh quality
            </p>
          </div>
          
          <div className={`relative ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-khrate-100 to-khrate-200 rounded-3xl p-6 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" 
                alt="Fresh groceries" 
                className="rounded-2xl object-cover w-full h-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 w-32 md:w-40">
                <div className="font-bold text-khrate-500">Save up to</div>
                <div className="text-3xl md:text-4xl font-bold">30%</div>
                <div className="text-sm text-muted-foreground">with group buy</div>
              </div>
            </div>
            <div className="absolute -z-10 bottom-0 right-0 w-72 h-72 bg-khrate-100 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

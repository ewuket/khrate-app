
import { useState } from "react";
import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Users, Package, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { openAuthModal } = useAuth();
  
  const features = [
    {
      title: "Pre-curated Bundles",
      description: "Save time with our carefully selected grocery packages",
      icon: <ShoppingBasket className="h-8 w-8 text-khrate-500" />
    },
    {
      title: "Group Buying",
      description: "Join forces with others to unlock bigger discounts",
      icon: <Users className="h-8 w-8 text-khrate-500" />
    },
    {
      title: "Custom Orders",
      description: "Build your own grocery list with exactly what you need",
      icon: <Package className="h-8 w-8 text-khrate-500" />
    },
    {
      title: "Scheduled Delivery",
      description: "Choose when your groceries arrive at your doorstep",
      icon: <Calendar className="h-8 w-8 text-khrate-500" />
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        <FeaturedBundles />
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How KHRATE Works</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Making grocery shopping more affordable and accessible for everyone
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-16 text-white">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl font-bold">Ready to start saving?</h2>
                <p className="mt-2 max-w-md">Join KHRATE today and experience affordable grocery shopping</p>
              </div>
              <Button 
                className="bg-white text-khrate-500 hover:bg-gray-100" 
                size="lg"
                onClick={openAuthModal}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

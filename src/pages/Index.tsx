
import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import PopularGroupBuys from "@/components/home/PopularGroupBuys";
import HowItWorks from "@/components/home/HowItWorks";
import ChatAssistant from "@/components/chat/ChatAssistant";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Load any initial data if needed
    console.log('Index page loaded, user:', user?.id);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <FeaturedBundles />
        <PopularGroupBuys />
        <HowItWorks />
      </main>
      <ChatAssistant />
    </div>
  );
};

export default Index;

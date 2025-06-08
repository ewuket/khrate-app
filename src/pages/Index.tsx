
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import PopularGroupBuys from "@/components/home/PopularGroupBuys";
import Footer from "@/components/layout/Footer";
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
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedBundles />
        <PopularGroupBuys />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default Index;

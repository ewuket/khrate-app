
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Index from "./pages/Index";
import Bundles from "./pages/Bundles";
import CustomBuy from "./pages/CustomBuy";
import GroupBuy from "./pages/GroupBuy";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  const queryClient = new QueryClient();
  // Simulating a splash screen
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 second splash screen

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center animate-fade-in">
          <img 
            src="/lovable-uploads/6394ed03-1023-4873-bb46-921839e56f26.png" 
            alt="KHRATE Logo" 
            className="h-32 w-auto"
          />
          <h2 className="mt-4 text-2xl font-bold text-khrate-500">
            Big Savings in Every Crate
          </h2>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/custom-buy" element={<CustomBuy />} />
            <Route path="/group-buy" element={<GroupBuy />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

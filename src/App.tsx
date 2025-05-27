import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseCartProvider } from "@/contexts/SupabaseCartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import CartSidebar from "@/components/cart/CartSidebar";
import FloatingGroupCartButton from "@/components/group-buy/FloatingGroupCartButton";
import Index from "./pages/Index";
import Bundles from "./pages/Bundles";
import CustomBuy from "./pages/CustomBuy";
import GroupBuy from "./pages/GroupBuy";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SupabaseCartProvider>
          <GroupBuyingProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/bundles" element={<Bundles />} />
                <Route path="/custom-buy" element={<CustomBuy />} />
                <Route path="/group-buy" element={<GroupBuy />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CartSidebar />
              <FloatingGroupCartButton />
            </BrowserRouter>
          </GroupBuyingProvider>
        </SupabaseCartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

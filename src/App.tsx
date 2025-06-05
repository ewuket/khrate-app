
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import CartSidebar from "@/components/cart/CartSidebar";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Bundles from "./pages/Bundles";
import CustomBuy from "./pages/CustomBuy";
import GroupBuy from "./pages/GroupBuy";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <GroupBuyingProvider>
                <AdminProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/bundles" element={<Bundles />} />
                    <Route path="/custom-buy" element={<CustomBuy />} />
                    <Route path="/group-buy" element={<GroupBuy />} />
                    
                    {/* Protected routes */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  {/* Global CartSidebar available on all pages */}
                  <CartSidebar />
                </AdminProvider>
              </GroupBuyingProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

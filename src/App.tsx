
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Bundles from "./pages/Bundles";
import CustomBuy from "./pages/CustomBuy";
import GroupBuy from "./pages/GroupBuy";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <GroupBuyingProvider>
                <Routes>
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/bundles" element={<Bundles />} />
                  <Route path="/custom-buy" element={<Layout><CustomBuy /></Layout>} />
                  <Route path="/group-buy" element={<Layout><GroupBuy /></Layout>} />
                  <Route path="/contact" element={<Layout><Contact /></Layout>} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/terms" element={<Layout><Terms /></Layout>} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
                  <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                  <Route path="/auth/callback" element={<Layout><AuthCallback /></Layout>} />
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </GroupBuyingProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

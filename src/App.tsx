
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import CustomBuy from "./pages/CustomBuy";
import GroupBuy from "./pages/GroupBuy";
import Bundles from "./pages/Bundles";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <AdminProvider>
                <CartProvider>
                  <GroupBuyingProvider>
                    <div className="min-h-screen flex flex-col bg-background text-foreground">
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/custom-buy" element={<CustomBuy />} />
                          <Route path="/group-buy" element={<GroupBuy />} />
                          <Route path="/bundles" element={<Bundles />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/auth/callback" element={<AuthCallback />} />
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                      <AuthModal />
                    </div>
                    <Toaster />
                  </GroupBuyingProvider>
                </CartProvider>
              </AdminProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

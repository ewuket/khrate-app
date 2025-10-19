import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Users, Zap } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("khrate_welcome_seen");
    if (hasSeenWelcome) {
      navigate("/");
    } else {
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const handleGetStarted = () => {
    localStorage.setItem("khrate_welcome_seen", "true");
    navigate("/");
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-accent flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <ShoppingBag className="h-24 w-24 text-white mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white">KHRATE</h1>
          <p className="text-white/80 mt-2">Your Smart Shopping Companion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <ShoppingBag className="h-20 w-20 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Welcome to KHRATE</h1>
            <p className="text-xl text-muted-foreground">
              Shop smarter, save more with group buying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <ShoppingBag className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Bundles</h3>
              <p className="text-muted-foreground">
                Pre-made grocery bundles at discounted prices
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Group Buying</h3>
              <p className="text-muted-foreground">
                Join groups and save up to 15% on bulk orders
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Orders</h3>
              <p className="text-muted-foreground">
                Build your own bundle with exactly what you need
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

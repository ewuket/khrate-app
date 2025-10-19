
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import PopularGroupBuys from "@/components/home/PopularGroupBuys";
import HowItWorks from "@/components/home/HowItWorks";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for first visit
    const hasSeenWelcome = localStorage.getItem("khrate_welcome_seen");
    if (!hasSeenWelcome) {
      navigate("/welcome");
      return;
    }

    // Check for referral code
    const refCode = searchParams.get("ref");
    if (refCode && !user) {
      localStorage.setItem("khrate_referral_code", refCode);
      toast.success("Referral code applied! Sign up to get 10% off your first order.");
    }

    console.log('Index page loaded, user:', user?.id);
  }, [user, navigate, searchParams]);

  return (
    <>
      <Hero />
      <FeaturedBundles />
      <PopularGroupBuys />
      <HowItWorks />
    </>
  );
};

export default Index;

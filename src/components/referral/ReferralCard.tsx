import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Share2, Users } from "lucide-react";
import { toast } from "sonner";

const ReferralCard = () => {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Generate referral code from user ID
  const referralCode = user?.id ? `KHRATE${user.id.slice(0, 6).toUpperCase()}` : "LOADING";
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  const referralCount = 0; // TODO: Track from database

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join KHRATE",
          text: `Get 10% off your first order with my referral code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard();
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Refer & Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          <p className="text-2xl font-bold text-accent">{referralCode}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Friends get 10% off • You get 100 points
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={referralLink}
              readOnly
              className="text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className={copied ? "bg-green-50 border-green-200" : ""}
          >
            <Copy className={`h-4 w-4 ${copied ? "text-green-600" : ""}`} />
          </Button>
        </div>

        <Button
          onClick={shareReferral}
          className="w-full bg-accent hover:bg-accent/90"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Referral Link
        </Button>

        <div className="text-center pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Referrals: <span className="font-semibold text-foreground">{referralCount}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;

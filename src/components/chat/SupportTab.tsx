
import React from 'react';
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail } from "lucide-react";
import { toast } from "sonner";

interface SupportTabProps {
  handleContactSupport: (type: 'email' | 'phone', value: string) => void;
}

const SupportTab = ({ handleContactSupport }: SupportTabProps) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-medium text-lg mb-2">Email Support</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleContactSupport('email', 'bamlak.mulugeta@khrate.com')}
          >
            <Mail className="mr-2 h-4 w-4" />
            bamlak.mulugeta@khrate.com
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleContactSupport('email', 'robert.katabarwa@khrate.com')}
          >
            <Mail className="mr-2 h-4 w-4" />
            robert.katabarwa@khrate.com
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-lg mb-2">Phone Support</h3>
        <div className="space-y-2">
          <Button
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleContactSupport('phone', '0795754391')}
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            0795754391
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleContactSupport('phone', '0789843707')}
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            0789843707
          </Button>
        </div>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground">
        <p>Our support team is available Monday to Saturday from 8:00 AM to 6:00 PM.</p>
      </div>
    </div>
  );
};

export default SupportTab;

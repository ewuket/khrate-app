
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

const FooterFeedbackSection = () => {
  return (
    <div className="border-t pt-6">
      <h4 className="font-medium mb-3">We Value Your Feedback</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Help us improve our service and product offerings
      </p>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Give Feedback
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Share Your Thoughts</h4>
              <p className="text-sm text-muted-foreground">
                We appreciate your feedback to help us serve you better.
              </p>
            </div>
            <FeedbackForm compact />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FooterFeedbackSection;

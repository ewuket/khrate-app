
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FeedbackType } from "@/types/feedback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FeedbackFormProps {
  compact?: boolean;
}

const FeedbackForm = ({ compact = false }: FeedbackFormProps) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to save feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("");
      toast.success("Thank you for your feedback!");
      // In a real app, this would send the feedback to the server
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div>
        <Select value={type} onValueChange={(value) => setType(value as FeedbackType)}>
          <SelectTrigger>
            <SelectValue placeholder="Feedback type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="suggestion">Suggestion</SelectItem>
            <SelectItem value="complaint">Complaint</SelectItem>
            <SelectItem value="compliment">Compliment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Textarea
        placeholder="Please share your feedback with us..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="min-h-[100px]"
      />
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="anonymous-mode" 
          checked={anonymous} 
          onCheckedChange={setAnonymous}
        />
        <Label htmlFor="anonymous-mode">Submit anonymously</Label>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || !message.trim()}
        className={compact ? "w-full" : ""}
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
};

export default FeedbackForm;

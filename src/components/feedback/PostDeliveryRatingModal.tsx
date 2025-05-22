
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { RatingCategory } from "@/types/feedback";

interface PostDeliveryRatingModalProps {
  orderId: string;
  onClose: () => void;
}

const ratingCategories: { key: RatingCategory; label: string }[] = [
  { key: "accuracy", label: "Order Accuracy" },
  { key: "delivery", label: "Delivery Time" },
  { key: "quality", label: "Packaging & Product Quality" },
  { key: "overall", label: "Overall Satisfaction" },
];

const PostDeliveryRatingModal = ({ orderId, onClose }: PostDeliveryRatingModalProps) => {
  const [open, setOpen] = useState(true);
  const [ratings, setRatings] = useState<Record<RatingCategory, number>>({
    accuracy: 0,
    delivery: 0,
    quality: 0,
    overall: 0,
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Check if all categories are rated
    if (!Object.values(ratings).every(rating => rating > 0)) {
      toast.error("Please rate all categories");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call to save rating
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      toast.success("Thank you for your rating!");
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thank you for shopping with us!</DialogTitle>
          <DialogDescription>
            Please take a moment to rate your experience and help us serve you better.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {ratingCategories.map((category) => (
            <div key={category.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{category.label}</span>
                <StarRating
                  value={ratings[category.key]}
                  onChange={(value) => handleRatingChange(category.key, value)}
                  size={20}
                />
              </div>
            </div>
          ))}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Comments (Optional)</label>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDeliveryRatingModal;

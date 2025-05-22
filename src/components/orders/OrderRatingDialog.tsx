
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Order } from "@/types/order";
import { RatingCategory } from "@/types/feedback";
import StarRating from "@/components/feedback/StarRating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderRatingDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRatingSubmit: (order: Order) => void;
}

const ratingCategories: { key: RatingCategory; label: string }[] = [
  { key: "accuracy", label: "Order Accuracy" },
  { key: "delivery", label: "Delivery Time" },
  { key: "quality", label: "Packaging & Product Quality" },
  { key: "overall", label: "Overall Satisfaction" },
];

const OrderRatingDialog = ({ 
  order, 
  open, 
  onOpenChange, 
  onRatingSubmit
}: OrderRatingDialogProps) => {
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
      onRatingSubmit(order);
      onOpenChange(false);
      toast.success("Thank you for your rating!");
      // Reset form
      setComment("");
      setRatings({
        accuracy: 0,
        delivery: 0,
        quality: 0,
        overall: 0,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Order</DialogTitle>
          <DialogDescription>
            Please take a moment to rate your experience with order #{order.id}
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
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
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

export default OrderRatingDialog;

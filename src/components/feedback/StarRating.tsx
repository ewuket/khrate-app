
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

const StarRating = ({ value, onChange, size = 24 }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition-colors ${
            star <= (hoverValue || value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;

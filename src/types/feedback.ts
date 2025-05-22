
export type FeedbackType = "suggestion" | "complaint" | "compliment" | "other";

export type RatingCategory = "accuracy" | "delivery" | "quality" | "overall";

export interface Rating {
  orderId: string;
  categories: Record<RatingCategory, number>;
  comment?: string;
  date: string;
}

export interface Feedback {
  id: string;
  userId?: string;
  type: FeedbackType;
  message: string;
  anonymous: boolean;
  date: string;
}

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type ReviewStatus = 'published' | 'pending' | 'hidden' | 'reported';

export interface ReviewAuthor {
  id: string;
  name: string;
  avatar?: string | null;
  location?: string;
  isCurrentUser?: boolean;
}

export interface ReviewResponse {
  id: string;
  authorName: string;
  authorRole: string;
  comment: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  author: ReviewAuthor;
  rating: ReviewRating;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  verified: boolean;
  response?: ReviewResponse;
  status: ReviewStatus;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  percentages: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type ReviewSortOption =
  | 'relevant'
  | 'newest'
  | 'oldest'
  | 'highest-rated'
  | 'lowest-rated'
  | 'most-helpful';

export type ReviewFilterRating = 'all' | '5' | '4' | '3' | '2' | '1';

export type ReportReason =
  | 'Spam'
  | 'Inappropriate Content'
  | 'Misleading Information'
  | 'Offensive Language'
  | 'Other';

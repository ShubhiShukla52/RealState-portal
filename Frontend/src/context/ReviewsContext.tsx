import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Review,
  ReviewRating,
  RatingSummary,
  ReportReason,
} from '../types/review';
import { mockReviews } from '../data/mockReviews';
import { mockUser } from '../data/mockDashboard';
import {
  getPropertyReviews as filterPropertyReviews,
  getRatingSummary as computeRatingSummary,
  getUserReview as findUserReview,
} from '../utils/reviews';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const REVIEWS_STORAGE_KEY = 'estatex_reviews';
const VOTES_STORAGE_KEY = 'estatex_review_votes';
const REPORTS_STORAGE_KEY = 'estatex_review_reports';

interface ReviewReportRecord {
  reviewId: string;
  reason: ReportReason;
  note?: string;
  reportedAt: string;
}

export interface ReviewsContextType {
  reviews: Review[];
  userReviews: Review[];
  getPropertyReviews: (propertyId: string) => Review[];
  getPropertyRatingSummary: (propertyId: string) => RatingSummary;
  addReview: (propertyId: string, rating: ReviewRating, title: string, comment: string) => void;
  updateReview: (reviewId: string, rating: ReviewRating, title: string, comment: string) => void;
  deleteReview: (reviewId: string) => void;
  markHelpful: (reviewId: string) => boolean;
  hasVotedHelpful: (reviewId: string) => boolean;
  reportReview: (reviewId: string, reason: ReportReason, note?: string) => void;
  getUserReviewForProperty: (propertyId: string) => Review | undefined;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Safe fallback
    }
    return mockReviews;
  });

  // 2. Helpful votes set (IDs of reviews user has voted helpful)
  const [votedReviewIds, setVotedReviewIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(VOTES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Safe fallback
    }
    return ['rev-001'];
  });

  // 3. Reports record
  const [reports, setReports] = useState<ReviewReportRecord[]>(() => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Safe fallback
    }
    return [];
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Safe handle storage errors
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votedReviewIds));
    } catch {
      // Safe handle storage errors
    }
  }, [votedReviewIds]);

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // Safe handle storage errors
    }
  }, [reports]);

  // Methods
  const getPropertyReviews = useCallback(
    (propertyId: string) => {
      return filterPropertyReviews(reviews, propertyId, mockUser.id);
    },
    [reviews]
  );

  const getPropertyRatingSummary = useCallback(
    (propertyId: string) => {
      const propReviews = filterPropertyReviews(reviews, propertyId, mockUser.id);
      return computeRatingSummary(propReviews);
    },
    [reviews]
  );

  const getUserReviewForProperty = useCallback(
    (propertyId: string) => {
      return findUserReview(reviews, propertyId, mockUser.id);
    },
    [reviews]
  );

  const userReviews = useMemo(() => {
    return reviews.filter(
      (r) => r.author.id === mockUser.id || r.author.isCurrentUser
    );
  }, [reviews]);

  const addReview = useCallback(
    (propertyId: string, rating: ReviewRating, title: string, comment: string) => {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        propertyId,
        author: {
          id: mockUser.id,
          name: mockUser.fullName,
          location: mockUser.location,
          isCurrentUser: true,
        },
        rating,
        title: title.trim(),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        helpfulCount: 0,
        verified: true, // Demo users count as verified visitors
        status: 'pending', // Moderation flow per requirement 14
      };

      setReviews((prev) => [newReview, ...prev]);
      showToast('Your review has been submitted for moderation.', 'success');
    },
    [showToast]
  );

  const updateReview = useCallback(
    (reviewId: string, rating: ReviewRating, title: string, comment: string) => {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              rating,
              title: title.trim(),
              comment: comment.trim(),
              updatedAt: new Date().toISOString(),
            };
          }
          return r;
        })
      );
      showToast('Your review has been updated.', 'success');
    },
    [showToast]
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast('Your review has been removed.', 'info');
    },
    [showToast]
  );

  const hasVotedHelpful = useCallback(
    (reviewId: string) => {
      return votedReviewIds.includes(reviewId);
    },
    [votedReviewIds]
  );

  const markHelpful = useCallback(
    (reviewId: string) => {
      if (votedReviewIds.includes(reviewId)) {
        return false;
      }

      setVotedReviewIds((prev) => [...prev, reviewId]);
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id === reviewId) {
            return { ...r, helpfulCount: r.helpfulCount + 1 };
          }
          return r;
        })
      );

      showToast('Marked review as helpful.', 'success');
      return true;
    },
    [votedReviewIds, showToast]
  );

  const reportReview = useCallback(
    (reviewId: string, reason: ReportReason, note?: string) => {
      const record: ReviewReportRecord = {
        reviewId,
        reason,
        note,
        reportedAt: new Date().toISOString(),
      };

      setReports((prev) => [...prev, record]);
      // Mark review as reported locally
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: 'reported' } : r))
      );

      showToast('Review reported. Our moderation team has been notified.', 'info');
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      reviews,
      userReviews,
      getPropertyReviews,
      getPropertyRatingSummary,
      addReview,
      updateReview,
      deleteReview,
      markHelpful,
      hasVotedHelpful,
      reportReview,
      getUserReviewForProperty,
    }),
    [
      reviews,
      userReviews,
      getPropertyReviews,
      getPropertyRatingSummary,
      addReview,
      updateReview,
      deleteReview,
      markHelpful,
      hasVotedHelpful,
      reportReview,
      getUserReviewForProperty,
    ]
  );

  return (
    <ReviewsContext.Provider value={value}>
      {children}

      {/* Subtle Bottom Feedback Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#171717] text-white rounded-xl shadow-xl border border-white/10 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#C66A4A] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#A3A3A3] shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

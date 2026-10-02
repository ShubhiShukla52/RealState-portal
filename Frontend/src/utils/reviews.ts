import {
  Review,
  ReviewRating,
  RatingSummary,
  ReviewSortOption,
  ReviewFilterRating,
} from '../types/review';

/**
 * Filter reviews belonging to a specific property (only published and pending if owned by current user)
 */
export function getPropertyReviews(
  reviews: Review[],
  propertyId: string,
  currentUserId?: string
): Review[] {
  return reviews.filter(
    (r) =>
      r.propertyId === propertyId &&
      (r.status === 'published' || (r.status === 'pending' && r.author.id === currentUserId))
  );
}

/**
 * Calculate the average rating rounded to 1 decimal place
 */
export function getAverageRating(reviews: Review[]): number {
  const published = reviews.filter((r) => r.status === 'published');
  if (published.length === 0) return 0;

  const sum = published.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / published.length) * 10) / 10;
}

/**
 * Compute the count of each star rating (5, 4, 3, 2, 1)
 */
export function getRatingDistribution(reviews: Review[]): {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
} {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const published = reviews.filter((r) => r.status === 'published');

  published.forEach((r) => {
    if (r.rating in dist) {
      dist[r.rating as ReviewRating]++;
    }
  });

  return dist;
}

/**
 * Returns comprehensive rating metrics including distribution counts and percentages
 */
export function getRatingSummary(reviews: Review[]): RatingSummary {
  const published = reviews.filter((r) => r.status === 'published');
  const total = published.length;
  const distribution = getRatingDistribution(published);

  const percentages = {
    5: total > 0 ? Math.round((distribution[5] / total) * 100) : 0,
    4: total > 0 ? Math.round((distribution[4] / total) * 100) : 0,
    3: total > 0 ? Math.round((distribution[3] / total) * 100) : 0,
    2: total > 0 ? Math.round((distribution[2] / total) * 100) : 0,
    1: total > 0 ? Math.round((distribution[1] / total) * 100) : 0,
  };

  return {
    averageRating: getAverageRating(published),
    totalReviews: total,
    distribution,
    percentages,
  };
}

/**
 * Sort reviews according to chosen option
 */
export function sortReviews(reviews: Review[], option: ReviewSortOption): Review[] {
  const copy = [...reviews];

  switch (option) {
    case 'relevant':
      return copy.sort((a, b) => {
        // Current user review always top
        if (a.author.isCurrentUser && !b.author.isCurrentUser) return -1;
        if (!a.author.isCurrentUser && b.author.isCurrentUser) return 1;
        // Verified reviews have priority
        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        // Then by helpful count
        if (b.helpfulCount !== a.helpfulCount) return b.helpfulCount - a.helpfulCount;
        // Then newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    case 'newest':
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'oldest':
      return copy.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    case 'highest-rated':
      return copy.sort((a, b) => b.rating - a.rating);

    case 'lowest-rated':
      return copy.sort((a, b) => a.rating - b.rating);

    case 'most-helpful':
      return copy.sort((a, b) => b.helpfulCount - a.helpfulCount);

    default:
      return copy;
  }
}

/**
 * Filter reviews by star rating and optional search query
 */
export function filterReviews(
  reviews: Review[],
  ratingFilter: ReviewFilterRating,
  searchQuery: string = ''
): Review[] {
  let filtered = reviews;

  // Star rating filter
  if (ratingFilter !== 'all') {
    const targetRating = parseInt(ratingFilter, 10);
    filtered = filtered.filter((r) => r.rating === targetRating);
  }

  // Case-insensitive search across title, comment, author name
  const query = searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query) ||
        r.author.name.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Check if the user has already reviewed this property
 */
export function hasUserReviewed(
  reviews: Review[],
  propertyId: string,
  userId: string
): boolean {
  return reviews.some(
    (r) => r.propertyId === propertyId && (r.author.id === userId || r.author.isCurrentUser)
  );
}

/**
 * Retrieve user's existing review for a property
 */
export function getUserReview(
  reviews: Review[],
  propertyId: string,
  userId: string
): Review | undefined {
  return reviews.find(
    (r) => r.propertyId === propertyId && (r.author.id === userId || r.author.isCurrentUser)
  );
}

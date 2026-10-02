import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, MessageSquareX, X } from 'lucide-react';
import {
  Review,
  ReviewFilterRating,
  ReviewSortOption,
} from '../../types/review';
import { ReviewCard } from './ReviewCard';
import { sortReviews, filterReviews } from '../../utils/reviews';
import { Button } from '../ui/Button';

export interface ReviewListProps {
  reviews: Review[];
  activeRatingFilter: ReviewFilterRating;
  onRatingFilterChange: (rating: ReviewFilterRating) => void;
  onHelpfulClick?: (reviewId: string) => void;
  hasVotedHelpful?: (reviewId: string) => boolean;
  onReportClick?: (review: Review) => void;
  onEditClick?: (review: Review) => void;
  onDeleteClick?: (reviewId: string) => void;
  className?: string;
}

const PAGE_SIZE = 5;

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  activeRatingFilter,
  onRatingFilterChange,
  onHelpfulClick,
  hasVotedHelpful,
  onReportClick,
  onEditClick,
  onDeleteClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<ReviewSortOption>('relevant');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination count on search or filter change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setVisibleCount(PAGE_SIZE);
  };

  const handleFilterChange = (rating: ReviewFilterRating) => {
    onRatingFilterChange(rating);
    setVisibleCount(PAGE_SIZE);
  };

  // 1. Filter
  const filtered = useMemo(() => {
    return filterReviews(reviews, activeRatingFilter, searchQuery);
  }, [reviews, activeRatingFilter, searchQuery]);

  // 2. Sort
  const sorted = useMemo(() => {
    return sortReviews(filtered, sortBy);
  }, [filtered, sortBy]);

  // 3. Slice for Load More
  const visibleReviews = useMemo(() => {
    return sorted.slice(0, visibleCount);
  }, [sorted, visibleCount]);

  const hasMore = visibleCount < sorted.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const ratingPills: { label: string; value: ReviewFilterRating }[] = [
    { label: 'All', value: 'all' },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls Bar: Search, Filter Pills & Sort Dropdown */}
      <div className="bg-white rounded-2xl border border-[#E2E2DF] p-4 shadow-xs space-y-4">
        {/* Top: Search Input and Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search reviews by keyword, author, or amenity..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-xl text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#171717]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <label htmlFor="reviews-sort" className="text-xs text-[#737373] flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#A3A3A3]" />
              <span>Sort:</span>
            </label>
            <select
              id="reviews-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
              className="px-3 py-1.5 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="relevant">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="lowest-rated">Lowest Rated</option>
              <option value="most-helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Rating Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E2E2DF]">
          <span className="text-xs text-[#737373] font-medium mr-1.5 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#C66A4A]" />
            Rating:
          </span>
          {ratingPills.map((pill) => {
            const active = activeRatingFilter === pill.value;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => handleFilterChange(pill.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#171717] text-white shadow-2xs'
                    : 'bg-[#F5F5F2] text-[#737373] hover:text-[#171717] hover:bg-[#EAEAE7]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}

          {(activeRatingFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                onRatingFilterChange('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#C66A4A] hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Review Count Info */}
      <div className="flex items-center justify-between text-xs text-[#737373] px-1">
        <span>
          Showing {visibleReviews.length} of {sorted.length} {sorted.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* Empty State */}
      {visibleReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E2DF] p-10 text-center space-y-3">
          <MessageSquareX className="w-10 h-10 text-[#A3A3A3] mx-auto" />
          <h4 className="text-base font-bold text-[#171717]">
            No reviews match your search or filter
          </h4>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            Try adjusting your search query, selecting another star rating, or resetting your filter criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onRatingFilterChange('all');
              setSearchQuery('');
            }}
            className="mt-2 border-[#E2E2DF]"
          >
            Clear Search & Filters
          </Button>
        </div>
      ) : (
        /* Review Cards Grid / Stack */
        <div className="space-y-4">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpfulClick={onHelpfulClick}
              hasVotedHelpful={hasVotedHelpful ? hasVotedHelpful(review.id) : false}
              onReportClick={onReportClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadMore}
                icon={ChevronDown}
                className="border-[#E2E2DF] bg-white hover:bg-[#F5F5F2]"
              >
                Load More Reviews ({sorted.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

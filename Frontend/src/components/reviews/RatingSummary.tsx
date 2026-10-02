import React from 'react';
import { RatingSummary as RatingSummaryType, ReviewFilterRating } from '../../types/review';
import { StarRating } from './StarRating';

export interface RatingSummaryProps {
  summary: RatingSummaryType;
  activeFilter?: ReviewFilterRating;
  onFilterSelect?: (rating: ReviewFilterRating) => void;
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  summary,
  activeFilter,
  onFilterSelect,
  className = '',
}) => {
  const { averageRating, totalReviews, distribution, percentages } = summary;

  const tiers: (5 | 4 | 3 | 2 | 1)[] = [5, 4, 3, 2, 1];

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${className}`}
    >
      {/* Left: Big Score & Stars */}
      <div className="flex flex-col items-center justify-center text-center shrink-0 sm:pr-8 sm:border-r border-[#E2E2DF]">
        <div className="text-4xl sm:text-5xl font-black text-[#171717] tracking-tight">
          {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
        </div>
        <div className="mt-2">
          <StarRating value={averageRating} readonly size="md" />
        </div>
        <p className="text-xs text-[#737373] mt-2 font-medium">
          {totalReviews > 0
            ? `Based on ${totalReviews} verified ${totalReviews === 1 ? 'review' : 'reviews'}`
            : 'No reviews submitted yet'}
        </p>
      </div>

      {/* Right: Distribution Bars */}
      <div className="w-full flex-1 space-y-2">
        {tiers.map((star) => {
          const count = distribution[star];
          const pct = percentages[star];
          const isFilterActive = activeFilter === String(star);

          const content = (
            <div
              className={`group flex items-center gap-3 text-xs w-full py-0.5 rounded transition-colors ${
                onFilterSelect ? 'cursor-pointer hover:opacity-80' : ''
              } ${isFilterActive ? 'font-bold' : ''}`}
            >
              <div className="flex items-center gap-1 w-12 shrink-0 text-[#171717]">
                <span>{star}</span>
                <span className="text-[#C66A4A]">★</span>
              </div>

              {/* Progress bar background */}
              <div className="flex-1 h-2 bg-[#F5F5F2] rounded-full overflow-hidden border border-[#E2E2DF]/60">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isFilterActive ? 'bg-[#171717]' : 'bg-[#C66A4A]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Count and % */}
              <div className="w-14 text-right shrink-0 text-[#737373] group-hover:text-[#171717]">
                {count} ({pct}%)
              </div>
            </div>
          );

          if (onFilterSelect) {
            return (
              <button
                key={star}
                type="button"
                onClick={() =>
                  onFilterSelect(isFilterActive ? 'all' : (String(star) as ReviewFilterRating))
                }
                aria-label={`Filter by ${star} star reviews (${count} reviews)`}
                className="w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
              >
                {content}
              </button>
            );
          }

          return <div key={star}>{content}</div>;
        })}
      </div>
    </div>
  );
};

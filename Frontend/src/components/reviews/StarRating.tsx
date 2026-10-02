import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { ReviewRating } from '../../types/review';

export interface StarRatingProps {
  value: number; // 0 - 5
  onChange?: (rating: ReviewRating) => void;
  readonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const ratingToUse = hoverRating !== null ? hoverRating : Math.round(value);

  const handleKeyDown = (e: React.KeyboardEvent, starValue: ReviewRating) => {
    if (readonly || !onChange) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(starValue);
    } else if (e.key === 'ArrowRight' && starValue < 5) {
      e.preventDefault();
      onChange(Math.min(5, starValue + 1) as ReviewRating);
    } else if (e.key === 'ArrowLeft' && starValue > 1) {
      e.preventDefault();
      onChange(Math.max(1, starValue - 1) as ReviewRating);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        role={readonly ? 'img' : 'radiogroup'}
        aria-label={readonly ? `${value} out of 5 stars` : 'Rate this property'}
        className="flex items-center gap-0.5"
      >
        {([1, 2, 3, 4, 5] as ReviewRating[]).map((star) => {
          const filled = star <= ratingToUse;

          if (readonly) {
            return (
              <span key={star} className="inline-flex">
                <Star
                  className={`${starSizes} transition-colors ${
                    filled
                      ? 'fill-[#C66A4A] text-[#C66A4A]'
                      : 'fill-transparent text-[#D4D4D0]'
                  }`}
                  aria-hidden="true"
                />
              </span>
            );
          }

          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              tabIndex={0}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              className="p-0.5 rounded transition-transform hover:scale-115 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
            >
              <Star
                className={`${starSizes} transition-colors ${
                  filled
                    ? 'fill-[#C66A4A] text-[#C66A4A]'
                    : 'fill-transparent text-[#D4D4D0]'
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold text-[#171717]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

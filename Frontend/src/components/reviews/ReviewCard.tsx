import React from 'react';
import { ThumbsUp, ShieldCheck, Flag, MessageSquareQuote, Edit, Trash2 } from 'lucide-react';
import { Review } from '../../types/review';
import { StarRating } from './StarRating';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { formatRelativeTime } from '../../utils/date';

export interface ReviewCardProps {
  review: Review;
  onHelpfulClick?: (reviewId: string) => void;
  hasVotedHelpful?: boolean;
  onReportClick?: (review: Review) => void;
  onEditClick?: (review: Review) => void;
  onDeleteClick?: (reviewId: string) => void;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpfulClick,
  hasVotedHelpful = false,
  onReportClick,
  onEditClick,
  onDeleteClick,
  className = '',
}) => {
  const { author, rating, title, comment, createdAt, helpfulCount, verified, response, status } =
    review;

  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDate = formatRelativeTime(createdAt);

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-xs transition-all hover:border-[#A3A3A3] flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Row: Author, Verified badge, Date & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar / Initials */}
            <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#171717] truncate">
                  {author.name}
                </span>

                {author.isCurrentUser && (
                  <span className="text-[10px] font-bold bg-[#F8EBE6] text-[#C66A4A] border border-[#C66A4A]/20 px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}

                {verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Verified Visit</span>
                  </span>
                )}
              </div>

              {author.location && (
                <p className="text-[11px] text-[#737373] truncate">
                  {author.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs text-[#A3A3A3] whitespace-nowrap">
              {formattedDate}
            </span>
            {author.isCurrentUser && <ReviewStatusBadge status={status} />}
          </div>
        </div>

        {/* Rating & Review Title */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1.5">
            <StarRating value={rating} readonly size="sm" />
            <span className="text-xs font-bold text-[#171717]">{rating}.0</span>
          </div>
          <h3 className="font-bold text-base text-[#171717] leading-snug">
            {title}
          </h3>
        </div>

        {/* Comment Body */}
        <p className="text-xs sm:text-sm text-[#222222] leading-relaxed whitespace-pre-line mb-4">
          {comment}
        </p>

        {/* Owner Response Sub-Card */}
        {response && (
          <div className="mt-3 mb-4 bg-[#F5F5F2] rounded-xl p-4 border-l-4 border-[#C66A4A] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#171717] flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5 text-[#C66A4A]" />
                Response from {response.authorName} ({response.authorRole})
              </span>
              <span className="text-[11px] text-[#A3A3A3]">
                {formatRelativeTime(response.createdAt)}
              </span>
            </div>
            <p className="text-xs text-[#222222] leading-relaxed">
              {response.comment}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Helpful, Report, and Author Actions */}
      <div className="pt-3 border-t border-[#E2E2DF] flex items-center justify-between gap-3 text-xs">
        {/* Helpful Vote Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onHelpfulClick?.(review.id)}
            disabled={hasVotedHelpful}
            aria-label={hasVotedHelpful ? 'You marked this review as helpful' : 'Mark as helpful'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] ${
              hasVotedHelpful
                ? 'bg-[#171717] text-white border-[#171717] cursor-default'
                : 'bg-white hover:bg-[#F5F5F2] text-[#737373] hover:text-[#171717] border-[#E2E2DF]'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasVotedHelpful ? 'fill-white' : ''}`} />
            <span>Helpful ({helpfulCount})</span>
          </button>

          {/* Report Button (only if not current user's review) */}
          {!author.isCurrentUser && onReportClick && (
            <button
              type="button"
              onClick={() => onReportClick(review)}
              aria-label="Report this review"
              className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#DC2626] hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DC2626]"
              title="Report review"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Current user edit / delete buttons */}
        {author.isCurrentUser && (
          <div className="flex items-center gap-2">
            {onEditClick && (
              <button
                type="button"
                onClick={() => onEditClick(review)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#737373] hover:text-[#171717] p-1 rounded hover:bg-[#F5F5F2] transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

            {onDeleteClick && (
              <button
                type="button"
                onClick={() => onDeleteClick(review.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#737373] hover:text-[#DC2626] p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

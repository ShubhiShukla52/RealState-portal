import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { MessageSquare, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';
import { mockProperties } from '../../data/mockProperties';
import { EmptyState } from '../../components/common/EmptyState';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/reviews/StarRating';
import { ReviewStatusBadge } from '../../components/reviews/ReviewStatusBadge';
import { WriteReviewModal } from '../../components/reviews/WriteReviewModal';
import { ROUTES } from '../../constants/routes';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';
import { formatRelativeTime } from '../../utils/date';
import { Review } from '../../types/review';

export const ReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const { userReviews, updateReview, deleteReview } = useReviews();

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      deleteReview(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Reviews"
        subtitle="Feedback and ratings you've contributed across EstateX residences."
        onOpenMobileMenu={openMobileSidebar}
        action={
          userReviews.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8EBE6] text-[#C66A4A] border border-[#C66A4A]/20">
              {userReviews.length} {userReviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          )
        }
      />

      {userReviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="You haven't written any reviews yet"
          description="Share your experience with properties you've visited to help other home seekers."
          actionLabel="Explore Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
          className="py-16 bg-white border-[#E2E2DF]"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {userReviews.map((review) => {
              const property = mockProperties.find((p) => p.id === review.propertyId);

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-xs hover:border-[#A3A3A3] transition-all flex flex-col md:flex-row md:items-start justify-between gap-5"
                >
                  {/* Left: Property Preview & Review Content */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 min-w-0">
                    {/* Property Thumbnail */}
                    {property && (
                      <Link
                        to={ROUTES.PROPERTY_DETAILS(property.id)}
                        className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-[#171717] shrink-0 border border-[#E2E2DF] group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
                      >
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </Link>
                    )}

                    <div className="min-w-0 flex-1 space-y-1.5">
                      {/* Property Title & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {property ? (
                          <Link
                            to={ROUTES.PROPERTY_DETAILS(property.id)}
                            className="font-bold text-sm text-[#171717] hover:text-[#C66A4A] transition-colors truncate max-w-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
                          >
                            {property.title}
                          </Link>
                        ) : (
                          <span className="font-bold text-sm text-[#171717]">
                            Property #{review.propertyId}
                          </span>
                        )}

                        <ReviewStatusBadge status={review.status} />
                      </div>

                      {/* Stars, Score & Date */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <StarRating value={review.rating} readonly size="sm" />
                        <span className="text-xs font-bold text-[#171717]">
                          {review.rating}.0
                        </span>
                        <span className="text-xs text-[#A3A3A3]">•</span>
                        <span className="text-xs text-[#737373]">
                          {formatRelativeTime(review.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-[#171717] pt-1">
                        {review.title}
                      </h4>

                      {/* Comment preview */}
                      <p className="text-xs sm:text-sm text-[#737373] leading-relaxed line-clamp-3">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions Bar */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E2DF] shrink-0">
                    {property && (
                      <Link to={ROUTES.PROPERTY_DETAILS(property.id)}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={ExternalLink}
                          className="text-xs border-[#E2E2DF] w-full"
                        >
                          View Property
                        </Button>
                      </Link>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Edit}
                        onClick={() => setEditingReview(review)}
                        className="text-xs"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteId(review.id)}
                        className="text-xs text-[#DC2626] border-[#E2E2DF] hover:bg-red-50 hover:border-red-200"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <WriteReviewModal
          isOpen={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          propertyTitle={
            mockProperties.find((p) => p.id === editingReview.propertyId)?.title ||
            'Property'
          }
          initialReview={editingReview}
          onSubmitReview={(rating, title, comment) => {
            updateReview(editingReview.id, rating, title, comment);
            setEditingReview(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteId(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150"
          >
            <h3 id="delete-dialog-title" className="text-base font-bold text-[#171717] mb-2">
              Remove Your Review?
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] mb-5">
              This review and rating will be permanently deleted from the property page.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(null)}
                className="border-[#E2E2DF]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmDelete}
                className="bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Building2, SearchX, Star, MessageSquarePlus, Edit3 } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { EmptyState } from '../../components/common/EmptyState';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/ui/Button';
import { mockProperties } from '../../data/mockProperties';
import { ROUTES } from '../../constants/routes';

import { PropertyGallery } from './components/PropertyGallery';
import { PropertyHeader } from './components/PropertyHeader';
import { PropertyOverview } from './components/PropertyOverview';
import { PropertyDescription } from './components/PropertyDescription';
import { PropertyAmenities } from './components/PropertyAmenities';
import { PropertyLocation } from './components/PropertyLocation';
import { PropertyDetails } from './components/PropertyDetails';
import { PropertyOwnerCard } from './components/PropertyOwnerCard';
import { ContactOwnerForm } from './components/ContactOwnerForm';
import { SimilarProperties } from './components/SimilarProperties';
import { RequestVisitModal } from './components/RequestVisitModal';
import { PropertyInquiryModal } from './components/PropertyInquiryModal';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useReviews } from '../../context/ReviewsContext';
import {
  RatingSummary,
  ReviewList,
  TrustSignals,
  WriteReviewModal,
  ReportReviewModal,
} from '../../components/reviews';
import { Review, ReviewFilterRating } from '../../types/review';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trackView } = useRecentlyViewed();
  const {
    getPropertyReviews,
    getPropertyRatingSummary,
    addReview,
    updateReview,
    deleteReview,
    markHelpful,
    hasVotedHelpful,
    reportReview,
    getUserReviewForProperty,
  } = useReviews();

  const [activeRatingFilter, setActiveRatingFilter] = useState<ReviewFilterRating>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState<Review | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  // Scroll to top whenever ID changes and track view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id) {
      trackView(id);
    }
  }, [id, trackView]);

  // Find property from mock dataset
  const property = mockProperties.find((p) => p.id === id);

  // Property Not Found Empty State
  if (!property) {
    return (
      <div className="py-16 sm:py-24 bg-[#F5F5F2] min-h-[70vh] flex items-center">
        <Container size="md">
          <EmptyState
            icon={SearchX}
            title="Property Not Found"
            description="The property you're looking for may no longer be available or the link may have expired."
            actionLabel="Browse Properties"
            onAction={() => navigate(ROUTES.PROPERTIES)}
            className="shadow-xs border-[#E2E2DF]"
          />
        </Container>
      </div>
    );
  }

  const propertyReviews = getPropertyReviews(property.id);
  const ratingSummary = getPropertyRatingSummary(property.id);
  const userReview = getUserReviewForProperty(property.id);

  const handleScrollToContact = () => {
    const el = document.getElementById('contact-owner-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const confirmDelete = () => {
    if (deleteReviewId) {
      deleteReview(deleteReviewId);
      setDeleteReviewId(null);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F5F5F2] min-h-screen">
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#737373] mb-6 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none"
        >
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1 hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
          >
            <Home className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>Home</span>
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3] shrink-0" />

          <Link
            to={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-1 hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
          >
            <Building2 className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>Properties</span>
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3] shrink-0" />

          <span
            className="text-[#171717] font-semibold truncate max-w-[200px] sm:max-w-md"
            title={property.title}
          >
            {property.title}
          </span>
        </nav>

        {/* Main Grid: Left Details (2/3 on desktop) + Right Contact Sidebar (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Header info */}
            <PropertyHeader property={property} />

            {/* Quick Specs Overview */}
            <PropertyOverview property={property} />

            {/* Detailed Description */}
            <PropertyDescription description={property.description} />

            {/* Amenities Grid */}
            <PropertyAmenities property={property} />

            {/* Additional Technical Specifications */}
            <PropertyDetails property={property} />

            {/* Location & Map Placeholder */}
            <PropertyLocation property={property} />

            {/* Trust & Verification Signals */}
            <TrustSignals property={property} reviewCount={propertyReviews.length} />

            {/* Reviews Section */}
            <section id="reviews-section" className="pt-8 border-t border-[#E2E2DF] space-y-6 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <SectionHeading
                  badge="Community Feedback"
                  title="Reviews & Ratings"
                  subtitle="Verified impressions and feedback from confirmed physical visitors."
                  className="mb-0 text-left"
                />

                <Button
                  variant={userReview ? 'outline' : 'primary'}
                  size="sm"
                  icon={userReview ? Edit3 : MessageSquarePlus}
                  onClick={() => setIsWriteModalOpen(true)}
                  className="shrink-0 self-start sm:self-auto"
                >
                  {userReview ? 'Edit Your Review' : 'Write a Review'}
                </Button>
              </div>

              {propertyReviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2E2DF] p-10 text-center space-y-3">
                  <Star className="w-10 h-10 text-[#C66A4A] mx-auto fill-[#C66A4A]/20" />
                  <h4 className="text-base font-bold text-[#171717]">No reviews yet</h4>
                  <p className="text-xs text-[#737373] max-w-sm mx-auto">
                    Be the first to share your experience with this property.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={MessageSquarePlus}
                    onClick={() => setIsWriteModalOpen(true)}
                  >
                    Write a Review
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Rating Summary Bar */}
                  <RatingSummary
                    summary={ratingSummary}
                    activeFilter={activeRatingFilter}
                    onFilterSelect={setActiveRatingFilter}
                  />

                  {/* Review List with Filters and Sorting */}
                  <ReviewList
                    reviews={propertyReviews}
                    activeRatingFilter={activeRatingFilter}
                    onRatingFilterChange={setActiveRatingFilter}
                    onHelpfulClick={markHelpful}
                    hasVotedHelpful={hasVotedHelpful}
                    onReportClick={(rev) => setReportingReview(rev)}
                    onEditClick={() => setIsWriteModalOpen(true)}
                    onDeleteClick={(revId) => setDeleteReviewId(revId)}
                  />
                </div>
              )}
            </section>
          </div>

          {/* Sticky Sidebar: Owner Profile & Contact Form */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Owner Info Card */}
            <PropertyOwnerCard
              owner={property.owner}
              onContactClick={handleScrollToContact}
              onRequestVisitClick={() => setIsVisitModalOpen(true)}
            />

            {/* Contact Inquiry Form */}
            <ContactOwnerForm property={property} />
          </div>
        </div>

        {/* Similar Properties Section */}
        <SimilarProperties currentProperty={property} />
      </Container>

      {/* Write / Edit Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        propertyTitle={property.title}
        initialReview={userReview}
        onSubmitReview={(rating, title, comment) => {
          if (userReview) {
            updateReview(userReview.id, rating, title, comment);
          } else {
            addReview(property.id, rating, title, comment);
          }
        }}
      />

      {/* Report Review Modal */}
      <ReportReviewModal
        isOpen={Boolean(reportingReview)}
        onClose={() => setReportingReview(null)}
        reviewTitle={reportingReview?.title || ''}
        onReport={(reason, note) => {
          if (reportingReview) {
            reportReview(reportingReview.id, reason, note);
          }
        }}
      />

      {/* Delete Review Confirmation Dialog */}
      {deleteReviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteReviewId(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
            className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150"
          >
            <h3 id="delete-review-title" className="text-base font-bold text-[#171717] mb-2">
              Remove Your Review?
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] mb-5">
              Your feedback and ratings for this property will be deleted.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteReviewId(null)}
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

      {/* Request Visit Modal (Step 14) */}
      <RequestVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        property={property}
      />

      {/* Property Inquiry Modal (Step 14) */}
      <PropertyInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        property={property}
      />
    </div>
  );
};

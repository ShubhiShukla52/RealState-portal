import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Home,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  XCircle,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { InquiryStatusBadge } from '../../components/common/InquiryStatusBadge';
import { InquiryTimeline } from '../../components/common/InquiryTimeline';
import { useInquiries } from '../../context/InquiryContext';
import { getInquiryTypeLabel } from '../../utils/inquiries';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/date';

export const InquiryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInquiryById, cancelInquiry } = useInquiries();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState(false);

  const inquiry = id ? getInquiryById(id) : undefined;

  if (!inquiry) {
    return (
      <div className="py-16 sm:py-24 bg-[#F5F5F2] min-h-[70vh] flex items-center">
        <Container size="md">
          <EmptyState
            icon={MessageSquare}
            title="Inquiry not found"
            description="The inquiry request you are looking for may have been removed or the ID is invalid."
            actionLabel="View All Inquiries"
            onAction={() => navigate('/inquiries')}
            className="shadow-xs border-[#E2E2DF] bg-white rounded-2xl p-10 text-center"
          />
        </Container>
      </div>
    );
  }

  const isVisit = inquiry.type === 'visit';
  const canCancel =
    inquiry.status === 'pending' || inquiry.status === 'visit_requested';

  const handleConfirmCancel = () => {
    cancelInquiry(inquiry.id);
    setIsCancelModalOpen(false);
    setCancelSuccessMsg(true);
    setTimeout(() => {
      setCancelSuccessMsg(false);
    }, 4000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCancelModalOpen) {
        setIsCancelModalOpen(false);
      }
    };
    if (isCancelModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCancelModalOpen]);

  return (
    <div className="py-6 sm:py-10 bg-[#F5F5F2] min-h-screen">
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#737373] mb-6 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-[#171717] transition-colors rounded"
          >
            <Home className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>Home</span>
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3] shrink-0" />

          <Link
            to="/inquiries"
            className="inline-flex items-center gap-1 hover:text-[#171717] transition-colors rounded"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>My Inquiries</span>
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3] shrink-0" />

          <span className="text-[#171717] font-semibold truncate max-w-[200px] sm:max-w-md">
            {inquiry.id}
          </span>
        </nav>

        {/* Cancellation Notice Alert */}
        {cancelSuccessMsg && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">
                Inquiry request was successfully cancelled.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCancelSuccessMsg(false)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header Summary Row */}
        <div className="bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <InquiryStatusBadge status={inquiry.status} size="md" />
              <span className="text-xs font-semibold text-[#737373] bg-[#F5F5F2] px-2.5 py-0.5 rounded-full border border-[#E2E2DF]">
                {getInquiryTypeLabel(inquiry.type)}
              </span>
              <span className="text-xs text-[#A3A3A3]">
                Ref: {inquiry.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              {inquiry.propertyTitle}
            </h1>
            <p className="text-xs text-[#737373]">
              Submitted on {formatDate(inquiry.createdAt)} • Last updated {formatDate(inquiry.updatedAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to={`/properties/${inquiry.propertyId}`}>
              <Button variant="outline" size="sm" icon={ExternalLink}>
                View Property
              </Button>
            </Link>

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                icon={XCircle}
                onClick={() => setIsCancelModalOpen(true)}
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Cancel Request
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Grid: 2/3 Details + 1/3 Property/Owner sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Visit Details Box if applicable */}
            {isVisit && (
              <section className="bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#C66A4A]">
                  <Calendar className="w-5 h-5" />
                  <h2 className="text-base font-bold text-[#171717]">
                    Visit Request Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#F5F5F2] p-4 rounded-xl border border-[#E2E2DF] space-y-1">
                    <span className="text-xs text-[#737373] block">Preferred Date</span>
                    <span className="text-base font-bold text-[#171717] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#C66A4A]" />
                      {inquiry.preferredDate || 'Not specified'}
                    </span>
                  </div>

                  <div className="bg-[#F5F5F2] p-4 rounded-xl border border-[#E2E2DF] space-y-1">
                    <span className="text-xs text-[#737373] block">Preferred Time Slot</span>
                    <span className="text-base font-bold text-[#171717] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#171717]" />
                      {inquiry.preferredTime || 'Anytime'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#737373] bg-[#F8EBE6] p-3 rounded-xl border border-[#C66A4A]/20">
                  {inquiry.status === 'visit_confirmed'
                    ? 'Your appointment has been confirmed by the owner. Please arrive 10 minutes prior at the property entrance.'
                    : inquiry.status === 'cancelled'
                    ? 'This visit request was cancelled. You can request another visit anytime from the property page.'
                    : 'Your requested time is awaiting owner confirmation. You will receive an update once reviewed.'}
                </p>
              </section>
            )}

            {/* Original Submitted Message */}
            <section className="bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
                Your Inquiry Message
              </h2>
              <div className="p-4 rounded-xl bg-[#F5F5F2] border border-[#E2E2DF] text-sm text-[#222222] leading-relaxed">
                "{inquiry.message}"
              </div>

              {/* Submitter details */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#737373]">
                <span>Contact Name: <strong className="text-[#171717]">{inquiry.userName}</strong></span>
                <span>Email: <strong className="text-[#171717]">{inquiry.userEmail}</strong></span>
                {inquiry.userPhone && (
                  <span>Phone: <strong className="text-[#171717]">{inquiry.userPhone}</strong></span>
                )}
              </div>
            </section>

            {/* Owner Response Box */}
            <section className="bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
                  Owner Response
                </h2>
                {inquiry.ownerName && (
                  <span className="text-xs font-semibold text-[#171717]">
                    Listing Owner: {inquiry.ownerName}
                  </span>
                )}
              </div>

              {inquiry.ownerResponse ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-sm text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Response from {inquiry.ownerName || 'Property Representative'}</span>
                    {inquiry.ownerResponseAt && (
                      <span className="text-emerald-700 font-normal">
                        • {formatDate(inquiry.ownerResponseAt)}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed italic">
                    "{inquiry.ownerResponse}"
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F5F5F2] border border-[#E2E2DF] text-xs text-[#737373] text-center py-6 space-y-1">
                  <Clock className="w-5 h-5 mx-auto text-[#A3A3A3] mb-1" />
                  <p className="font-semibold text-[#171717]">Awaiting Response</p>
                  <p>The owner has not responded to this inquiry yet. Usually responds within 2-4 hours.</p>
                </div>
              )}
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-xs">
              <InquiryTimeline inquiry={inquiry} />
            </section>
          </div>

          {/* Right Sidebar: Property Overview & Actions */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Property Summary Card */}
            <div className="bg-white rounded-2xl border border-[#E2E2DF] overflow-hidden shadow-xs">
              {inquiry.propertyImage && (
                <div className="relative h-44 bg-[#F5F5F2]">
                  <img
                    src={inquiry.propertyImage}
                    alt={inquiry.propertyTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#171717]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {inquiry.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-[#171717] line-clamp-2">
                  {inquiry.propertyTitle}
                </h3>

                {inquiry.propertyLocation && (
                  <p className="text-xs text-[#737373] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C66A4A] shrink-0" />
                    <span>{inquiry.propertyLocation}</span>
                  </p>
                )}

                {inquiry.propertyPrice && (
                  <p className="text-xl font-black text-[#171717] pt-1">
                    {formatPrice(inquiry.propertyPrice, inquiry.listingType || 'sale')}
                  </p>
                )}

                <div className="pt-2 border-t border-[#E2E2DF] flex flex-col gap-2">
                  <Link to={`/properties/${inquiry.propertyId}`}>
                    <Button variant="primary" size="sm" icon={ExternalLink} className="w-full justify-center">
                      View Property Details
                    </Button>
                  </Link>

                  <Link to={`/dashboard/messages`}>
                    <Button variant="outline" size="sm" icon={MessageSquare} className="w-full justify-center">
                      Open in Messages
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Help Box */}
            <div className="bg-[#F5F5F2] rounded-2xl border border-[#E2E2DF] p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Need Assistance?
              </h4>
              <p className="text-xs text-[#737373] leading-relaxed">
                If you have questions about your request or need to reschedule, you can chat with the owner in your Messages tab or cancel and submit a new slot.
              </p>
              <Link to="/inquiries" className="inline-block text-xs font-bold text-[#C66A4A] hover:underline">
                ← Back to All Inquiries
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Cancel Confirmation Modal (Requirement 13) */}
      {isCancelModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E2E2DF] p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 id="cancel-modal-title" className="text-lg font-bold text-[#171717]">
                Cancel Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#737373]">
                Are you sure you want to cancel this request? This action cannot be undone, though the inquiry will remain in your archive.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 justify-center"
              >
                Keep Request
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirmCancel}
                className="flex-1 justify-center bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
              >
                Cancel Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

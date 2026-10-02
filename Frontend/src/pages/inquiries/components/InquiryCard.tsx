import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  UserCheck,
} from 'lucide-react';
import { PropertyInquiry } from '../../../types/inquiry';
import { InquiryStatusBadge } from '../../../components/common/InquiryStatusBadge';
import { getInquiryTypeLabel } from '../../../utils/inquiries';
import { formatDate } from '../../../utils/date';
import { Button } from '../../../components/ui/Button';

export interface InquiryCardProps {
  inquiry: PropertyInquiry;
}

export const InquiryCard: React.FC<InquiryCardProps> = ({ inquiry }) => {
  const isVisit = inquiry.type === 'visit';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-xs hover:border-[#171717]/20 transition-all flex flex-col md:flex-row gap-5 items-start justify-between">
      {/* Left Column: Image + Info */}
      <div className="flex flex-col sm:flex-row items-start gap-4 min-w-0 flex-1 w-full">
        {/* Property Image */}
        {inquiry.propertyImage && (
          <Link
            to={`/properties/${inquiry.propertyId}`}
            className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden bg-[#F5F5F2] shrink-0 border border-[#E2E2DF] group block"
          >
            <img
              src={inquiry.propertyImage}
              alt={inquiry.propertyTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-2 w-full">
          {/* Top badges: Status & Type */}
          <div className="flex flex-wrap items-center gap-2">
            <InquiryStatusBadge status={inquiry.status} size="sm" />
            <span className="text-[11px] font-semibold text-[#737373] bg-[#F5F5F2] px-2.5 py-0.5 rounded-full border border-[#E2E2DF]">
              {getInquiryTypeLabel(inquiry.type)}
            </span>
            <span className="text-[11px] text-[#A3A3A3]">
              ID: {inquiry.id}
            </span>
          </div>

          {/* Property Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight hover:text-[#C66A4A] transition-colors truncate">
            <Link to={`/inquiries/${inquiry.id}`}>{inquiry.propertyTitle}</Link>
          </h3>

          {/* Location */}
          {inquiry.propertyLocation && (
            <p className="text-xs text-[#737373] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C66A4A] shrink-0" />
              <span>{inquiry.propertyLocation}</span>
            </p>
          )}

          {/* Visit info if applicable */}
          {isVisit && inquiry.preferredDate && (
            <div className="inline-flex flex-wrap items-center gap-2 bg-[#F8EBE6] text-[#C66A4A] text-xs font-semibold px-3 py-1 rounded-lg border border-[#C66A4A]/20">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Visit: {inquiry.preferredDate}</span>
              </span>
              {inquiry.preferredTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{inquiry.preferredTime}</span>
                </span>
              )}
            </div>
          )}

          {/* Owner Response preview */}
          {inquiry.ownerResponse && (
            <div className="bg-[#F5F5F2] rounded-xl p-3 border border-[#E2E2DF] text-xs text-[#222222] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Owner Response ({inquiry.ownerName || 'Owner'}):</span>
              </div>
              <p className="italic text-[#737373] line-clamp-2">
                "{inquiry.ownerResponse}"
              </p>
            </div>
          )}

          {/* Submitted Date */}
          <div className="text-[11px] text-[#A3A3A3] pt-1">
            Submitted on {formatDate(inquiry.createdAt)}
          </div>
        </div>
      </div>

      {/* Right Column: Actions */}
      <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E2DF]">
        <Link to={`/inquiries/${inquiry.id}`} className="w-full md:w-auto">
          <Button variant="primary" size="sm" icon={Eye} className="w-full justify-center">
            View Details
          </Button>
        </Link>
        <Link to={`/properties/${inquiry.propertyId}`} className="w-full md:w-auto">
          <Button variant="outline" size="sm" className="w-full justify-center">
            View Property
          </Button>
        </Link>
      </div>
    </div>
  );
};

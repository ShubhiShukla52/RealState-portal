import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Eye } from 'lucide-react';
import { PropertyInquiry } from '../../types/inquiry';
import { useInquiries } from '../../context/InquiryContext';
import { getUpcomingVisits } from '../../utils/inquiries';
import { InquiryStatusBadge } from '../common/InquiryStatusBadge';
import { Button } from '../ui/Button';

export interface UpcomingVisitsProps {
  visits?: PropertyInquiry[];
  limit?: number;
  className?: string;
  showExploreLink?: boolean;
}

export const UpcomingVisits: React.FC<UpcomingVisitsProps> = ({
  visits: propVisits,
  limit,
  className = '',
  showExploreLink = true,
}) => {
  const { inquiries } = useInquiries();
  const allVisits = propVisits || getUpcomingVisits(inquiries);
  const displayVisits = limit ? allVisits.slice(0, limit) : allVisits;

  if (displayVisits.length === 0) {
    return (
      <div className={`bg-white rounded-2xl border border-[#E2E2DF] p-6 text-center space-y-3 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-[#F5F5F2] flex items-center justify-center mx-auto text-[#737373]">
          <Calendar className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-[#171717]">No Upcoming Visits</h4>
        <p className="text-xs text-[#737373] max-w-sm mx-auto">
          You haven't requested any property walkthroughs yet. Find a property you like and book a visit slot.
        </p>
        {showExploreLink && (
          <Link to="/properties" className="inline-block pt-1">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Explore Properties
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayVisits.map((visit) => (
        <div
          key={visit.id}
          className="bg-white rounded-2xl border border-[#E2E2DF] p-4 sm:p-5 shadow-xs hover:border-[#171717]/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Property Image & Details */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            {visit.propertyImage && (
              <img
                src={visit.propertyImage}
                alt={visit.propertyTitle}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-[#F5F5F2] border border-[#E2E2DF]"
              />
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <InquiryStatusBadge status={visit.status} size="sm" />
                {visit.ownerName && (
                  <span className="text-[11px] text-[#737373]">
                    with {visit.ownerName}
                  </span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-bold text-[#171717] truncate" title={visit.propertyTitle}>
                {visit.propertyTitle}
              </h4>

              {visit.propertyLocation && (
                <p className="text-xs text-[#737373] flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#C66A4A] shrink-0" />
                  <span>{visit.propertyLocation}</span>
                </p>
              )}

              {/* Date & Time pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#171717] pt-1">
                <span className="inline-flex items-center gap-1 bg-[#F5F5F2] px-2.5 py-0.5 rounded-md border border-[#E2E2DF]">
                  <Calendar className="w-3.5 h-3.5 text-[#C66A4A]" />
                  <span>{visit.preferredDate}</span>
                </span>
                {visit.preferredTime && (
                  <span className="inline-flex items-center gap-1 bg-[#F5F5F2] px-2.5 py-0.5 rounded-md border border-[#E2E2DF]">
                    <Clock className="w-3.5 h-3.5 text-[#A3A3A3]" />
                    <span>{visit.preferredTime}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2E2DF]">
            <Link to={`/inquiries/${visit.id}`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" icon={Eye} className="w-full justify-center">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

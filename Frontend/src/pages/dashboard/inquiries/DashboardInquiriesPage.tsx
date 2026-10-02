import React, { useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  MessageSquare,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { DashboardOutletContext } from '../../../layouts/DashboardLayout';
import { DashboardHeader } from '../../../components/dashboard/DashboardHeader';
import { StatCard } from '../../../components/dashboard/StatCard';
import { UpcomingVisits } from '../../../components/property/UpcomingVisits';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button } from '../../../components/ui/Button';
import { useInquiries } from '../../../context/InquiryContext';
import { getInquiryCounts, getUpcomingVisits } from '../../../utils/inquiries';
import { InquiryStatusBadge } from '../../../components/common/InquiryStatusBadge';
import { formatDate } from '../../../utils/date';

export const DashboardInquiriesPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const { inquiries } = useInquiries();

  const counts = useMemo(() => getInquiryCounts(inquiries), [inquiries]);
  const upcomingVisits = useMemo(() => getUpcomingVisits(inquiries), [inquiries]);
  const recentInquiries = useMemo(
    () =>
      [...inquiries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [inquiries]
  );

  const stats = [
    {
      title: 'Total Inquiries',
      value: counts.total,
      icon: MessageSquare,
      description: 'All questions & requests',
    },
    {
      title: 'Pending',
      value: counts.pending,
      icon: Clock,
      trend: counts.pending > 0 ? 'Awaiting response' : 'None pending',
      description: 'Awaiting owner response',
    },
    {
      title: 'Visit Requests',
      value: counts.visitRequests,
      icon: Calendar,
      description: 'Requested site visits',
    },
    {
      title: 'Confirmed Visits',
      value: counts.confirmedVisits,
      icon: CheckCircle2,
      trend: 'Ready to visit',
      description: 'Owner approved dates',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Property Inquiries"
        subtitle="Track and manage questions, price discussions, and site visits."
        onOpenMobileMenu={openMobileSidebar}
        action={
          <Link to="/inquiries">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              View All Inquiries
            </Button>
          </Link>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
          />
        ))}
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E2DF] p-10 text-center">
          <EmptyState
            icon={MessageSquare}
            title="You haven't contacted any properties yet."
            description="Browse our curated collection of verified homes and villas to schedule site visits or ask questions."
            actionLabel="Explore Properties"
            onAction={() => (window.location.href = '/properties')}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Visits Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#171717]">
                  Upcoming Visits
                </h2>
                <p className="text-xs text-[#737373]">
                  Scheduled walkthroughs and pending inspection slots.
                </p>
              </div>

              <Link to="/inquiries?status=visit_requested" className="text-xs font-semibold text-[#C66A4A] hover:underline flex items-center gap-1">
                <span>View visit requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <UpcomingVisits visits={upcomingVisits} />
          </section>

          {/* Recent Inquiries List */}
          <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E2DF] pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#171717]">
                  Recent Inquiries
                </h2>
                <p className="text-xs text-[#737373]">
                  Your latest 5 questions, price inquiries, and site requests.
                </p>
              </div>

              <Link to="/inquiries">
                <Button variant="outline" size="sm" icon={ArrowRight}>
                  View All ({inquiries.length})
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-[#E2E2DF]">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {inq.propertyImage && (
                      <img
                        src={inq.propertyImage}
                        alt={inq.propertyTitle}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#F5F5F2] border border-[#E2E2DF]"
                      />
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <InquiryStatusBadge status={inq.status} size="sm" />
                        <span className="text-[11px] text-[#A3A3A3]">
                          {formatDate(inq.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#171717] truncate">
                        {inq.propertyTitle}
                      </h4>
                      <p className="text-xs text-[#737373] truncate">
                        "{inq.message}"
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link to={`/inquiries/${inq.id}`}>
                      <Button variant="outline" size="sm" icon={Eye} className="text-xs px-3">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

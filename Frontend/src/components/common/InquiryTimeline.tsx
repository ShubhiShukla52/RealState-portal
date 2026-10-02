import React from 'react';
import {
  Send,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Home,
} from 'lucide-react';
import { PropertyInquiry } from '../../types/inquiry';
import { formatDate } from '../../utils/date';

export interface InquiryTimelineProps {
  inquiry: PropertyInquiry;
  className?: string;
}

interface TimelineStep {
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isCancelled?: boolean;
  icon: React.ElementType;
}

export const InquiryTimeline: React.FC<InquiryTimelineProps> = ({
  inquiry,
  className = '',
}) => {
  const isVisit = inquiry.type === 'visit';
  const isCancelled = inquiry.status === 'cancelled';
  const isCompleted = inquiry.status === 'completed';
  const isClosed = inquiry.status === 'closed';

  // Build steps based on inquiry type and status
  const steps: TimelineStep[] = [];

  // Step 1: Submission
  steps.push({
    title: isVisit ? 'Visit Request Submitted' : 'Inquiry Submitted',
    description: isVisit
      ? `Requested visit for ${inquiry.preferredDate || 'upcoming date'} at ${inquiry.preferredTime || 'selected slot'}.`
      : 'Inquiry details delivered to the property owner.',
    timestamp: formatDate(inquiry.createdAt),
    isCompleted: true,
    isCurrent: inquiry.status === 'pending' || (isVisit && inquiry.status === 'visit_requested'),
    icon: isVisit ? Calendar : Send,
  });

  // Step 2: Owner Contacted / Acknowledged
  const ownerResponded = Boolean(
    inquiry.ownerResponse ||
    inquiry.status === 'contacted' ||
    inquiry.status === 'visit_confirmed' ||
    isCompleted
  );

  steps.push({
    title: 'Owner Contacted',
    description: ownerResponded
      ? inquiry.ownerResponse
        ? 'Owner reviewed and responded to your inquiry.'
        : 'Inquiry viewed by owner/agent.'
      : 'Awaiting review by the verified property owner.',
    timestamp: inquiry.ownerResponseAt ? formatDate(inquiry.ownerResponseAt) : undefined,
    isCompleted: ownerResponded,
    isCurrent: inquiry.status === 'contacted',
    icon: MessageSquare,
  });

  // If it's a visit request:
  if (isVisit) {
    const isConfirmed = inquiry.status === 'visit_confirmed' || isCompleted;
    steps.push({
      title: 'Visit Confirmation',
      description: isConfirmed
        ? `Owner confirmed appointment for ${inquiry.preferredDate} (${inquiry.preferredTime}). Gate pass coordinated.`
        : isCancelled
        ? 'Visit request was cancelled before physical inspection.'
        : 'Owner is coordinating schedule and access pass.',
      timestamp: inquiry.ownerResponseAt && isConfirmed ? formatDate(inquiry.ownerResponseAt) : undefined,
      isCompleted: isConfirmed,
      isCurrent: inquiry.status === 'visit_confirmed',
      isCancelled: isCancelled,
      icon: isConfirmed ? CheckCircle2 : Clock,
    });
  }

  // Final Step: Outcome
  if (isCancelled) {
    steps.push({
      title: 'Request Cancelled',
      description: 'This request was cancelled by the user. No further action needed.',
      timestamp: formatDate(inquiry.updatedAt),
      isCompleted: true,
      isCurrent: true,
      isCancelled: true,
      icon: XCircle,
    });
  } else {
    steps.push({
      title: isCompleted ? 'Completed' : isClosed ? 'Closed' : 'Visit / Deal Finalization',
      description: isCompleted
        ? 'Site visit completed. Follow-up notes shared with buyer.'
        : isClosed
        ? 'Inquiry successfully closed.'
        : 'Meet owner in person, verify physical property and discuss documentation.',
      timestamp: isCompleted || isClosed ? formatDate(inquiry.updatedAt) : undefined,
      isCompleted: isCompleted || isClosed,
      isCurrent: isCompleted || isClosed,
      icon: isCompleted ? Home : CheckCircle2,
    });
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
        Inquiry Timeline
      </h3>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E2DF]">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              {/* Bullet circle */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.isCancelled
                    ? 'bg-rose-50 border-rose-500 text-rose-600'
                    : step.isCompleted
                    ? 'bg-[#171717] border-[#171717] text-white shadow-xs'
                    : 'bg-white border-[#E2E2DF] text-[#A3A3A3]'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* Step info */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <h4
                    className={`text-sm font-bold ${
                      step.isCancelled
                        ? 'text-rose-700'
                        : step.isCompleted
                        ? 'text-[#171717]'
                        : 'text-[#737373]'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.timestamp && (
                    <span className="text-[11px] text-[#A3A3A3]">
                      {step.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { InquiryStatus } from '../../types/inquiry';
import { Badge, BadgeVariant } from '../ui/Badge';
import { getInquiryStatusLabel } from '../../utils/inquiries';

export interface InquiryStatusBadgeProps {
  status: InquiryStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const InquiryStatusBadge: React.FC<InquiryStatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const getVariant = (st: InquiryStatus): BadgeVariant => {
    switch (st) {
      case 'pending':
        return 'warning';
      case 'contacted':
        return 'accent';
      case 'visit_requested':
        return 'secondary';
      case 'visit_confirmed':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      case 'closed':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getDotColor = (st: InquiryStatus): string => {
    switch (st) {
      case 'pending':
        return 'bg-amber-500';
      case 'contacted':
        return 'bg-[#C66A4A]';
      case 'visit_requested':
        return 'bg-blue-500';
      case 'visit_confirmed':
        return 'bg-emerald-500';
      case 'completed':
        return 'bg-[#171717]';
      case 'cancelled':
        return 'bg-rose-500';
      case 'closed':
        return 'bg-[#737373]';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Badge
      variant={getVariant(status)}
      size={size}
      className={`inline-flex items-center gap-1.5 font-medium ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(status)}`} />
      <span>{getInquiryStatusLabel(status)}</span>
    </Badge>
  );
};

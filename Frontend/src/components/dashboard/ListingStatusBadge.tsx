import React from 'react';
import { ListingStatus } from '../../data/mockDashboard';

export interface ListingStatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

export const ListingStatusBadge: React.FC<ListingStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getStatusStyles = (st: ListingStatus) => {
    switch (st) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Approved':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Draft':
        return 'bg-[#F5F5F2] text-[#737373] border-[#E2E2DF]';
      case 'Sold':
        return 'bg-[#F8EBE6] text-[#C66A4A] border-[#C66A4A]/30 font-semibold';
      case 'Rented':
        return 'bg-[#171717] text-white border-[#171717] font-semibold';
      default:
        return 'bg-[#F5F5F2] text-[#737373] border-[#E2E2DF]';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};

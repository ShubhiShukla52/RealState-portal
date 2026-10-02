import React from 'react';

export type AdminBadgeType =
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Published'
  | 'Rejected'
  | 'Sold'
  | 'Rented'
  | 'Active'
  | 'Suspended'
  | 'Admin'
  | 'Agent'
  | 'User'
  | 'Open'
  | 'Under Review'
  | 'Resolved'
  | 'Dismissed';

export interface AdminStatusBadgeProps {
  status: string;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      // Property & Report Statuses
      case 'Published':
      case 'Active':
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Approved':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Pending':
      case 'Under Review':
      case 'Open':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'Draft':
        return 'bg-[#F5F5F2] text-[#737373] border-[#E2E2DF]';
      case 'Rejected':
      case 'Suspended':
        return 'bg-red-50 text-[#DC2626] border-red-200 font-semibold';
      case 'Sold':
        return 'bg-[#F8EBE6] text-[#C66A4A] border-[#C66A4A]/30 font-semibold';
      case 'Rented':
        return 'bg-[#171717] text-white border-[#171717] font-semibold';
      case 'Dismissed':
        return 'bg-[#F5F5F2] text-[#737373] border-[#E2E2DF]';
      // User Roles
      case 'Admin':
        return 'bg-[#171717] text-white border-[#171717] font-bold';
      case 'Agent':
        return 'bg-[#F8EBE6] text-[#C66A4A] border-[#C66A4A]/40 font-semibold';
      case 'User':
        return 'bg-[#F5F5F2] text-[#222222] border-[#E2E2DF]';
      default:
        return 'bg-[#F5F5F2] text-[#737373] border-[#E2E2DF]';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};

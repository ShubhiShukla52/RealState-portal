import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { mockUser } from '../../data/mockDashboard';
import { NotificationBell } from '../notifications/NotificationBell';

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  action?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  action,
}) => {
  const initials = mockUser.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E2E2DF]">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open dashboard navigation menu"
            className="md:hidden p-2 rounded-lg border border-[#E2E2DF] bg-white text-[#171717] hover:bg-[#F5F5F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {action}

        {/* Real-time Notifications Bell */}
        <NotificationBell />

        {/* User Avatar badge */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-[#E2E2DF]">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
              {initials}
            </div>
            <span
              title="Verified Account"
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-[#171717] leading-tight">
              {mockUser.fullName}
            </p>
            <p className="text-[11px] text-[#737373] font-medium">
              {mockUser.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

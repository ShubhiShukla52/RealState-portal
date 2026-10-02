import React, { useState } from 'react';
import { Menu, Bell, Shield, Check } from 'lucide-react';

export interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  actions,
}) => {
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleNotificationClick = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E2E2DF]">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open administration navigation drawer"
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

      <div className="flex items-center gap-3 self-end sm:self-auto relative">
        {actions}

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="View system notifications"
            className="p-2.5 rounded-xl border border-[#E2E2DF] bg-white text-[#171717] hover:bg-[#F5F5F2] hover:border-[#A3A3A3] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <Bell className="w-4 h-4 text-[#737373]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C66A4A]" />
          </button>

          {showNotificationToast && (
            <div
              role="status"
              className="absolute right-0 -bottom-10 bg-[#171717] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 animate-in fade-in"
            >
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                All administrative alerts are up to date.
              </span>
            </div>
          )}
        </div>

        {/* Admin Profile Area */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#E2E2DF]">
          <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm shadow-2xs border border-white/20">
            EA
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-[#171717] leading-tight">
                EstateX Admin
              </span>
              <Shield className="w-3 h-3 text-[#C66A4A]" />
            </div>
            <p className="text-[11px] text-[#737373] font-medium">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

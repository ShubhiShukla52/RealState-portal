import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, Bell, ArrowRight } from 'lucide-react';
import { Notification } from '../../types/notification';
import { NotificationItem } from './NotificationItem';
import { ROUTES } from '../../constants/routes';

export interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onClose,
  className = '',
}) => {
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div
      className={`w-80 sm:w-96 bg-white border border-[#E2E2DF] rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col animate-in fade-in-50 zoom-in-95 duration-150 ${className}`}
    >
      {/* Dropdown Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#E2E2DF] flex items-center justify-between bg-[#FAFAF8]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#171717]" />
          <h3 className="text-sm font-extrabold text-[#171717]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F8EBE6] text-[#C66A4A] border border-[#C66A4A]/25">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] font-bold text-[#737373] hover:text-[#C66A4A] flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E2DF]/60">
        {recentNotifications.length > 0 ? (
          recentNotifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              onClick={onClose}
              compact
            />
          ))
        ) : (
          <div className="p-6 text-center text-xs text-[#737373]">
            No notifications at this time.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#FAFAF8] border-t border-[#E2E2DF] text-center">
        <Link
          to={ROUTES.DASHBOARD.NOTIFICATIONS}
          onClick={onClose}
          className="w-full py-2 px-3 rounded-xl hover:bg-[#F5F5F2] text-xs font-bold text-[#171717] hover:text-[#C66A4A] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>See all notifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

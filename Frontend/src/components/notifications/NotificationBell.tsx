import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';
import { NotificationDropdown } from './NotificationDropdown';

export interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useMessaging();

  // Close on outside click or Escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const displayCount =
    unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount.toString();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications ${
          unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} unread)` : ''
        }`}
        aria-expanded={isOpen}
        className="relative p-2 rounded-xl border border-[#E2E2DF] bg-white text-[#222222] hover:text-[#171717] hover:bg-[#F5F5F2] hover:border-[#A3A3A3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
      >
        <Bell className="w-5 h-5" />

        {/* Small subtle badge */}
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 min-w-4 h-4 rounded-full bg-[#C66A4A] text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs">
            {displayCount}
          </span>
        )}
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadNotificationsCount}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllNotificationsRead}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

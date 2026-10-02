import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Bookmark,
  Building2,
  MessageSquare,
  Bell,
  User,
  Star,
  LogOut,
  X,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useMessaging } from '../../context/MessagingContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useSavedSearch } from '../../context/SavedSearchContext';
import { useReviews } from '../../context/ReviewsContext';
import { useInquiries } from '../../context/InquiryContext';

export interface DashboardSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
  className = '',
}) => {
  const location = useLocation();
  const [showSignOutNotice, setShowSignOutNotice] = useState(false);
  const { unreadMessagesCount, unreadNotificationsCount } = useMessaging();
  const { favoritesCount } = useFavorites();
  const { savedSearchesCount } = useSavedSearch();
  const { userReviews } = useReviews();
  const { getPendingCount } = useInquiries();
  const pendingInquiriesCount = getPendingCount();

  const navigation = [
    {
      name: 'Overview',
      href: ROUTES.DASHBOARD.ROOT,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Favorites',
      href: ROUTES.DASHBOARD.FAVORITES,
      icon: Heart,
      badge: favoritesCount > 0 ? String(favoritesCount) : undefined,
    },
    {
      name: 'Saved Searches',
      href: ROUTES.DASHBOARD.SAVED_SEARCHES,
      icon: Bookmark,
      badge: savedSearchesCount > 0 ? String(savedSearchesCount) : undefined,
    },
    {
      name: 'My Listings',
      href: ROUTES.DASHBOARD.LISTINGS,
      icon: Building2,
    },
    {
      name: 'Inquiries',
      href: ROUTES.DASHBOARD.INQUIRIES,
      icon: CalendarCheck,
      badge: pendingInquiriesCount > 0 ? String(pendingInquiriesCount) : undefined,
    },
    {
      name: 'Messages',
      href: ROUTES.DASHBOARD.MESSAGES,
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? (unreadMessagesCount > 99 ? '99+' : String(unreadMessagesCount)) : undefined,
    },
    {
      name: 'Notifications',
      href: ROUTES.DASHBOARD.NOTIFICATIONS,
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? (unreadNotificationsCount > 99 ? '99+' : String(unreadNotificationsCount)) : undefined,
    },
    {
      name: 'My Reviews',
      href: ROUTES.DASHBOARD.REVIEWS,
      icon: Star,
      badge: userReviews.length > 0 ? String(userReviews.length) : undefined,
    },
    {
      name: 'Profile',
      href: ROUTES.DASHBOARD.PROFILE,
      icon: User,
    },
  ];

  const handleSignOutClick = () => {
    setShowSignOutNotice(true);
    setTimeout(() => {
      setShowSignOutNotice(false);
    }, 3000);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Mobile Header with close button */}
        <div className="flex md:hidden items-center justify-between pb-3 border-b border-[#E2E2DF]">
          <span className="font-extrabold text-base text-[#171717]">
            Dashboard Menu
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close dashboard menu"
            className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] px-3 block mb-2">
            Navigation
          </span>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#F8EBE6] text-[#C66A4A] font-bold shadow-2xs'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#C66A4A]' : 'text-[#737373]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#C66A4A] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Sign Out Area */}
      <div className="pt-6 border-t border-[#E2E2DF] space-y-3">
        {showSignOutNotice && (
          <div
            role="status"
            className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>UI Demo: Sign Out action clicked.</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOutClick}
          aria-label="Sign out of account"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
        >
          <LogOut className="w-4 h-4 text-[#DC2626]" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block w-64 shrink-0 bg-white rounded-2xl border border-[#E2E2DF] p-4 shadow-sm self-start sticky top-24 ${className}`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop and Slide-over */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#171717]/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-5 flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

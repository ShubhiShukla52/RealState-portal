import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CheckCheck, Inbox, ArrowRight } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';
import { useMessaging } from '../../context/MessagingContext';
import {
  NotificationFilters,
  NotificationFilterType,
} from '../../components/notifications/NotificationFilters';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

export const NotificationsPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');

  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    deleteNotification,
  } = useMessaging();

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'unread') return !item.read;
      if (activeFilter === 'messages') return item.type === 'message';
      if (activeFilter === 'properties') return item.type === 'property' || item.type === 'listing';
      if (activeFilter === 'system') return item.type === 'system' || item.type === 'report';
      return true;
    });
  }, [notifications, activeFilter]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Notifications"
        subtitle="Stay updated with your properties and conversations."
        onOpenMobileMenu={openMobileSidebar}
        action={
          unreadNotificationsCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCheck}
              onClick={markAllNotificationsRead}
              className="border-[#E2E2DF] text-xs font-semibold"
            >
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-[#E2E2DF] shadow-xs overflow-hidden">
        {/* Filter Controls Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E2DF] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <NotificationFilters
            activeFilter={activeFilter}
            onChange={setActiveFilter}
            unreadCount={unreadNotificationsCount}
          />

          <span className="text-xs font-semibold text-[#737373] self-end sm:self-auto">
            Showing {filteredNotifications.length} {filteredNotifications.length === 1 ? 'alert' : 'alerts'}
          </span>
        </div>

        {/* Notifications Feed */}
        <div className="divide-y divide-[#E2E2DF]/60">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={markNotificationRead}
                onMarkUnread={markNotificationUnread}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <div className="py-16 px-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#F5F5F2] flex items-center justify-center mx-auto text-[#A3A3A3]">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">
                No notifications found
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] max-w-sm mx-auto">
                {activeFilter === 'unread'
                  ? 'You are all caught up! No unread alerts.'
                  : `No notifications under the ${activeFilter} category.`}
              </p>
              <div className="pt-2">
                <Link to={ROUTES.PROPERTIES}>
                  <Button variant="secondary" size="sm" icon={ArrowRight}>
                    Explore Properties
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

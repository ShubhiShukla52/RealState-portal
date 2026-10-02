import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Building,
  CheckCircle2,
  Shield,
  Heart,
  AlertTriangle,
  Check,
  Trash2,
} from 'lucide-react';
import { Notification, NotificationType } from '../../types/notification';
import { formatRelativeTime } from '../../utils/date';

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  compact?: boolean;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'message':
      return <MessageSquare className="w-4 h-4 text-[#C66A4A]" />;
    case 'property':
      return <Building className="w-4 h-4 text-[#171717]" />;
    case 'listing':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case 'system':
      return <Shield className="w-4 h-4 text-sky-600" />;
    case 'favorite':
      return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
    case 'report':
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    default:
      return <Building className="w-4 h-4 text-[#737373]" />;
  }
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onClick,
  compact = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
    if (onClick) {
      onClick();
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative p-3.5 transition-colors cursor-pointer flex items-start gap-3 select-none ${
        notification.read
          ? 'bg-white hover:bg-[#F5F5F2]'
          : 'bg-[#F8EBE6]/40 hover:bg-[#F8EBE6]/70'
      }`}
    >
      {/* Icon Circle */}
      <div className="w-9 h-9 rounded-full bg-white border border-[#E2E2DF] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4
            className={`text-xs sm:text-sm truncate ${
              notification.read ? 'font-semibold text-[#222222]' : 'font-bold text-[#171717]'
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-[#A3A3A3] shrink-0 font-medium">
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>

        <p
          className={`text-xs ${
            compact ? 'line-clamp-1' : 'line-clamp-2'
          } ${notification.read ? 'text-[#737373]' : 'text-[#333333]'}`}
        >
          {notification.message}
        </p>
      </div>

      {/* Actions / Unread dot */}
      <div className="flex items-center gap-1.5 self-center shrink-0">
        {!notification.read && (
          <span
            title="Unread"
            className="w-2 h-2 rounded-full bg-[#C66A4A] shrink-0 ring-2 ring-white"
          />
        )}

        {!compact && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {notification.read ? (
              onMarkUnread && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkUnread(notification.id);
                  }}
                  title="Mark as unread"
                  className="p-1 rounded text-[#737373] hover:text-[#171717] hover:bg-[#E2E2DF]"
                >
                  <span className="text-[10px] font-medium">Unread</span>
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.id);
                }}
                title="Mark as read"
                className="p-1 rounded text-[#737373] hover:text-[#171717] hover:bg-[#E2E2DF]"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                title="Delete notification"
                className="p-1 rounded text-[#DC2626] hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

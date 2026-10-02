import React from 'react';

export type NotificationFilterType = 'all' | 'unread' | 'messages' | 'properties' | 'system';

export interface NotificationFiltersProps {
  activeFilter: NotificationFilterType;
  onChange: (filter: NotificationFilterType) => void;
  unreadCount?: number;
  className?: string;
}

const FILTERS: { id: NotificationFilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'messages', label: 'Messages' },
  { id: 'properties', label: 'Properties' },
  { id: 'system', label: 'System' },
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onChange,
  unreadCount = 0,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {FILTERS.map((f) => {
        const isSelected = activeFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSelected
                ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                : 'bg-white text-[#737373] hover:text-[#171717] border-[#E2E2DF] hover:border-[#171717]'
            }`}
          >
            <span>{f.label}</span>
            {f.id === 'unread' && unreadCount > 0 && (
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white text-[#171717]' : 'bg-[#F8EBE6] text-[#C66A4A]'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Archive, ArchiveRestore, Trash2, ShieldCheck, Home } from 'lucide-react';
import { Conversation } from '../../types/message';
import { formatRelativeTime } from '../../utils/date';

export interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onArchive,
  onUnarchive,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { participant, property, lastMessage, lastMessageAt, unreadCount, status } =
    conversation;

  // Close menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const hasUnread = unreadCount > 0;

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`group relative p-3.5 sm:p-4 transition-all duration-150 cursor-pointer border-l-4 flex items-start gap-3 select-none ${
        isSelected
          ? 'bg-[#F8EBE6] border-l-[#C66A4A]'
          : hasUnread
          ? 'bg-white border-l-[#171717] hover:bg-[#FAFAF8]'
          : 'bg-white border-l-transparent hover:bg-[#F5F5F2]'
      }`}
    >
      {/* Avatar with Online indicator */}
      <div className="relative shrink-0 mt-0.5">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs shadow-xs">
          {participant.avatarInitials}
        </div>
        {participant.isOnline && (
          <span
            title="Online"
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
          />
        )}
      </div>

      {/* Info Column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-sm truncate ${
                hasUnread ? 'font-black text-[#171717]' : 'font-bold text-[#222222]'
              }`}
            >
              {participant.name}
            </span>
            {participant.verified && (
              <span title="Verified Agent">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#A3A3A3] shrink-0 font-medium">
            {formatRelativeTime(lastMessageAt)}
          </span>
        </div>

        {/* Property Reference Badge */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#C66A4A] truncate mb-1">
          <Home className="w-3 h-3 shrink-0" />
          <span className="truncate">{property.title}</span>
        </div>

        {/* Latest message preview */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              hasUnread ? 'font-bold text-[#171717]' : 'text-[#737373]'
            }`}
          >
            {lastMessage}
          </p>

          {/* Unread badge */}
          {hasUnread && (
            <span className="w-4 h-4 rounded-full bg-[#C66A4A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Actions menu trigger */}
      <div ref={menuRef} className="relative self-center shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          aria-label="Conversation options"
          className="p-1 rounded-md text-[#A3A3A3] hover:text-[#171717] hover:bg-[#E2E2DF]/60 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#E2E2DF] rounded-xl shadow-lg z-30 py-1 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
            {status === 'active' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[#222222] hover:bg-[#F5F5F2] flex items-center gap-2"
              >
                <Archive className="w-3.5 h-3.5 text-[#737373]" />
                <span>Archive</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUnarchive(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[#222222] hover:bg-[#F5F5F2] flex items-center gap-2"
              >
                <ArchiveRestore className="w-3.5 h-3.5 text-[#737373]" />
                <span>Unarchive</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#DC2626] hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

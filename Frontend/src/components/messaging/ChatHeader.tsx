import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  MoreVertical,
  Archive,
  ArchiveRestore,
  Trash2,
} from 'lucide-react';
import { Conversation } from '../../types/message';
import { ROUTES } from '../../constants/routes';

export interface ChatHeaderProps {
  conversation: Conversation;
  onBackMobile: () => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBackMobile,
  onArchive,
  onUnarchive,
  onDelete,
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { participant, property, status } = conversation;
  const propertyUrl = ROUTES.PROPERTY_DETAILS(property.id);

  // Close menu on click outside
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

  return (
    <div
      className={`px-4 py-3 sm:py-3.5 border-b border-[#E2E2DF] bg-white flex items-center justify-between gap-3 ${className}`}
    >
      {/* Left: Mobile back button & Participant info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBackMobile}
          aria-label="Back to conversations list"
          className="md:hidden p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {participant.avatarInitials}
          </div>
          {participant.isOnline && (
            <span
              title="Online"
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"
            />
          )}
        </div>

        {/* Identity Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#171717] truncate">
              {participant.name}
            </h3>
            {participant.verified && (
              <span title="Verified">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#737373]">
            <span>{participant.role}</span>
            <span>•</span>
            <span className={participant.isOnline ? 'text-emerald-600 font-medium' : 'text-[#A3A3A3]'}>
              {participant.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Property Details Link & Action Menu */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={propertyUrl}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E2DF] hover:border-[#171717] text-xs font-semibold text-[#222222] hover:bg-[#F5F5F2] transition-colors"
        >
          <span>View Listing</span>
          <ExternalLink className="w-3 h-3 text-[#A3A3A3]" />
        </Link>

        {/* Options Menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Conversation actions"
            className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E2E2DF] rounded-xl shadow-lg z-30 py-1 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
              <Link
                to={propertyUrl}
                className="sm:hidden w-full text-left px-3 py-2 text-[#222222] hover:bg-[#F5F5F2] flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#737373]" />
                <span>View Property</span>
              </Link>

              {status === 'active' ? (
                <button
                  type="button"
                  onClick={() => {
                    onArchive(conversation.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[#222222] hover:bg-[#F5F5F2] flex items-center gap-2"
                >
                  <Archive className="w-3.5 h-3.5 text-[#737373]" />
                  <span>Archive Chat</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onUnarchive(conversation.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[#222222] hover:bg-[#F5F5F2] flex items-center gap-2"
                >
                  <ArchiveRestore className="w-3.5 h-3.5 text-[#737373]" />
                  <span>Unarchive Chat</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onDelete(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[#DC2626] hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

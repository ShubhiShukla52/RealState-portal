import React, { useState, useMemo } from 'react';
import { Search, X, Inbox, MessageSquare } from 'lucide-react';
import { Conversation } from '../../types/message';
import { ConversationItem } from './ConversationItem';

export type ConversationFilterTab = 'all' | 'unread' | 'archived';

export interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  onArchive,
  onUnarchive,
  onDelete,
  className = '',
}) => {
  const [filterTab, setFilterTab] = useState<ConversationFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unread count across active conversations
  const unreadCount = useMemo(() => {
    return conversations
      .filter((c) => c.status !== 'archived')
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  // Filtered list
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // 1. Tab filter
      if (filterTab === 'unread') {
        if (c.status === 'archived' || c.unreadCount === 0) return false;
      } else if (filterTab === 'archived') {
        if (c.status !== 'archived') return false;
      } else {
        // 'all' tab excludes archived conversations by default unless searched
        if (c.status === 'archived' && !searchQuery.trim()) return false;
      }

      // 2. Search query filter (participant name, property title, message text)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.participant.name.toLowerCase().includes(q);
        const matchesProperty = c.property.title.toLowerCase().includes(q);
        const matchesMessage = c.messages.some((m) => m.text.toLowerCase().includes(q));
        if (!matchesName && !matchesProperty && !matchesMessage) return false;
      }

      return true;
    });
  }, [conversations, filterTab, searchQuery]);

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Top Header & Search Bar */}
      <div className="p-3.5 sm:p-4 border-b border-[#E2E2DF] space-y-3 bg-[#FAFAF8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#C66A4A]" />
            <h2 className="text-sm font-extrabold text-[#171717] tracking-tight">
              Messages
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#737373]">
            {conversations.filter((c) => c.status !== 'archived').length} active
          </span>
        </div>

        {/* Search input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-[#A3A3A3] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="w-full pl-9 pr-8 py-2 bg-white border border-[#E2E2DF] rounded-xl text-xs sm:text-sm text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 p-1 text-[#A3A3A3] hover:text-[#171717]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs: All, Unread, Archived */}
        <div className="flex bg-[#F5F5F2] p-1 rounded-xl border border-[#E2E2DF]">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'all'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('unread')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              filterTab === 'unread'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C66A4A] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('archived')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'archived'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Conversation List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E2E2DF]/60">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onSelect={onSelect}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="p-8 text-center text-[#737373] space-y-2">
            <Inbox className="w-8 h-8 text-[#A3A3A3] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#171717]">No conversations found</p>
            <p className="text-xs text-[#737373] max-w-xs mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Try different keywords.`
                : filterTab === 'unread'
                ? 'You have caught up with all incoming inquiries.'
                : 'No archived conversations.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare, Search, X } from 'lucide-react';
import { Conversation } from '../../types/message';
import { ChatHeader } from './ChatHeader';
import { PropertyContextCard } from './PropertyContextCard';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';

export interface ChatWindowProps {
  conversation: Conversation | null;
  onSendMessage: (conversationId: string, text: string) => void;
  onBackMobile: () => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onSendMessage,
  onBackMobile,
  onArchive,
  onUnarchive,
  onDelete,
  className = '',
}) => {
  const [inChatSearch, setInChatSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.id, conversation?.messages?.length]);

  if (!conversation) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center p-8 text-center bg-white ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-[#F5F5F2] flex items-center justify-center mb-3">
          <MessageSquare className="w-8 h-8 text-[#A3A3A3]" />
        </div>
        <h3 className="text-base font-bold text-[#171717] mb-1">
          Select a conversation
        </h3>
        <p className="text-xs sm:text-sm text-[#737373] max-w-sm">
          Choose a conversation to start messaging about a property.
        </p>
      </div>
    );
  }

  // Filter messages if search is active
  const displayedMessages = inChatSearch.trim()
    ? conversation.messages.filter((m) =>
        m.text.toLowerCase().includes(inChatSearch.trim().toLowerCase())
      )
    : conversation.messages;

  return (
    <div className={`flex-1 flex flex-col h-full bg-[#F5F5F2]/40 ${className}`}>
      {/* 1. Chat Header */}
      <ChatHeader
        conversation={conversation}
        onBackMobile={onBackMobile}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
      />

      {/* 2. Property Context Card & In-Chat Search Bar */}
      <div className="p-3 bg-[#FAFAF8] border-b border-[#E2E2DF] space-y-2">
        <PropertyContextCard property={conversation.property} />

        {/* Message search toggle button or input */}
        <div className="flex items-center justify-between px-1">
          {showSearch ? (
            <div className="flex items-center gap-2 w-full animate-in fade-in-50 duration-150">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A3A3A3]" />
                <input
                  type="text"
                  value={inChatSearch}
                  onChange={(e) => setInChatSearch(e.target.value)}
                  placeholder="Search in this chat..."
                  className="w-full pl-8 pr-7 py-1 text-xs bg-white border border-[#E2E2DF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#171717]"
                  autoFocus
                />
                {inChatSearch && (
                  <button
                    type="button"
                    onClick={() => setInChatSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#171717]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setInChatSearch('');
                }}
                className="text-xs text-[#737373] hover:text-[#171717] px-1"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="text-[11px] font-semibold text-[#737373] hover:text-[#171717] flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3 h-3" />
              <span>Search in conversation</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {displayedMessages.length > 0 ? (
          displayedMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={msg.senderId === 'current-user'}
            />
          ))
        ) : (
          <div className="py-12 text-center text-xs text-[#737373]">
            No messages found matching &quot;{inChatSearch}&quot;.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Message Composer */}
      <MessageComposer
        onSend={(text) => onSendMessage(conversation.id, text)}
        placeholder={`Reply to ${conversation.participant.name}...`}
      />
    </div>
  );
};

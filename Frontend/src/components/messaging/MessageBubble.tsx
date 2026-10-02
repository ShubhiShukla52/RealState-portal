import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../types/message';

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div
      className={`flex flex-col ${
        isCurrentUser ? 'items-end' : 'items-start'
      } space-y-1 max-w-[85%] sm:max-w-[72%]`}
    >
      {/* Bubble Box */}
      <div
        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed shadow-2xs break-words ${
          isCurrentUser
            ? 'bg-[#171717] text-white rounded-br-xs'
            : 'bg-white text-[#222222] border border-[#E2E2DF] rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>

      {/* Timestamp & Status Metadata */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#A3A3A3] px-1">
        <span>{message.timestamp}</span>

        {/* Status ticks for outgoing messages */}
        {isCurrentUser && (
          <span className="flex items-center">
            {message.status === 'sent' && (
              <span title="Sent">
                <Check className="w-3 h-3 text-[#A3A3A3]" />
              </span>
            )}
            {message.status === 'delivered' && (
              <span title="Delivered">
                <CheckCheck className="w-3.5 h-3.5 text-[#A3A3A3]" />
              </span>
            )}
            {message.status === 'read' && (
              <span title="Read">
                <CheckCheck className="w-3.5 h-3.5 text-[#C66A4A]" />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

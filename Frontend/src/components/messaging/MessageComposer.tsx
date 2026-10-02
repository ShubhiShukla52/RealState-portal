import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

export interface MessageComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message (Enter to send, Shift+Enter for new line)...',
  className = '',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  return (
    <div
      className={`p-3 sm:p-4 border-t border-[#E2E2DF] bg-white flex items-end gap-2 ${className}`}
    >
      {/* Demo attachment icon button */}
      <button
        type="button"
        disabled
        title="Document and image attachment (Demo UI)"
        aria-label="Attach documents"
        className="p-2.5 rounded-xl text-[#A3A3A3] hover:text-[#171717] hover:bg-[#F5F5F2] cursor-not-allowed transition-colors shrink-0 mb-0.5 opacity-60"
      >
        <Paperclip className="w-4 h-4" />
      </button>

      {/* Multiline auto-expanding textarea */}
      <div className="flex-1 relative">
        <label htmlFor="chat-message-composer" className="sr-only">
          Message text
        </label>
        <textarea
          id="chat-message-composer"
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full max-h-32 min-h-[42px] py-2.5 px-3.5 bg-[#F5F5F2] rounded-xl border border-[#E2E2DF] text-xs sm:text-sm text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white resize-none transition-all shadow-2xs leading-relaxed"
        />
      </div>

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#171717] text-white hover:bg-[#C66A4A] disabled:opacity-40 disabled:hover:bg-[#171717] disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] mb-0.5 shadow-xs"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-bold">Send</span>
      </button>
    </div>
  );
};

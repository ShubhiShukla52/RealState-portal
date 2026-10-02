import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams, Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';
import { useMessaging } from '../../context/MessagingContext';
import { ConversationList } from '../../components/messaging/ConversationList';
import { ChatWindow } from '../../components/messaging/ChatWindow';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

export const MessagesPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const [searchParams] = useSearchParams();

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markConversationRead,
    archiveConversation,
    unarchiveConversation,
    deleteConversation,
  } = useMessaging();

  const [showMobileChat, setShowMobileChat] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Read conversationId from URL query param if present
  useEffect(() => {
    const urlConvId = searchParams.get('conversationId');
    if (urlConvId && conversations.some((c) => c.id === urlConvId)) {
      setActiveConversationId(urlConvId);
      markConversationRead(urlConvId);
      setShowMobileChat(true);
    }
  }, [searchParams, conversations, setActiveConversationId, markConversationRead]);

  // When active conversation changes, mark as read
  useEffect(() => {
    if (activeConversationId) {
      markConversationRead(activeConversationId);
    }
  }, [activeConversationId, markConversationRead]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    markConversationRead(id);
    setShowMobileChat(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteConversation(deleteTargetId);
      setDeleteTargetId(null);
      setShowMobileChat(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Messages"
        subtitle="Communicate directly with verified property owners and buyers."
        onOpenMobileMenu={openMobileSidebar}
      />

      {/* Main Messages Container */}
      {conversations.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E2DF] shadow-xs overflow-hidden flex flex-col md:flex-row h-[700px]">
          {/* Left Column: Conversation List */}
          <div
            className={`w-full md:w-80 lg:w-[380px] border-r border-[#E2E2DF] flex flex-col h-full shrink-0 ${
              showMobileChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ConversationList
              conversations={conversations}
              selectedId={activeConversationId}
              onSelect={handleSelectConversation}
              onArchive={archiveConversation}
              onUnarchive={unarchiveConversation}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          </div>

          {/* Right Column: Chat Window */}
          <div
            className={`flex-1 flex flex-col h-full bg-white ${
              !showMobileChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ChatWindow
              conversation={activeConversation}
              onSendMessage={sendMessage}
              onBackMobile={() => setShowMobileChat(false)}
              onArchive={archiveConversation}
              onUnarchive={unarchiveConversation}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          </div>
        </div>
      ) : (
        /* Empty Conversation State (Requirement 18) */
        <div className="bg-white rounded-2xl border border-[#E2E2DF] p-12 text-center shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F2] flex items-center justify-center mx-auto text-[#A3A3A3]">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#171717]">No messages yet</h3>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">
              When you contact a property owner, your conversations will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link to={ROUTES.PROPERTIES}>
              <Button variant="primary" size="md" icon={ArrowRight}>
                Explore Properties
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Requirement 14) */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl border border-[#E2E2DF] p-6 max-w-md w-full shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
            aria-label="Delete conversation confirmation"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  Delete Conversation
                </h3>
                <p className="text-xs text-[#737373] mt-0.5">
                  Are you sure you want to delete this chat history? This local demo action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E2DF]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTargetId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmDelete}
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white border-transparent"
              >
                Delete Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

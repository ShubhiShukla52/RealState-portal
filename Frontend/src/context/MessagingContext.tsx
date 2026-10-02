import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Conversation, Message } from '../types/message';
import { Notification } from '../types/notification';
import { mockConversations } from '../data/mockMessages';
import { mockNotifications } from '../data/mockNotifications';
import { Property } from '../types/property';

export interface MessagingContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  startOrOpenConversation: (property: Property, initialMessage?: string) => string;
  unreadMessagesCount: number;

  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markNotificationUnread: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { timestamp?: string }) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

const DEMO_RESPONSES = [
  'Thank you for reaching out! Yes, this property is available for inspection.',
  'We have noted your interest and will coordinate with the caretaker right away.',
  'Sure, would Saturday afternoon work well for you to visit the site?',
  'I will share the legal title documentation and sanction plan with you shortly.',
  'Yes, the price is slightly negotiable for genuine immediate buyers.',
];

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    mockConversations[0]?.id || null
  );
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Unread messages count
  const unreadMessagesCount = useMemo(() => {
    return conversations
      .filter((c) => c.status !== 'archived')
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  // Unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Mark conversation read
  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages = c.messages.map((m) =>
            m.senderId !== 'current-user' && m.status !== 'read'
              ? { ...m, status: 'read' as const }
              : m
          );
          return { ...c, unreadCount: 0, messages: updatedMessages };
        }
        return c;
      })
    );
  }, []);

  // Send message
  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const timeStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      receiverId: 'partner',
      text: trimmed,
      timestamp: timeStr,
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: trimmed,
            lastMessageAt: new Date().toISOString(),
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Simulate quick message status updates: sent -> delivered
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m
              ),
            };
          }
          return c;
        })
      );
    }, 700);

    // Optional Demo Auto-Reply after 2 seconds (Requirement 11)
    setTimeout(() => {
      const randomResponse =
        DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      const replyTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        conversationId,
        senderId: 'partner',
        receiverId: 'current-user',
        text: randomResponse,
        timestamp: replyTime,
        status: 'delivered',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: randomResponse,
              lastMessageAt: new Date().toISOString(),
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 2200);
  }, []);

  // Archive / Unarchive
  const archiveConversation = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, status: 'archived' } : c))
    );
  }, []);

  const unarchiveConversation = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, status: 'active' } : c))
    );
  }, []);

  // Delete
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    setActiveConversationId((prev) => (prev === conversationId ? null : prev));
  }, []);

  // Contact Owner action (creates or selects existing conversation)
  const startOrOpenConversation = useCallback(
    (property: Property, initialMessage?: string): string => {
      // Check if conversation already exists for this property
      const existing = conversations.find((c) => c.property.id === property.id);
      if (existing) {
        if (initialMessage && initialMessage.trim()) {
          sendMessage(existing.id, initialMessage.trim());
        }
        setActiveConversationId(existing.id);
        markConversationRead(existing.id);
        return existing.id;
      }

      // Create new conversation
      const ownerName = property.owner?.name || 'Property Owner';
      const initials = ownerName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

      const newConvId = `conv-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const timeStr = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const firstMsgText =
        initialMessage?.trim() ||
        `Hi, I am interested in "${property.title}". Please share more details.`;

      const newConv: Conversation = {
        id: newConvId,
        participant: {
          id: `usr-${Date.now()}`,
          name: ownerName,
          role: property.owner?.role || 'Property Owner',
          avatar: property.owner?.avatar || null,
          avatarInitials: initials || 'PO',
          phone: property.owner?.phone,
          email: property.owner?.email,
          isOnline: true,
          verified: true,
        },
        property: {
          id: property.id,
          title: property.title,
          price: property.price,
          listingType: property.listingType,
          location: property.location || `${property.locality}, ${property.city}`,
          city: property.city,
          image:
            property.images[0] ||
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          propertyType: property.propertyType,
        },
        lastMessage: firstMsgText,
        lastMessageAt: nowIso,
        unreadCount: 0,
        status: 'active',
        createdAt: nowIso,
        messages: [
          {
            id: `msg-${Date.now()}`,
            conversationId: newConvId,
            senderId: 'current-user',
            receiverId: `usr-${Date.now()}`,
            text: firstMsgText,
            timestamp: timeStr,
            status: 'sent',
          },
        ],
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConvId);

      // Add a notification for user
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        type: 'message',
        title: `Inquiry sent for ${property.title}`,
        message: 'Your inquiry was delivered to the property owner.',
        timestamp: nowIso,
        read: false,
        link: `/dashboard/messages?conversationId=${newConvId}`,
        conversationId: newConvId,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return newConvId;
    },
    [conversations, sendMessage, markConversationRead]
  );

  // Notification actions
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markNotificationUnread = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (notif: Omit<Notification, 'id' | 'timestamp' | 'read'> & { timestamp?: string }) => {
      const newNotif: Notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        read: false,
        timestamp: notif.timestamp || new Date().toISOString(),
        ...notif,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        markConversationRead,
        archiveConversation,
        unarchiveConversation,
        deleteConversation,
        startOrOpenConversation,
        unreadMessagesCount,

        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markNotificationUnread,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export function useMessaging(): MessagingContextType {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}

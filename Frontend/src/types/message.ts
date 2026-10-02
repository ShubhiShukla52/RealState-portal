export type MessageStatus = 'sent' | 'delivered' | 'read';
export type ConversationStatus = 'active' | 'archived';

export interface MessageParticipant {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
  avatarInitials: string;
  phone?: string;
  email?: string;
  isOnline?: boolean;
  verified?: boolean;
}

export interface MessagePropertyContext {
  id: string;
  title: string;
  price: number;
  listingType: 'sale' | 'rent';
  location: string;
  city: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'current-user' or participant id
  receiverId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participant: MessageParticipant;
  property: MessagePropertyContext;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
  status: ConversationStatus;
  createdAt: string;
}

export type NotificationType =
  | 'message'
  | 'property'
  | 'listing'
  | 'system'
  | 'favorite'
  | 'report'
  | 'inquiry';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  propertyId?: string;
  conversationId?: string;
}

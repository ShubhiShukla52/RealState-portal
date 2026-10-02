import { Notification } from '../types/notification';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'New message from Aman Verma',
    message: 'I have arranged the key with the caretaker. Can you confirm if 11:30 AM works for you?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    read: false,
    link: '/dashboard/messages?conversationId=conv-1',
    conversationId: 'conv-1',
  },
  {
    id: 'notif-2',
    type: 'listing',
    title: 'Your property listing was approved',
    message: 'Your listing "Modern 3 BHK in Civil Lines" has been verified and published to the catalog.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    read: false,
    link: '/dashboard/listings',
    propertyId: 'prop-101',
  },
  {
    id: 'notif-3',
    type: 'favorite',
    title: 'Someone saved your property',
    message: 'A prospective homebuyer bookmarked your listing "Contemporary Sea-Facing 2 BHK".',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    read: false,
    link: '/dashboard/listings',
    propertyId: 'prop-002',
  },
  {
    id: 'notif-4',
    type: 'message',
    title: 'New message from Vikram Malhotra',
    message: 'Yes, both covered parking slots are allotted right near the main lobby elevator.',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    read: false,
    link: '/dashboard/messages?conversationId=conv-2',
    conversationId: 'conv-2',
  },
  {
    id: 'notif-5',
    type: 'property',
    title: 'Price drop on a saved residence',
    message: 'A villa you saved in Gomti Nagar Extension, Lucknow reduced price by ₹15 Lakhs.',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
    read: true,
    link: '/properties/prop-010',
    propertyId: 'prop-010',
  },
  {
    id: 'notif-6',
    type: 'listing',
    title: 'New inquiry received',
    message: 'Aditi Roy sent an inquiry regarding your apartment in Sector 128, Noida.',
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    read: true,
    link: '/dashboard/messages',
    propertyId: 'prop-001',
  },
  {
    id: 'notif-7',
    type: 'system',
    title: 'EstateX Security Notice',
    message: 'Your account was accessed from a verified browser session in Uttar Pradesh.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // Yesterday
    read: true,
    link: '/dashboard/profile',
  },
  {
    id: 'notif-8',
    type: 'report',
    title: 'Listing inspection status update',
    message: 'Verification team completed photo validation for your Bareilly properties.',
    timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), // Yesterday
    read: true,
    link: '/dashboard/listings',
  },
  {
    id: 'notif-9',
    type: 'property',
    title: 'New property recommendation',
    message: '3 new luxury apartments matching your search in Bengaluru were just listed.',
    timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
    read: true,
    link: '/properties?city=Bengaluru',
  },
  {
    id: 'notif-10',
    type: 'listing',
    title: 'Listing views milestone',
    message: 'Your property "4 BHK Villa with Lawn" surpassed 250 verified views this week.',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    read: true,
    link: '/dashboard/listings',
    propertyId: 'prop-102',
  },
  {
    id: 'notif-11',
    type: 'system',
    title: 'Profile verification complete',
    message: 'Your identity document has been verified. You now have a verified seller badge.',
    timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), // 4 days ago
    read: true,
    link: '/dashboard/profile',
  },
  {
    id: 'notif-12',
    type: 'property',
    title: 'Market Trends Report (Q3 2026)',
    message: 'Average residential price per sq.ft in NCR and Bareilly corridors increased by 4.2%.',
    timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
    read: true,
    link: '/about',
  },
];

import { mockProperties } from './mockProperties';
import { Property } from '../types/property';

export interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string | null;
  role: string;
  joinedDate: string;
}

export const mockUser: DashboardUser = {
  id: 'usr-8812',
  fullName: 'Rahul Sharma',
  email: 'rahul.sharma@estatex.in',
  phone: '+91 98765 43210',
  location: 'Sector 62, Noida, Uttar Pradesh',
  avatarUrl: null,
  role: 'Verified Property Owner',
  joinedDate: 'March 2025',
};

// Reusing existing properties for favorites
export const mockFavorites: Property[] = [
  mockProperties[0],
  mockProperties[1],
  mockProperties[2],
  mockProperties[3],
];

export type ListingStatus =
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Published'
  | 'Sold'
  | 'Rented';

export interface UserListing {
  id: string;
  title: string;
  propertyType: string;
  listingType: 'sale' | 'rent';
  price: number;
  location: string;
  city: string;
  image: string;
  status: ListingStatus;
  createdAt: string;
  views: number;
  inquiries: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export const mockListings: UserListing[] = [
  {
    id: 'prop-001',
    title: 'Luxury 3 BHK High-Rise Residence with Golf Views',
    propertyType: 'Apartment',
    listingType: 'sale',
    price: 18500000,
    location: 'Sector 128, Expressway, Noida',
    city: 'Noida',
    image: mockProperties[0].images[0],
    status: 'Published',
    createdAt: '2026-09-15',
    views: 1420,
    inquiries: 18,
    bedrooms: 3,
    bathrooms: 3,
    area: 1950,
  },
  {
    id: 'prop-002',
    title: 'Contemporary Sea-Facing 2 BHK Designer Home',
    propertyType: 'Apartment',
    listingType: 'sale',
    price: 52500000,
    location: 'Carter Road, Bandra West, Mumbai',
    city: 'Mumbai',
    image: mockProperties[1].images[0],
    status: 'Approved',
    createdAt: '2026-09-20',
    views: 890,
    inquiries: 9,
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
  },
  {
    id: 'prop-003',
    title: 'Minimalist 4 BHK Courtyard Villa with Pool',
    propertyType: 'Villa',
    listingType: 'sale',
    price: 37500000,
    location: 'Whitefield, Bengaluru',
    city: 'Bengaluru',
    image: mockProperties[2].images[0],
    status: 'Pending',
    createdAt: '2026-09-28',
    views: 310,
    inquiries: 2,
    bedrooms: 4,
    bathrooms: 4,
    area: 3400,
  },
  {
    id: 'prop-004',
    title: 'Spacious 2 BHK High-Floor Suite with Skyline Balcony',
    propertyType: 'Apartment',
    listingType: 'rent',
    price: 45000,
    location: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    image: mockProperties[3].images[0],
    status: 'Draft',
    createdAt: '2026-09-30',
    views: 45,
    inquiries: 0,
    bedrooms: 2,
    bathrooms: 2,
    area: 1350,
  },
];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'owner';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  ownerName: string;
  propertyName: string;
  propertyPrice: string;
  avatarInitials: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    ownerName: 'Vikram Malhotra',
    propertyName: 'Luxury 3 BHK High-Rise Residence with Golf Views',
    propertyPrice: '₹1.85 Cr',
    avatarInitials: 'VM',
    lastMessage: 'Yes, you can schedule a physical site inspection this Saturday at 11 AM.',
    time: '2:30 PM',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Hi Vikram, is this 3 BHK golf residence still available for site viewing?',
        timestamp: '2:15 PM',
      },
      {
        id: 'm2',
        sender: 'owner',
        text: 'Hello Rahul! Yes, the apartment is currently available and ready for handover.',
        timestamp: '2:22 PM',
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'Wonderful. Would this upcoming Saturday morning work for a walkthrough?',
        timestamp: '2:25 PM',
      },
      {
        id: 'm4',
        sender: 'owner',
        text: 'Yes, you can schedule a physical site inspection this Saturday at 11 AM.',
        timestamp: '2:30 PM',
      },
    ],
  },
  {
    id: 'conv-2',
    ownerName: 'Ananya Iyer',
    propertyName: 'Contemporary Sea-Facing 2 BHK Designer Home',
    propertyPrice: '₹5.25 Cr',
    avatarInitials: 'AI',
    lastMessage: 'The maintenance fee and covered parking slot are included.',
    time: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm21',
        sender: 'user',
        text: 'Hello Ananya, could you clarify whether the monthly maintenance charges are included?',
        timestamp: 'Yesterday, 4:10 PM',
      },
      {
        id: 'm22',
        sender: 'owner',
        text: 'The maintenance fee and covered parking slot are included.',
        timestamp: 'Yesterday, 5:45 PM',
      },
    ],
  },
  {
    id: 'conv-3',
    ownerName: 'Sunil Verma',
    propertyName: 'Minimalist 4 BHK Courtyard Villa with Pool',
    propertyPrice: '₹3.75 Cr',
    avatarInitials: 'SV',
    lastMessage: 'We have registered title clearance documents available for verification.',
    time: 'Oct 01',
    unreadCount: 0,
    messages: [
      {
        id: 'm31',
        sender: 'user',
        text: 'Good day Sunil, are the property title and approvals verified by legal counsel?',
        timestamp: 'Oct 01, 10:00 AM',
      },
      {
        id: 'm32',
        sender: 'owner',
        text: 'We have registered title clearance documents available for verification.',
        timestamp: 'Oct 01, 11:30 AM',
      },
    ],
  },
];

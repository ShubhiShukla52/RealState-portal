export type InquiryStatus =
  | 'pending'
  | 'contacted'
  | 'visit_requested'
  | 'visit_confirmed'
  | 'completed'
  | 'cancelled'
  | 'closed';

export type InquiryType = 'general' | 'visit' | 'price' | 'availability';

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  propertyLocation?: string;
  propertyPrice?: number;
  listingType?: 'sale' | 'rent';

  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;

  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;

  type: InquiryType;
  message: string;

  preferredDate?: string;
  preferredTime?: string;

  status: InquiryStatus;

  createdAt: string;
  updatedAt: string;

  ownerResponse?: string;
  ownerResponseAt?: string;
  notes?: string;
}

export type InquiryFilterStatus = 'all' | InquiryStatus;

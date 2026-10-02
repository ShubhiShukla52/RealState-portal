import { PropertyInquiry, InquiryStatus, InquiryType } from '../types/inquiry';

/**
 * Returns human-friendly label for inquiry status
 */
export const getInquiryStatusLabel = (status: InquiryStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'contacted':
      return 'Contacted';
    case 'visit_requested':
      return 'Visit Requested';
    case 'visit_confirmed':
      return 'Visit Confirmed';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
};

/**
 * Returns human-friendly label for inquiry type
 */
export const getInquiryTypeLabel = (type: InquiryType): string => {
  switch (type) {
    case 'visit':
      return 'Visit Request';
    case 'price':
      return 'Price Inquiry';
    case 'availability':
      return 'Availability';
    case 'general':
      return 'General Question';
    default:
      return type;
  }
};

/**
 * Filter inquiries that have future or confirmed visits, ordered by preferredDate
 */
export const getUpcomingVisits = (inquiries: PropertyInquiry[]): PropertyInquiry[] => {
  return inquiries
    .filter(
      (inq) =>
        inq.type === 'visit' &&
        (inq.status === 'visit_requested' || inq.status === 'visit_confirmed') &&
        Boolean(inq.preferredDate)
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.preferredDate}T12:00:00Z`).getTime();
      const dateB = new Date(`${b.preferredDate}T12:00:00Z`).getTime();
      return dateA - dateB;
    });
};

/**
 * Calculate aggregated inquiry statistics
 */
export const getInquiryCounts = (inquiries: PropertyInquiry[]) => {
  const total = inquiries.length;
  const pending = inquiries.filter((i) => i.status === 'pending').length;
  const visitRequests = inquiries.filter(
    (i) => i.status === 'visit_requested'
  ).length;
  const confirmedVisits = inquiries.filter(
    (i) => i.status === 'visit_confirmed'
  ).length;
  const completed = inquiries.filter((i) => i.status === 'completed').length;
  const cancelled = inquiries.filter((i) => i.status === 'cancelled').length;

  return {
    total,
    pending,
    visitRequests,
    confirmedVisits,
    completed,
    cancelled,
  };
};

/**
 * Lookup single inquiry by ID
 */
export const getInquiryById = (
  inquiries: PropertyInquiry[],
  id: string
): PropertyInquiry | undefined => {
  return inquiries.find((i) => i.id === id);
};

/**
 * Filter inquiries by status and search keyword
 */
export const filterInquiries = (
  inquiries: PropertyInquiry[],
  filters: {
    status?: string;
    search?: string;
  }
): PropertyInquiry[] => {
  return inquiries.filter((item) => {
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'visit_requests') {
        if (item.status !== 'visit_requested') return false;
      } else if (filters.status === 'confirmed') {
        if (item.status !== 'visit_confirmed') return false;
      } else if (item.status !== filters.status) {
        return false;
      }
    }

    // Search query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const matchTitle = item.propertyTitle.toLowerCase().includes(q);
      const matchLocation = item.propertyLocation?.toLowerCase().includes(q) || false;
      const matchId = item.id.toLowerCase().includes(q);
      const matchOwner = item.ownerName?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchLocation && !matchId && !matchOwner) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort inquiries list
 */
export const sortInquiries = (
  inquiries: PropertyInquiry[],
  sortBy: 'newest' | 'oldest' | 'date' = 'newest'
): PropertyInquiry[] => {
  const copy = [...inquiries];
  switch (sortBy) {
    case 'oldest':
      return copy.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'date':
      return copy.sort((a, b) => {
        const timeA = a.preferredDate
          ? new Date(a.preferredDate).getTime()
          : new Date(a.createdAt).getTime();
        const timeB = b.preferredDate
          ? new Date(b.preferredDate).getTime()
          : new Date(b.createdAt).getTime();
        return timeA - timeB;
      });
    case 'newest':
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
};

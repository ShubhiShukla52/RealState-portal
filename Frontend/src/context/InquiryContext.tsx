import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PropertyInquiry, InquiryStatus, InquiryType } from '../types/inquiry';
import { mockInquiries } from '../data/mockInquiries';
import { useMessaging } from './MessagingContext';

const STORAGE_KEY = 'estatex_inquiries';

export interface AddInquiryPayload {
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  propertyLocation?: string;
  propertyPrice?: number;
  listingType?: 'sale' | 'rent';

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
  status?: InquiryStatus;
  notes?: string;
}

export interface InquiryContextType {
  inquiries: PropertyInquiry[];
  addInquiry: (payload: AddInquiryPayload) => PropertyInquiry;
  updateInquiry: (id: string, updates: Partial<PropertyInquiry>) => void;
  cancelInquiry: (id: string) => void;
  getInquiryById: (id: string) => PropertyInquiry | undefined;
  getUserInquiries: (userId?: string) => PropertyInquiry[];
  getPropertyInquiries: (propertyId: string) => PropertyInquiry[];
  getPendingCount: () => number;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useMessaging();

  // Initialize from localStorage or mockInquiries
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse errors
    }
    return mockInquiries;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries to localStorage', e);
    }
  }, [inquiries]);

  // Add inquiry
  const addInquiry = useCallback(
    (payload: AddInquiryPayload): PropertyInquiry => {
      const nowIso = new Date().toISOString();
      const defaultStatus: InquiryStatus =
        payload.type === 'visit' ? 'visit_requested' : 'pending';

      const newInquiry: PropertyInquiry = {
        id: `inq-${Date.now()}`,
        propertyId: payload.propertyId,
        propertyTitle: payload.propertyTitle,
        propertyImage: payload.propertyImage,
        propertyLocation: payload.propertyLocation,
        propertyPrice: payload.propertyPrice,
        listingType: payload.listingType,
        userId: 'current-user',
        userName: payload.userName,
        userEmail: payload.userEmail,
        userPhone: payload.userPhone,
        ownerId: payload.ownerId,
        ownerName: payload.ownerName,
        ownerPhone: payload.ownerPhone,
        type: payload.type,
        message: payload.message,
        preferredDate: payload.preferredDate,
        preferredTime: payload.preferredTime,
        status: payload.status || defaultStatus,
        createdAt: nowIso,
        updatedAt: nowIso,
        notes: payload.notes,
      };

      setInquiries((prev) => [newInquiry, ...prev]);

      // Push contextual notification
      if (payload.type === 'visit') {
        addNotification({
          type: 'inquiry',
          title: 'Visit request submitted',
          message: `Your visit request for "${payload.propertyTitle}" is awaiting confirmation from the owner.`,
          link: `/inquiries/${newInquiry.id}`,
          propertyId: payload.propertyId,
        });
      } else {
        addNotification({
          type: 'inquiry',
          title: 'Inquiry submitted',
          message: `Your inquiry for "${payload.propertyTitle}" was submitted.`,
          link: `/inquiries/${newInquiry.id}`,
          propertyId: payload.propertyId,
        });
      }

      // Simulate mock owner reply after a short delay for visit requests
      if (payload.type === 'visit') {
        setTimeout(() => {
          setInquiries((prev) =>
            prev.map((item) => {
              if (item.id === newInquiry.id && item.status === 'visit_requested') {
                return {
                  ...item,
                  status: 'visit_confirmed',
                  updatedAt: new Date().toISOString(),
                  ownerResponse: `Confirmed! We will be delighted to show you "${payload.propertyTitle}" on ${payload.preferredDate} at ${payload.preferredTime}. Please arrive 10 minutes prior at the main gate.`,
                  ownerResponseAt: new Date().toISOString(),
                };
              }
              return item;
            })
          );

          addNotification({
            type: 'inquiry',
            title: 'Visit request confirmed',
            message: `The owner confirmed your visit request for "${payload.propertyTitle}" on ${payload.preferredDate}.`,
            link: `/inquiries/${newInquiry.id}`,
            propertyId: payload.propertyId,
          });
        }, 15000);
      }

      return newInquiry;
    },
    [addNotification]
  );

  // Update inquiry
  const updateInquiry = useCallback(
    (id: string, updates: Partial<PropertyInquiry>) => {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      );
    },
    []
  );

  // Cancel inquiry
  const cancelInquiry = useCallback(
    (id: string) => {
      let cancelledItem: PropertyInquiry | undefined;
      setInquiries((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            cancelledItem = {
              ...item,
              status: 'cancelled',
              updatedAt: new Date().toISOString(),
            };
            return cancelledItem;
          }
          return item;
        })
      );

      if (cancelledItem) {
        addNotification({
          type: 'inquiry',
          title: 'Request cancelled',
          message: `Your inquiry/visit request for "${(cancelledItem as PropertyInquiry).propertyTitle}" was cancelled.`,
          link: `/inquiries/${id}`,
          propertyId: (cancelledItem as PropertyInquiry).propertyId,
        });
      }
    },
    [addNotification]
  );

  // Get inquiry by ID
  const getInquiryById = useCallback(
    (id: string) => {
      return inquiries.find((i) => i.id === id);
    },
    [inquiries]
  );

  // Get user inquiries
  const getUserInquiries = useCallback(
    (userId: string = 'current-user') => {
      return inquiries.filter((i) => i.userId === userId);
    },
    [inquiries]
  );

  // Get property inquiries
  const getPropertyInquiries = useCallback(
    (propertyId: string) => {
      return inquiries.filter((i) => i.propertyId === propertyId);
    },
    [inquiries]
  );

  // Pending count for dashboard badges
  const getPendingCount = useCallback(() => {
    return inquiries.filter(
      (i) => i.status === 'pending' || i.status === 'visit_requested'
    ).length;
  }, [inquiries]);

  const value = useMemo(
    () => ({
      inquiries,
      addInquiry,
      updateInquiry,
      cancelInquiry,
      getInquiryById,
      getUserInquiries,
      getPropertyInquiries,
      getPendingCount,
    }),
    [
      inquiries,
      addInquiry,
      updateInquiry,
      cancelInquiry,
      getInquiryById,
      getUserInquiries,
      getPropertyInquiries,
      getPendingCount,
    ]
  );

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
};

export const useInquiries = (): InquiryContextType => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiries must be used within an InquiryProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Property } from '../types/property';
import { mockProperties } from '../data/mockProperties';

const STORAGE_KEY = 'estatex_recently_viewed';
const MAX_RECENT = 10;

export interface RecentlyViewedItem {
  propertyId: string;
  viewedAt: string;
}

export interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedItem[];
  recentlyViewedProperties: Property[];
  trackView: (propertyId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Safe fallback on localStorage errors
    }
    // Initial demo view history
    return [
      { propertyId: mockProperties[0]?.id || 'prop-001', viewedAt: new Date(Date.now() - 3600000).toISOString() },
      { propertyId: mockProperties[1]?.id || 'prop-002', viewedAt: new Date(Date.now() - 7200000).toISOString() },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch {
      // Safe handle storage errors
    }
  }, [recentlyViewed]);

  const trackView = useCallback((propertyId: string) => {
    setRecentlyViewed((prev) => {
      // Remove any existing entry for this property
      const filtered = prev.filter((item) => item.propertyId !== propertyId);
      // Place new view at top, limit to MAX_RECENT
      const updated = [{ propertyId, viewedAt: new Date().toISOString() }, ...filtered];
      return updated.slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  const recentlyViewedProperties = useMemo(() => {
    return recentlyViewed
      .map((item) => mockProperties.find((p) => p.id === item.propertyId))
      .filter((p): p is Property => Boolean(p));
  }, [recentlyViewed]);

  const value = useMemo(
    () => ({
      recentlyViewed,
      recentlyViewedProperties,
      trackView,
      clearRecentlyViewed,
    }),
    [recentlyViewed, recentlyViewedProperties, trackView, clearRecentlyViewed]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = (): RecentlyViewedContextType => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

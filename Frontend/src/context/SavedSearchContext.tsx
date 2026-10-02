import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SavedSearch } from '../types/savedSearch';
import { PropertySearchFilters } from '../types/search';
import { initialMockSavedSearches } from '../data/mockSavedSearches';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'estatex_saved_searches';

export interface SavedSearchContextType {
  savedSearches: SavedSearch[];
  savedSearchesCount: number;
  saveSearch: (name: string, filters: PropertySearchFilters, resultCount: number) => void;
  deleteSavedSearch: (id: string) => void;
  clearSavedSearches: () => void;
}

const SavedSearchContext = createContext<SavedSearchContextType | undefined>(undefined);

export const SavedSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Safe fallback
    }
    return initialMockSavedSearches;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
    } catch {
      // Safe handle storage errors
    }
  }, [savedSearches]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  const saveSearch = useCallback(
    (name: string, filters: PropertySearchFilters, resultCount: number) => {
      const newSearch: SavedSearch = {
        id: `search-${Date.now()}`,
        name: name.trim() || 'Custom Search',
        filters: { ...filters },
        createdAt: new Date().toISOString().split('T')[0],
        resultCount,
      };

      setSavedSearches((prev) => [newSearch, ...prev]);
      showToast('Search saved to your dashboard');
    },
    [showToast]
  );

  const deleteSavedSearch = useCallback(
    (id: string) => {
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
      showToast('Saved search removed');
    },
    [showToast]
  );

  const clearSavedSearches = useCallback(() => {
    setSavedSearches([]);
    showToast('All saved searches cleared');
  }, [showToast]);

  const value = useMemo(
    () => ({
      savedSearches,
      savedSearchesCount: savedSearches.length,
      saveSearch,
      deleteSavedSearch,
      clearSavedSearches,
    }),
    [savedSearches, saveSearch, deleteSavedSearch, clearSavedSearches]
  );

  return (
    <SavedSearchContext.Provider value={value}>
      {children}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#171717] text-white rounded-xl shadow-xl border border-white/10 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-[#C66A4A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </SavedSearchContext.Provider>
  );
};

export const useSavedSearch = (): SavedSearchContextType => {
  const context = useContext(SavedSearchContext);
  if (!context) {
    throw new Error('useSavedSearch must be used within a SavedSearchProvider');
  }
  return context;
};

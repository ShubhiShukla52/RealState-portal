import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { FavoriteProperty } from '../types/favorite';
import { Property } from '../types/property';
import { mockProperties } from '../data/mockProperties';
import { CheckCircle2, HeartCrack } from 'lucide-react';

const STORAGE_KEY = 'estatex_favorites';

interface ToastMessage {
  id: number;
  text: string;
  type: 'added' | 'removed';
}

export interface FavoritesContextType {
  favorites: FavoriteProperty[];
  favoriteProperties: Property[];
  favoritesCount: number;
  isFavorite: (propertyId: string) => boolean;
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  toggleFavorite: (propertyId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Initial fallback favorites from mock properties
const initialDefaultFavorites: FavoriteProperty[] = [
  { propertyId: mockProperties[0]?.id || 'prop-001', savedAt: '2026-09-28' },
  { propertyId: mockProperties[1]?.id || 'prop-002', savedAt: '2026-09-29' },
  { propertyId: mockProperties[2]?.id || 'prop-003', savedAt: '2026-09-30' },
  { propertyId: mockProperties[3]?.id || 'prop-004', savedAt: '2026-10-01' },
];

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>(() => {
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
    return initialDefaultFavorites;
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Safe handle storage quota or private browsing errors
    }
  }, [favorites]);

  const showToast = useCallback((text: string, type: 'added' | 'removed') => {
    const id = Date.now();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2400);
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => {
      return favorites.some((f) => f.propertyId === propertyId);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (propertyId: string) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.propertyId === propertyId)) {
          return prev;
        }
        return [{ propertyId, savedAt: new Date().toISOString() }, ...prev];
      });
      showToast('Property saved to favorites', 'added');
    },
    [showToast]
  );

  const removeFavorite = useCallback(
    (propertyId: string) => {
      setFavorites((prev) => prev.filter((f) => f.propertyId !== propertyId));
      showToast('Property removed from favorites', 'removed');
    },
    [showToast]
  );

  const toggleFavorite = useCallback(
    (propertyId: string) => {
      if (isFavorite(propertyId)) {
        removeFavorite(propertyId);
      } else {
        addFavorite(propertyId);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    showToast('All saved properties cleared', 'removed');
  }, [showToast]);

  const favoriteProperties = useMemo(() => {
    return favorites
      .map((fav) => mockProperties.find((p) => p.id === fav.propertyId))
      .filter((p): p is Property => Boolean(p));
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      favoriteProperties,
      favoritesCount: favorites.length,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [favorites, favoriteProperties, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}

      {/* Subtle EstateX Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#171717] text-white rounded-xl shadow-xl border border-white/10 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'added' ? (
            <CheckCircle2 className="w-4 h-4 text-[#C66A4A] shrink-0" />
          ) : (
            <HeartCrack className="w-4 h-4 text-[#A3A3A3] shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

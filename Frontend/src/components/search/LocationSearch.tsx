import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, History, Building2, Compass } from 'lucide-react';
import { getSearchSuggestions, POPULAR_LOCATIONS } from '../../data/mockLocations';

export interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelectLocation?: (locationName: string, city: string, locality?: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
}

interface RecentSearchItem {
  id: string;
  name: string;
  city: string;
  locality?: string;
  timestamp: string;
}

const STORAGE_KEY = 'estatex_recent_searches';

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onSelectLocation,
  placeholder = 'City, locality or area...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }
    } catch {
      // Fallback if storage fails or is blocked
    }
  }, []);

  // Save to recent searches
  const saveRecentSearch = (name: string, city: string, locality?: string) => {
    try {
      const updated: RecentSearchItem[] = [
        {
          id: `${city}-${locality || 'all'}-${Date.now()}`,
          name,
          city,
          locality,
          timestamp: 'Recent',
        },
        ...recentSearches.filter((item) => item.name.toLowerCase() !== name.toLowerCase()),
      ].slice(0, 5);

      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item.id !== id);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions based on user input
  const suggestions = value.trim() ? getSearchSuggestions(value) : [];

  const handleSelect = (name: string, city: string, locality?: string, lat?: number, lng?: number) => {
    onChange(name);
    saveRecentSearch(name, city, locality);
    if (onSelectLocation) {
      onSelectLocation(name, city, locality, lat, lng);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    const currentItemsCount = value.trim()
      ? suggestions.length
      : recentSearches.length + POPULAR_LOCATIONS.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < currentItemsCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : currentItemsCount - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        if (value.trim() && suggestions[highlightedIndex]) {
          const item = suggestions[highlightedIndex];
          handleSelect(item.name, item.city, item.locality, item.latitude, item.longitude);
        } else if (!value.trim()) {
          if (highlightedIndex < recentSearches.length) {
            const item = recentSearches[highlightedIndex];
            handleSelect(item.name, item.city, item.locality);
          } else {
            const popIndex = highlightedIndex - recentSearches.length;
            const popCity = POPULAR_LOCATIONS[popIndex];
            if (popCity) handleSelect(popCity, popCity);
          }
        }
      } else if (value.trim()) {
        handleSelect(value.trim(), value.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3.5 w-4 h-4 text-[#C66A4A] pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Location search"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E2E2DF] rounded-xl text-sm text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent transition-all shadow-sm"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear location input"
            className="absolute right-3 w-5 h-5 rounded-full hover:bg-[#F5F5F2] flex items-center justify-center text-[#737373] hover:text-[#171717] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[#E2E2DF] rounded-xl shadow-xl max-h-80 overflow-y-auto divide-y divide-[#F5F5F2] animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Active search suggestions */}
          {value.trim() ? (
            <div>
              <div className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] bg-[#FAFAF8]">
                Location Suggestions
              </div>
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleSelect(item.name, item.city, item.locality, item.latitude, item.longitude)
                      }
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors ${
                        isHighlighted ? 'bg-[#F5F5F2]' : 'hover:bg-[#FAFAF8]'
                      }`}
                    >
                      {item.type === 'city' ? (
                        <Building2 className="w-4 h-4 text-[#171717] mt-0.5 shrink-0" />
                      ) : (
                        <Compass className="w-4 h-4 text-[#C66A4A] mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-[#222222] truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#737373] truncate">{item.subtext}</div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#A3A3A3] px-1.5 py-0.5 rounded bg-[#F5F5F2] mt-0.5">
                        {item.type}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-4 text-center text-xs text-[#737373]">
                  No matching city or locality found for &quot;{value}&quot;. Press Enter to search anyway.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] bg-[#FAFAF8] flex items-center justify-between">
                    <span>Recent Searches</span>
                    <History className="w-3 h-3 text-[#A3A3A3]" />
                  </div>
                  {recentSearches.map((item, index) => {
                    const isHighlighted = highlightedIndex === index;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item.name, item.city, item.locality)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`px-3.5 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                          isHighlighted ? 'bg-[#F5F5F2]' : 'hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <History className="w-3.5 h-3.5 text-[#A3A3A3] shrink-0" />
                          <span className="text-sm font-medium text-[#222222] truncate">
                            {item.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, item.id)}
                          aria-label={`Remove recent search for ${item.name}`}
                          className="w-5 h-5 rounded-full hover:bg-[#E2E2DF] flex items-center justify-center text-[#A3A3A3] hover:text-[#171717] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Popular Indian Cities */}
              <div>
                <div className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] bg-[#FAFAF8]">
                  Popular Metro Areas
                </div>
                <div className="p-2 grid grid-cols-2 gap-1.5">
                  {POPULAR_LOCATIONS.map((popCity, idx) => {
                    const itemIdx = recentSearches.length + idx;
                    const isHighlighted = highlightedIndex === itemIdx;
                    return (
                      <button
                        key={popCity}
                        type="button"
                        onClick={() => handleSelect(popCity, popCity)}
                        onMouseEnter={() => setHighlightedIndex(itemIdx)}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#222222] flex items-center gap-1.5 transition-colors ${
                          isHighlighted ? 'bg-[#F5F5F2] text-[#171717]' : 'hover:bg-[#F5F5F2]'
                        }`}
                      >
                        <Building2 className="w-3 h-3 text-[#C66A4A] shrink-0" />
                        <span className="truncate">{popCity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

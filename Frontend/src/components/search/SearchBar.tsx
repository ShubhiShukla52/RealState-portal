import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PropertySearchFilters } from '../../types/search';
import { LocationSearch } from './LocationSearch';
import { Button } from '../ui/Button';

export interface SearchBarProps {
  filters: PropertySearchFilters;
  onFilterChange: (key: keyof PropertySearchFilters, value: any) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  className?: string;
}

const PROPERTY_TYPES = [
  { value: '', label: 'All Property Types' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'House', label: 'House' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Plot', label: 'Plot' },
  { value: 'Commercial', label: 'Commercial' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
  onOpenFilters,
  activeFilterCount = 0,
  className = '',
}) => {
  return (
    <form
      onSubmit={onSearchSubmit}
      className={`bg-white border border-[#E2E2DF] rounded-2xl p-3 sm:p-4 shadow-sm mb-6 ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* 1. Location Autocomplete (Span 4) */}
        <div className="lg:col-span-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1">
            Location / City / Locality
          </label>
          <LocationSearch
            value={filters.location}
            onChange={(val) => {
              onFilterChange('location', val);
              onFilterChange('city', '');
              onFilterChange('locality', '');
            }}
            onSelectLocation={(name, city, locality) => {
              onFilterChange('location', name);
              onFilterChange('city', city);
              if (locality) onFilterChange('locality', locality);
            }}
            placeholder="Search Bareilly, Delhi, Koramangala..."
          />
        </div>

        {/* 2. Property Type (Span 3) */}
        <div className="lg:col-span-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E2E2DF] rounded-xl text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717] transition-all shadow-xs"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Listing Type (Span 2) */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1">
            Listing Type
          </label>
          <div className="flex bg-[#F5F5F2] p-1 rounded-xl border border-[#E2E2DF]">
            <button
              type="button"
              onClick={() => onFilterChange('listingType', '')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !filters.listingType
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('listingType', 'sale')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filters.listingType === 'sale'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('listingType', 'rent')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filters.listingType === 'rent'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* 4. Actions: Filters Toggle & Search Button (Span 3) */}
        <div className="lg:col-span-3 flex items-center gap-2 pt-1 sm:pt-0">
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="relative px-3.5 py-2.5 rounded-xl border border-[#E2E2DF] hover:border-[#171717] bg-white text-xs font-semibold text-[#222222] flex items-center gap-2 transition-all shrink-0 mt-auto"
              aria-label="Open advanced filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C66A4A]" />
              <span className="hidden xl:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1 mt-auto py-2.5 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

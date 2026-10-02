import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PropertyFilterState } from '../../../types/property';

export interface PropertyFiltersProps {
  filters: PropertyFilterState;
  onFilterChange: (key: keyof PropertyFilterState, value: string) => void;
  onClearAll: () => void;
  onApply?: () => void;
  isMobileModal?: boolean;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  onApply,
  isMobileModal = false,
}) => {
  const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Plot', 'Commercial'];
  const bedroomOptions = [
    { label: 'Any', value: 'any' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
  ];
  const bathroomOptions = [
    { label: 'Any', value: 'any' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
  ];

  return (
    <div className={`space-y-6 ${isMobileModal ? 'p-1' : 'bg-white rounded-2xl border border-[#E2E2DF] p-5 shadow-sm'}`}>
      {!isMobileModal && (
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DF]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C66A4A]" />
            <h2 className="text-base font-bold text-[#222222]">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-[#737373] hover:text-[#C66A4A] inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        </div>
      )}

      {/* Listing Type Filter (Sale / Rent) */}
      <div>
        <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2.5">
          Listing Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F5F2] rounded-lg border border-[#E2E2DF]">
          {['all', 'sale', 'rent'].map((type) => {
            const isSelected = (!filters.listingType && type === 'all') || filters.listingType === type;
            const label = type === 'all' ? 'All' : type === 'sale' ? 'Sale' : 'Rent';
            return (
              <button
                key={type}
                type="button"
                onClick={() => onFilterChange('listingType', type === 'all' ? '' : type)}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label htmlFor="filter-location-sidebar" className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
          Location
        </label>
        <input
          id="filter-location-sidebar"
          type="text"
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          placeholder="City, locality, or landmark"
          className="w-full px-3 py-2 text-sm rounded-lg border border-[#A3A3A3] text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
        />
      </div>

      {/* Property Type Filter */}
      <div>
        <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2.5">
          Property Type
        </label>
        <div className="space-y-1.5">
          {propertyTypes.map((type) => {
            const value = type === 'All' ? '' : type;
            const isSelected = (!filters.propertyType && type === 'All') || filters.propertyType.toLowerCase() === type.toLowerCase();
            return (
              <label
                key={type}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#F8EBE6] text-[#C66A4A] font-semibold border border-[#C66A4A]/20'
                    : 'text-[#222222] hover:bg-[#F5F5F2]'
                }`}
              >
                <span>{type}</span>
                <input
                  type="radio"
                  name="propertyType"
                  value={value}
                  checked={isSelected}
                  onChange={() => onFilterChange('propertyType', value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
          Price Range (INR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            placeholder="Min Price"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#A3A3A3] text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            placeholder="Max Price"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#A3A3A3] text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
        </div>
      </div>

      {/* Bedrooms Filter */}
      <div>
        <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2.5">
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1">
          {bedroomOptions.map((opt) => {
            const isSelected = (!filters.bedrooms && opt.value === 'any') || filters.bedrooms === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('bedrooms', opt.value === 'any' ? '' : opt.value)}
                className={`py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:bg-[#F5F5F2]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bathrooms Filter */}
      <div>
        <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2.5">
          Bathrooms
        </label>
        <div className="grid grid-cols-4 gap-1">
          {bathroomOptions.map((opt) => {
            const isSelected = (!filters.bathrooms && opt.value === 'any') || filters.bathrooms === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('bathrooms', opt.value === 'any' ? '' : opt.value)}
                className={`py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:bg-[#F5F5F2]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area Filter (sq.ft) */}
      <div>
        <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
          Area (sq.ft)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={filters.minArea}
            onChange={(e) => onFilterChange('minArea', e.target.value)}
            placeholder="Min sq.ft"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#A3A3A3] text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
          <input
            type="number"
            value={filters.maxArea}
            onChange={(e) => onFilterChange('maxArea', e.target.value)}
            placeholder="Max sq.ft"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#A3A3A3] text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
        </div>
      </div>

      {/* Action Buttons for Mobile / Sidebar */}
      <div className="pt-2 flex flex-col gap-2">
        {onApply && (
          <Button variant="primary" size="md" onClick={onApply} className="w-full">
            Apply Filters
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onClearAll} className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
};

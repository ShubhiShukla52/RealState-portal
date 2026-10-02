import React from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { PropertySearchFilters } from '../../types/search';
import { Button } from '../ui/Button';

export interface AdvancedFilterPanelProps {
  filters: PropertySearchFilters;
  onFilterChange: (key: keyof PropertySearchFilters, value: any) => void;
  onApply?: () => void;
  onReset: () => void;
  isMobileDrawer?: boolean;
  onClose?: () => void;
  className?: string;
}

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'];

const BEDROOM_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
];

const BATHROOM_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
];

const RADIUS_OPTIONS = [
  { value: '', label: 'Any Radius' },
  { value: '1', label: 'Within 1 km' },
  { value: '5', label: 'Within 5 km' },
  { value: '10', label: 'Within 10 km' },
  { value: '25', label: 'Within 25 km' },
  { value: '50', label: 'Within 50 km' },
];

const FURNISHING_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'Unfurnished', label: 'Unfurnished' },
  { value: 'Semi-Furnished', label: 'Semi Furnished' },
  { value: 'Furnished', label: 'Fully Furnished' },
];

const ALL_AMENITIES = [
  'Balcony',
  'Covered Parking',
  'Power Backup',
  'Security',
  'Lift',
  'Swimming Pool',
  'Gym',
  'Garden',
  'CCTV',
  'Club House',
  'Kids Play Area',
  'Air Conditioning',
  'Internet',
  'Water Supply',
];

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  isMobileDrawer = false,
  onClose,
  className = '',
}) => {
  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || [];
    const exists = current.includes(amenity);
    const updated = exists
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onFilterChange('amenities', updated);
  };

  const content = (
    <div className="space-y-6">
      {/* Header for Desktop or Mobile */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E2DF]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C66A4A]" />
          <h2 className="text-base font-bold text-[#171717]">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-[#737373] hover:text-[#C66A4A] transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {isMobileDrawer && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="p-1 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Listing Type (Sale / Rent) */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Listing Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onFilterChange('listingType', filters.listingType === 'sale' ? '' : 'sale')
            }
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
              filters.listingType === 'sale'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
            }`}
          >
            For Sale
          </button>
          <button
            type="button"
            onClick={() =>
              onFilterChange('listingType', filters.listingType === 'rent' ? '' : 'rent')
            }
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
              filters.listingType === 'rent'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Property Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = filters.propertyType.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => onFilterChange('propertyType', isSelected ? '' : type)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius (Location Proximity) */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Search Radius (from Location)
        </label>
        <select
          value={filters.radius}
          onChange={(e) => onFilterChange('radius', e.target.value)}
          className="w-full px-3 py-2 bg-white border border-[#E2E2DF] rounded-lg text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717]"
        >
          {RADIUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E2E2DF] rounded-lg text-xs text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E2E2DF] rounded-lg text-xs text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {BEDROOM_OPTIONS.map((opt) => {
            const isSelected =
              filters.bedrooms === opt.value || (!filters.bedrooms && opt.value === 'any');
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('bedrooms', opt.value === 'any' ? '' : opt.value)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all text-center ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Bathrooms
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {BATHROOM_OPTIONS.map((opt) => {
            const isSelected =
              filters.bathrooms === opt.value || (!filters.bathrooms && opt.value === 'any');
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('bathrooms', opt.value === 'any' ? '' : opt.value)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all text-center ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Built-up Area */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Area (sq.ft)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min sq.ft"
            value={filters.minArea}
            onChange={(e) => onFilterChange('minArea', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E2E2DF] rounded-lg text-xs text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
          <input
            type="number"
            placeholder="Max sq.ft"
            value={filters.maxArea}
            onChange={(e) => onFilterChange('maxArea', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E2E2DF] rounded-lg text-xs text-[#222222] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717]"
          />
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Furnishing
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {FURNISHING_OPTIONS.map((opt) => {
            const isSelected =
              filters.furnishing === opt.value || (!filters.furnishing && opt.value === 'any');
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('furnishing', opt.value === 'any' ? '' : opt.value)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-left truncate transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Parking */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Parking
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange('parking', '')}
            className={`py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
              !filters.parking || filters.parking === 'any'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
            }`}
          >
            Any
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('parking', 'yes')}
            className={`py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
              filters.parking === 'yes'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
            }`}
          >
            Reserved Parking
          </button>
        </div>
      </div>

      {/* Property Status */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Property Status
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {['Available', 'Sold', 'Rented'].map((st) => {
            const isSelected = filters.status.toLowerCase() === st.toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange('status', isSelected ? '' : st)}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALL_AMENITIES.map((amenity) => {
            const isChecked = (filters.amenities || []).includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left border transition-all ${
                  isChecked
                    ? 'bg-[#F8EBE6] text-[#C66A4A] border-[#C66A4A]/40 font-semibold'
                    : 'bg-white text-[#222222] border-[#E2E2DF] hover:border-[#171717]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                    isChecked
                      ? 'bg-[#C66A4A] border-[#C66A4A] text-white'
                      : 'border-[#A3A3A3] bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </div>
                <span className="truncate">{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#E2E2DF] flex items-center gap-2">
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          onClick={() => {
            if (onApply) onApply();
            if (isMobileDrawer && onClose) onClose();
          }}
        >
          Apply Filters
        </Button>
        <Button variant="outline" size="md" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
        <div
          className="w-full max-w-md bg-white h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-label="Filter properties"
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#E2E2DF] rounded-xl p-5 shadow-xs ${className}`}>
      {content}
    </div>
  );
};

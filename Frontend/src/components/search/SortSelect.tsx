import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PropertySortOption } from '../../types/property';

export interface SortSelectProps {
  value: PropertySortOption;
  onChange: (value: PropertySortOption) => void;
  className?: string;
}

const SORT_OPTIONS: { value: PropertySortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-asc', label: 'Area: Small to Large' },
  { value: 'area-desc', label: 'Area: Large to Small' },
];

export const SortSelect: React.FC<SortSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <label htmlFor="property-sort-select" className="text-xs text-[#737373] font-medium hidden sm:inline whitespace-nowrap">
        Sort by:
      </label>
      <div className="relative flex items-center">
        <ArrowUpDown className="absolute left-2.5 w-3.5 h-3.5 text-[#737373] pointer-events-none" />
        <select
          id="property-sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as PropertySortOption)}
          aria-label="Sort properties"
          className="appearance-none pl-8 pr-7 py-1.5 bg-white border border-[#E2E2DF] rounded-lg text-xs font-semibold text-[#222222] hover:border-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] cursor-pointer transition-colors shadow-xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

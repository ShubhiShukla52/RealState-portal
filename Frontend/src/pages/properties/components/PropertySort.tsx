import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PropertySortOption } from '../../../types/property';

export interface PropertySortProps {
  value: PropertySortOption;
  onChange: (value: PropertySortOption) => void;
}

export const PropertySort: React.FC<PropertySortProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-[#737373] hidden sm:inline-block">
        Sort By:
      </span>
      <div className="relative inline-flex items-center">
        <select
          id="property-sort-select"
          aria-label="Sort properties"
          value={value}
          onChange={(e) => onChange(e.target.value as PropertySortOption)}
          className="appearance-none pl-3 pr-8 py-2 bg-white border border-[#E2E2DF] rounded-lg text-xs font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717] hover:border-[#A3A3A3] transition-colors cursor-pointer"
        >
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="area-asc">Area: Small to Large</option>
          <option value="area-desc">Area: Large to Small</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-[#737373] absolute right-2.5 pointer-events-none" />
      </div>
    </div>
  );
};

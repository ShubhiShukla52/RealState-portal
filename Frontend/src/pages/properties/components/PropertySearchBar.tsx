import React from 'react';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PropertyFilterState } from '../../../types/property';

export interface PropertySearchBarProps {
  filters: PropertyFilterState;
  onFilterChange: (key: keyof PropertyFilterState, value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const PropertySearchBar: React.FC<PropertySearchBarProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
}) => {
  return (
    <form
      onSubmit={onSearchSubmit}
      className="bg-white rounded-2xl border border-[#E2E2DF] shadow-sm p-4 sm:p-5 mb-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Keyword / General search */}
        <div className="lg:col-span-3">
          <label htmlFor="search-query" className="block text-xs font-semibold text-[#222222] mb-1.5">
            Search Keyword
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
              <Search className="w-4 h-4 text-[#C66A4A]" />
            </div>
            <input
              id="search-query"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              placeholder="e.g. Golf view, duplex, luxury"
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
            />
          </div>
        </div>

        {/* Location Field */}
        <div className="lg:col-span-2">
          <label htmlFor="location-filter" className="block text-xs font-semibold text-[#222222] mb-1.5">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <input
              id="location-filter"
              type="text"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              placeholder="City or locality"
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
            />
          </div>
        </div>

        {/* Property Type Field */}
        <div className="lg:col-span-2">
          <label htmlFor="type-filter" className="block text-xs font-semibold text-[#222222] mb-1.5">
            Property Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
              <Home className="w-3.5 h-3.5" />
            </div>
            <select
              id="type-filter"
              value={filters.propertyType}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] appearance-none"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Listing Type Field */}
        <div className="lg:col-span-2">
          <label htmlFor="listing-filter" className="block text-xs font-semibold text-[#222222] mb-1.5">
            Listing Type
          </label>
          <select
            id="listing-filter"
            value={filters.listingType}
            onChange={(e) => onFilterChange('listingType', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
          >
            <option value="">All Listings</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Max Price quick limit */}
        <div className="lg:col-span-2">
          <label htmlFor="max-price-filter" className="block text-xs font-semibold text-[#222222] mb-1.5">
            Max Price
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#A3A3A3]">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <select
              id="max-price-filter"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full pl-7 pr-2.5 py-2 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] appearance-none"
            >
              <option value="">Any Price</option>
              <option value="50000">₹50,000 /mo</option>
              <option value="100000">₹1 Lac /mo</option>
              <option value="10000000">₹1 Crore</option>
              <option value="25000000">₹2.5 Crore</option>
              <option value="50000000">₹5 Crore</option>
              <option value="100000000">₹10 Crore</option>
            </select>
          </div>
        </div>

        {/* Search Action */}
        <div className="lg:col-span-1">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Search}
            className="w-full h-[38px]"
            aria-label="Search properties"
          >
            Go
          </Button>
        </div>
      </div>
    </form>
  );
};

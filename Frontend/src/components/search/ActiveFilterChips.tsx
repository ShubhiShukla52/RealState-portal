import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { PropertySearchFilters } from '../../types/search';
import { formatPrice } from '../../utils/formatters';

export interface FilterChip {
  id: string;
  label: string;
  category: string;
  onRemove: () => void;
}

export interface ActiveFilterChipsProps {
  filters: PropertySearchFilters;
  onFilterChange: (key: keyof PropertySearchFilters, value: any) => void;
  onClearAll: () => void;
  className?: string;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  className = '',
}) => {
  const chips: FilterChip[] = [];

  // Search Query
  if (filters.searchQuery.trim()) {
    chips.push({
      id: 'query',
      label: `"${filters.searchQuery}"`,
      category: 'Keyword',
      onRemove: () => onFilterChange('searchQuery', ''),
    });
  }

  // Location / City / Locality
  if (filters.locality) {
    chips.push({
      id: 'locality',
      label: filters.locality,
      category: 'Locality',
      onRemove: () => onFilterChange('locality', ''),
    });
  } else if (filters.city) {
    chips.push({
      id: 'city',
      label: filters.city,
      category: 'City',
      onRemove: () => onFilterChange('city', ''),
    });
  } else if (filters.location.trim()) {
    chips.push({
      id: 'location',
      label: filters.location,
      category: 'Location',
      onRemove: () => onFilterChange('location', ''),
    });
  }

  // Radius
  if (filters.radius) {
    chips.push({
      id: 'radius',
      label: `Within ${filters.radius} km`,
      category: 'Radius',
      onRemove: () => onFilterChange('radius', ''),
    });
  }

  // Property Type
  if (filters.propertyType && filters.propertyType !== 'all') {
    chips.push({
      id: 'propertyType',
      label: filters.propertyType,
      category: 'Type',
      onRemove: () => onFilterChange('propertyType', ''),
    });
  }

  // Listing Type
  if (filters.listingType && filters.listingType !== 'all') {
    chips.push({
      id: 'listingType',
      label: filters.listingType.toLowerCase().includes('rent') ? 'For Rent' : 'For Sale',
      category: 'Listing',
      onRemove: () => onFilterChange('listingType', ''),
    });
  }

  // Price
  if (filters.minPrice || filters.maxPrice) {
    let priceLabel = '';
    if (filters.minPrice && filters.maxPrice) {
      priceLabel = `${formatPrice(Number(filters.minPrice))} - ${formatPrice(Number(filters.maxPrice))}`;
    } else if (filters.minPrice) {
      priceLabel = `Min ${formatPrice(Number(filters.minPrice))}`;
    } else {
      priceLabel = `Max ${formatPrice(Number(filters.maxPrice))}`;
    }
    chips.push({
      id: 'price',
      label: priceLabel,
      category: 'Budget',
      onRemove: () => {
        onFilterChange('minPrice', '');
        onFilterChange('maxPrice', '');
      },
    });
  }

  // Bedrooms
  if (filters.bedrooms && filters.bedrooms !== 'any') {
    chips.push({
      id: 'bedrooms',
      label: `${filters.bedrooms}+ BHK`,
      category: 'Bedrooms',
      onRemove: () => onFilterChange('bedrooms', ''),
    });
  }

  // Bathrooms
  if (filters.bathrooms && filters.bathrooms !== 'any') {
    chips.push({
      id: 'bathrooms',
      label: `${filters.bathrooms}+ Baths`,
      category: 'Bathrooms',
      onRemove: () => onFilterChange('bathrooms', ''),
    });
  }

  // Area
  if (filters.minArea || filters.maxArea) {
    let areaLabel = '';
    if (filters.minArea && filters.maxArea) {
      areaLabel = `${filters.minArea} - ${filters.maxArea} sq.ft`;
    } else if (filters.minArea) {
      areaLabel = `Min ${filters.minArea} sq.ft`;
    } else {
      areaLabel = `Max ${filters.maxArea} sq.ft`;
    }
    chips.push({
      id: 'area',
      label: areaLabel,
      category: 'Area',
      onRemove: () => {
        onFilterChange('minArea', '');
        onFilterChange('maxArea', '');
      },
    });
  }

  // Furnishing
  if (filters.furnishing && filters.furnishing !== 'any') {
    chips.push({
      id: 'furnishing',
      label: filters.furnishing,
      category: 'Furnishing',
      onRemove: () => onFilterChange('furnishing', ''),
    });
  }

  // Parking
  if (filters.parking && filters.parking !== 'any') {
    chips.push({
      id: 'parking',
      label: 'Parking Included',
      category: 'Parking',
      onRemove: () => onFilterChange('parking', ''),
    });
  }

  // Status
  if (filters.status && filters.status !== 'all') {
    chips.push({
      id: 'status',
      label: filters.status,
      category: 'Status',
      onRemove: () => onFilterChange('status', ''),
    });
  }

  // Amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach((amenity) => {
      chips.push({
        id: `amenity-${amenity}`,
        label: amenity,
        category: 'Amenity',
        onRemove: () => {
          const next = filters.amenities.filter((a) => a !== amenity);
          onFilterChange('amenities', next);
        },
      });
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 pt-1 ${className}`}>
      <span className="text-xs font-semibold text-[#737373] mr-1">Active Filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-[#F8EBE6] text-[#C66A4A] border border-[#C66A4A]/25 transition-all hover:border-[#C66A4A]/40"
        >
          <span className="font-medium">{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="w-4 h-4 rounded-full hover:bg-[#C66A4A]/20 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C66A4A]"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs text-[#737373] hover:text-[#C66A4A] underline font-medium ml-1 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear all</span>
      </button>
    </div>
  );
};

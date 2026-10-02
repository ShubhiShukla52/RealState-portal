import { PropertySearchFilters } from '../types/search';
import { formatPrice } from './formatters';

/**
 * Checks if user has set at least one meaningful search filter
 * (excluding default sort or empty values)
 */
export function hasMeaningfulFilters(filters: PropertySearchFilters): boolean {
  if (filters.searchQuery?.trim()) return true;
  if (filters.location?.trim()) return true;
  if (filters.city?.trim() && filters.city !== 'All') return true;
  if (filters.locality?.trim()) return true;
  if (filters.propertyType?.trim() && filters.propertyType !== 'All') return true;
  if (filters.listingType?.trim() && filters.listingType !== 'All') return true;
  if (filters.bedrooms?.trim() && filters.bedrooms !== 'All') return true;
  if (filters.bathrooms?.trim() && filters.bathrooms !== 'All') return true;
  if (filters.minPrice?.trim() || filters.maxPrice?.trim()) return true;
  if (filters.minArea?.trim() || filters.maxArea?.trim()) return true;
  if (filters.furnishing?.trim() && filters.furnishing !== 'All') return true;
  if (filters.parking?.trim() && filters.parking !== 'All') return true;
  if (filters.amenities && filters.amenities.length > 0) return true;
  if (filters.status?.trim() && filters.status !== 'All') return true;
  return false;
}

/**
 * Generates an array of short chips/tags describing the filter
 */
export function getFilterTags(filters: PropertySearchFilters): string[] {
  const tags: string[] = [];

  if (filters.bedrooms && filters.bedrooms !== 'All') {
    tags.push(`${filters.bedrooms}+ BHK`);
  }

  if (filters.propertyType && filters.propertyType !== 'All') {
    tags.push(filters.propertyType);
  }

  if (filters.listingType && filters.listingType !== 'All') {
    tags.push(filters.listingType === 'sale' ? 'For Sale' : 'For Rent');
  }

  if (filters.locality && filters.city) {
    tags.push(`${filters.locality}, ${filters.city}`);
  } else if (filters.city && filters.city !== 'All') {
    tags.push(filters.city);
  } else if (filters.location) {
    tags.push(filters.location);
  }

  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatPrice(Number(filters.minPrice)) : '₹0';
    const max = filters.maxPrice ? formatPrice(Number(filters.maxPrice)) : 'Above';
    tags.push(`${min} – ${max}`);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    tags.push(...filters.amenities.slice(0, 2));
    if (filters.amenities.length > 2) {
      tags.push(`+${filters.amenities.length - 2} more`);
    }
  }

  return tags;
}

/**
 * Generates a clean human-readable summary string (e.g., "3+ bedrooms · Apartment · Bareilly")
 */
export function formatSearchSummary(filters: PropertySearchFilters): string {
  const parts: string[] = [];

  // Bedrooms
  if (filters.bedrooms && filters.bedrooms !== 'All') {
    parts.push(`${filters.bedrooms}+ bedrooms`);
  }

  // Property Type
  if (filters.propertyType && filters.propertyType !== 'All') {
    parts.push(filters.propertyType);
  }

  // Location / City
  if (filters.locality && filters.city) {
    parts.push(`${filters.locality}, ${filters.city}`);
  } else if (filters.city && filters.city !== 'All') {
    parts.push(filters.city);
  } else if (filters.location) {
    parts.push(filters.location);
  }

  // Listing Type
  if (filters.listingType && filters.listingType !== 'All') {
    parts.push(filters.listingType === 'sale' ? 'For Sale' : 'For Rent');
  }

  // Price range
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatPrice(Number(filters.minPrice)) : 'Min';
    const max = filters.maxPrice ? formatPrice(Number(filters.maxPrice)) : 'Max';
    parts.push(`${min}–${max}`);
  }

  // Amenities snippet
  if (filters.amenities && filters.amenities.length > 0) {
    parts.push(filters.amenities.slice(0, 2).join(' · '));
  }

  if (parts.length === 0) {
    return 'All Properties';
  }

  return parts.join(' · ');
}

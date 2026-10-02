import { Property, PropertySortOption } from './property';

export type SearchViewMode = 'split' | 'list' | 'map';

export interface PropertySearchFilters {
  searchQuery: string;
  location: string;
  city: string;
  locality: string;
  propertyType: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
  furnishing: string;
  parking: string;
  amenities: string[];
  status: string;
  radius: string; // '1' | '5' | '10' | '25' | '50' | ''
  sortBy: PropertySortOption;
}

export interface SearchLocation {
  name: string;
  city: string;
  state?: string;
  locality?: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'locality';
}

export interface LocationSuggestion {
  id: string;
  name: string;
  subtext: string;
  city: string;
  locality?: string;
  type: 'city' | 'locality' | 'recent';
  latitude: number;
  longitude: number;
  timestamp?: number;
}

export interface MapViewport {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number; // 1 to 5 scale
}

export type PropertyWithDistance = Property & {
  distance?: number | null; // in km
};

export interface PropertyOwner {
  name: string;
  role: string;
  avatar?: string | null;
  phone?: string;
  email?: string;
  responseTime?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  listingType: "sale" | "rent";
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  locality: string;
  location?: string;
  address?: string;
  state?: string;
  pincode?: string;
  images: string[];
  featured?: boolean;
  createdAt?: string;
  parking?: string | number;
  furnishing?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished' | string;
  amenities?: string[];
  owner?: PropertyOwner;
  floor?: string;
  totalFloors?: string;
  facing?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
}

export type PropertySortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'area-asc'
  | 'area-desc';

export interface PropertyFilterState {
  searchQuery: string;
  location: string;
  propertyType: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
  sortBy: PropertySortOption;
}

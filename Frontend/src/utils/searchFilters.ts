import { Property, PropertySortOption } from '../types/property';
import { PropertySearchFilters, PropertyWithDistance, SearchViewMode } from '../types/search';
import { calculateHaversineDistance } from './distance';
import { resolveLocationCoordinates } from '../data/mockLocations';

export const DEFAULT_SEARCH_FILTERS: PropertySearchFilters = {
  searchQuery: '',
  location: '',
  city: '',
  locality: '',
  propertyType: '',
  listingType: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  bathrooms: '',
  minArea: '',
  maxArea: '',
  furnishing: '',
  parking: '',
  amenities: [],
  status: '',
  radius: '',
  sortBy: 'recommended',
};

/**
 * Parses URL search parameters into structured PropertySearchFilters, view mode, and page.
 */
export function parseSearchParams(searchParams: URLSearchParams): {
  filters: PropertySearchFilters;
  viewMode: SearchViewMode;
  page: number;
} {
  const city = searchParams.get('city') || '';
  const locality = searchParams.get('locality') || '';
  const location = searchParams.get('location') || city || locality || '';
  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';

  // Handle category alias from home page (e.g. ?category=villas -> Villa)
  let propertyType = searchParams.get('propertyType') || '';
  if (!propertyType && searchParams.get('category')) {
    const rawCat = searchParams.get('category')!;
    propertyType = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).replace(/s$/, '');
  }

  // Handle listing type alias (type=rent / type=sale)
  let listingType = searchParams.get('listingType') || searchParams.get('type') || '';
  if (listingType) {
    listingType = listingType.toLowerCase().includes('rent') ? 'rent' : 'sale';
  }

  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const minArea = searchParams.get('minArea') || '';
  const maxArea = searchParams.get('maxArea') || '';
  const furnishing = searchParams.get('furnishing') || '';
  const parking = searchParams.get('parking') || '';
  const status = searchParams.get('status') || '';
  const radius = searchParams.get('radius') || '';

  // Parse amenities from comma-separated string or repeated params
  let amenities: string[] = [];
  const rawAmenities = searchParams.getAll('amenities');
  if (rawAmenities.length > 0) {
    amenities = rawAmenities.flatMap((a) => a.split(',')).map((a) => a.trim()).filter(Boolean);
  }

  const sortByParam = (searchParams.get('sort') || searchParams.get('sortBy') || 'recommended') as PropertySortOption;
  const validSorts: PropertySortOption[] = [
    'recommended',
    'price-asc',
    'price-desc',
    'newest',
    'area-asc',
    'area-desc',
  ];
  const sortBy = validSorts.includes(sortByParam) ? sortByParam : 'recommended';

  const rawView = searchParams.get('view');
  const viewMode: SearchViewMode =
    rawView === 'list' || rawView === 'map' || rawView === 'split' ? rawView : 'split';

  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  return {
    filters: {
      searchQuery,
      location,
      city,
      locality,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishing,
      parking,
      amenities,
      status,
      radius,
      sortBy,
    },
    viewMode,
    page,
  };
}

/**
 * Creates clean URL search parameters from active filters, view mode, and page.
 */
export function createSearchParams(
  filters: PropertySearchFilters,
  viewMode?: SearchViewMode,
  page?: number
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.searchQuery) params.set('q', filters.searchQuery);
  if (filters.city) params.set('city', filters.city);
  if (filters.locality) params.set('locality', filters.locality);
  if (filters.location && !filters.city && !filters.locality) params.set('location', filters.location);
  if (filters.propertyType && filters.propertyType !== 'all') params.set('propertyType', filters.propertyType);
  if (filters.listingType && filters.listingType !== 'all') params.set('listingType', filters.listingType);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.bedrooms && filters.bedrooms !== 'any') params.set('bedrooms', filters.bedrooms);
  if (filters.bathrooms && filters.bathrooms !== 'any') params.set('bathrooms', filters.bathrooms);
  if (filters.minArea) params.set('minArea', filters.minArea);
  if (filters.maxArea) params.set('maxArea', filters.maxArea);
  if (filters.furnishing && filters.furnishing !== 'any') params.set('furnishing', filters.furnishing);
  if (filters.parking && filters.parking !== 'any') params.set('parking', filters.parking);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.radius) params.set('radius', filters.radius);
  if (filters.amenities && filters.amenities.length > 0) {
    params.set('amenities', filters.amenities.join(','));
  }
  if (filters.sortBy && filters.sortBy !== 'recommended') {
    params.set('sort', filters.sortBy);
  }
  if (viewMode && viewMode !== 'split') {
    params.set('view', viewMode);
  }
  if (page && page > 1) {
    params.set('page', String(page));
  }

  return params;
}

/**
 * Filters and enriches properties according to search filters and optional geographic center.
 */
export function filterAndEnrichProperties(
  properties: Property[],
  filters: PropertySearchFilters,
  customCenterCoords?: { lat: number; lng: number } | null
): PropertyWithDistance[] {
  // Resolve center coordinates for distance calculation
  let centerCoords = customCenterCoords || null;
  if (!centerCoords) {
    const locQuery = filters.city || filters.location || filters.locality;
    if (locQuery) {
      const resolved = resolveLocationCoordinates(locQuery);
      if (resolved) {
        centerCoords = { lat: resolved.lat, lng: resolved.lng };
      }
    }
  }

  const radiusKm = filters.radius ? parseFloat(filters.radius) : null;

  return properties
    .map((prop) => {
      let distance: number | null = null;
      if (
        centerCoords &&
        prop.latitude !== undefined &&
        prop.longitude !== undefined
      ) {
        distance = calculateHaversineDistance(
          centerCoords.lat,
          centerCoords.lng,
          prop.latitude,
          prop.longitude
        );
      }
      return { ...prop, distance };
    })
    .filter((property) => {
      // 1. Text Search (Search Query)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesCity = property.city.toLowerCase().includes(query);
        const matchesLocality = property.locality.toLowerCase().includes(query);
        const matchesType = property.propertyType.toLowerCase().includes(query);
        const matchesDesc = property.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCity && !matchesLocality && !matchesType && !matchesDesc) {
          return false;
        }
      }

      // 2. City
      if (filters.city.trim()) {
        const cQuery = filters.city.toLowerCase();
        const isDelhiMatch =
          (cQuery === 'delhi' && property.city.toLowerCase().includes('delhi')) ||
          (property.city.toLowerCase() === 'delhi' && cQuery.includes('delhi'));
        if (!isDelhiMatch && !property.city.toLowerCase().includes(cQuery) && !cQuery.includes(property.city.toLowerCase())) {
          return false;
        }
      }

      // 3. Location (general location input if city is not explicitly set)
      if (filters.location.trim() && !filters.city.trim()) {
        const lQuery = filters.location.toLowerCase();
        const isDelhiMatch =
          (lQuery === 'delhi' && property.city.toLowerCase().includes('delhi')) ||
          (property.city.toLowerCase() === 'delhi' && lQuery.includes('delhi'));
        const matchesCity = isDelhiMatch || property.city.toLowerCase().includes(lQuery);
        const matchesLocality = property.locality.toLowerCase().includes(lQuery);
        if (!matchesCity && !matchesLocality) {
          return false;
        }
      }

      // 4. Locality
      if (filters.locality.trim()) {
        const locQuery = filters.locality.toLowerCase();
        if (!property.locality.toLowerCase().includes(locQuery)) {
          return false;
        }
      }

      // 5. Property Type
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
          return false;
        }
      }

      // 6. Listing Type (Sale / Rent)
      if (filters.listingType && filters.listingType !== 'all') {
        const normalized = filters.listingType.toLowerCase().includes('rent') ? 'rent' : 'sale';
        if (property.listingType !== normalized) {
          return false;
        }
      }

      // 7. Price
      if (filters.minPrice) {
        const min = Number(filters.minPrice);
        if (!isNaN(min) && property.price < min) {
          return false;
        }
      }
      if (filters.maxPrice) {
        const max = Number(filters.maxPrice);
        if (!isNaN(max) && property.price > max) {
          return false;
        }
      }

      // 8. Bedrooms
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        const minBeds = parseInt(filters.bedrooms, 10);
        if (!isNaN(minBeds) && property.bedrooms < minBeds) {
          return false;
        }
      }

      // 9. Bathrooms
      if (filters.bathrooms && filters.bathrooms !== 'any') {
        const minBaths = parseInt(filters.bathrooms, 10);
        if (!isNaN(minBaths) && property.bathrooms < minBaths) {
          return false;
        }
      }

      // 10. Area
      if (filters.minArea) {
        const minA = Number(filters.minArea);
        if (!isNaN(minA) && property.area < minA) {
          return false;
        }
      }
      if (filters.maxArea) {
        const maxA = Number(filters.maxArea);
        if (!isNaN(maxA) && property.area > maxA) {
          return false;
        }
      }

      // 11. Furnishing
      if (filters.furnishing && filters.furnishing !== 'any') {
        const propFurn = (property.furnishing || '').toLowerCase().replace(/[\s-]/g, '');
        const targetFurn = filters.furnishing.toLowerCase().replace(/[\s-]/g, '');
        if (!propFurn.includes(targetFurn) && !targetFurn.includes(propFurn)) {
          return false;
        }
      }

      // 12. Parking
      if (filters.parking && filters.parking !== 'any') {
        if (!property.parking) return false;
        if (typeof property.parking === 'string' && property.parking.toLowerCase().includes('none')) {
          return false;
        }
      }

      // 13. Amenities (must match all selected amenities)
      if (filters.amenities && filters.amenities.length > 0) {
        const propAmenities = (property.amenities || []).map((a) => a.toLowerCase().trim());
        const hasAll = filters.amenities.every((a) =>
          propAmenities.some((pa) => pa.includes(a.toLowerCase().trim()))
        );
        if (!hasAll) {
          return false;
        }
      }

      // 14. Status
      if (filters.status && filters.status !== 'all') {
        const propStatus = (property.status || 'available').toLowerCase();
        const targetStatus = filters.status.toLowerCase();
        if (targetStatus === 'available') {
          if (propStatus.includes('sold') || propStatus.includes('rented')) return false;
        } else if (!propStatus.includes(targetStatus)) {
          return false;
        }
      }

      // 15. Radius Filter
      if (radiusKm !== null && !isNaN(radiusKm)) {
        if (property.distance === null || property.distance === undefined) {
          return false;
        }
        if (property.distance > radiusKm) {
          return false;
        }
      }

      return true;
    });
}

/**
 * Sorts properties according to the selected sort option.
 */
export function sortProperties(
  properties: PropertyWithDistance[],
  sortBy: PropertySortOption
): PropertyWithDistance[] {
  const list = [...properties];

  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case 'area-asc':
      return list.sort((a, b) => a.area - b.area);
    case 'area-desc':
      return list.sort((a, b) => b.area - a.area);
    case 'recommended':
    default:
      return list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }
}

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertySearchFilters, SearchViewMode } from '../../../types/search';
import { mockProperties } from '../../../data/mockProperties';
import {
  DEFAULT_SEARCH_FILTERS,
  parseSearchParams,
  createSearchParams,
  filterAndEnrichProperties,
  sortProperties,
} from '../../../utils/searchFilters';

const ITEMS_PER_PAGE = 12;

export function usePropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse initial state from URL search params
  const parsed = useMemo(() => parseSearchParams(searchParams), []);

  const [filters, setFilters] = useState<PropertySearchFilters>(parsed.filters);
  const [viewMode, setViewMode] = useState<SearchViewMode>(parsed.viewMode);
  const [currentPage, setCurrentPage] = useState(parsed.page);

  const [customCenter, setCustomCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Prevent circular URL updates
  const isInternalUpdate = useRef(false);

  // Synchronize from URL back/forward or external changes
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const nextParsed = parseSearchParams(searchParams);
    setFilters(nextParsed.filters);
    setViewMode(nextParsed.viewMode);
    setCurrentPage(nextParsed.page);
  }, [searchParams]);

  // Synchronize state changes to URL query parameters
  const syncToUrl = useCallback(
    (nextFilters: PropertySearchFilters, nextView: SearchViewMode, nextPage: number) => {
      isInternalUpdate.current = true;
      const params = createSearchParams(nextFilters, nextView, nextPage);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Update a single filter field & reset to page 1
  const setFilterField = useCallback(
    (key: keyof PropertySearchFilters, value: any) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        syncToUrl(next, viewMode, 1);
        return next;
      });
      setCurrentPage(1);
    },
    [viewMode, syncToUrl]
  );

  // Change view mode (split | list | map)
  const handleViewModeChange = useCallback(
    (mode: SearchViewMode) => {
      setViewMode(mode);
      syncToUrl(filters, mode, currentPage);
    },
    [filters, currentPage, syncToUrl]
  );

  // Change page
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      syncToUrl(filters, viewMode, page);
      window.scrollTo({ top: 160, behavior: 'smooth' });
    },
    [filters, viewMode, syncToUrl]
  );

  // Clear all filters back to default
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_SEARCH_FILTERS);
    setCustomCenter(null);
    setSelectedPropertyId(null);
    setLocationFeedback(null);
    setCurrentPage(1);
    syncToUrl(DEFAULT_SEARCH_FILTERS, viewMode, 1);
  }, [viewMode, syncToUrl]);

  // Near Me action
  const handleNearMe = useCallback(() => {
    setIsLocating(true);
    setLocationFeedback(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCustomCenter({ lat, lng });
          setIsLocating(false);
          setLocationFeedback('Using your current location with a 10 km radius.');

          setFilters((prev) => {
            const next = {
              ...prev,
              location: 'Near My Location',
              city: '',
              locality: '',
              radius: prev.radius || '10',
            };
            syncToUrl(next, viewMode, 1);
            return next;
          });
          setCurrentPage(1);
        },
        () => {
          // Denied or unavailable fallback to Bareilly center for demo
          setIsLocating(false);
          const fallbackLat = 28.367;
          const fallbackLng = 79.4304;
          setCustomCenter({ lat: fallbackLat, lng: fallbackLng });
          setLocationFeedback(
            'Location access not permitted. Demo centered on Bareilly area with 10 km radius.'
          );

          setFilters((prev) => {
            const next = {
              ...prev,
              location: 'Bareilly, UP',
              city: 'Bareilly',
              radius: '10',
            };
            syncToUrl(next, viewMode, 1);
            return next;
          });
          setCurrentPage(1);
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setLocationFeedback('Geolocation not supported by browser. Falling back to Bareilly.');
      setFilters((prev) => ({ ...prev, city: 'Bareilly', radius: '10' }));
    }
  }, [viewMode, syncToUrl]);

  // Filter & Enrich pipeline
  const filteredAndEnriched = useMemo(() => {
    return filterAndEnrichProperties(mockProperties, filters, customCenter);
  }, [filters, customCenter]);

  // Sort pipeline
  const sortedProperties = useMemo(() => {
    return sortProperties(filteredAndEnriched, filters.sortBy);
  }, [filteredAndEnriched, filters.sortBy]);

  // Pagination pipeline
  const totalResults = sortedProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProperties, currentPage]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.location || filters.city || filters.locality) count++;
    if (filters.propertyType && filters.propertyType !== 'all') count++;
    if (filters.listingType && filters.listingType !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.bedrooms && filters.bedrooms !== 'any') count++;
    if (filters.bathrooms && filters.bathrooms !== 'any') count++;
    if (filters.minArea || filters.maxArea) count++;
    if (filters.furnishing && filters.furnishing !== 'any') count++;
    if (filters.parking && filters.parking !== 'any') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.radius) count++;
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
    return count;
  }, [filters]);

  return {
    filters,
    setFilters,
    setFilterField,
    clearAllFilters,
    viewMode,
    setViewMode: handleViewModeChange,
    currentPage,
    setCurrentPage: handlePageChange,
    totalResults,
    totalPages,
    paginatedProperties,
    allFilteredProperties: sortedProperties,
    activeFilterCount,
    handleNearMe,
    isLocating,
    locationFeedback,
    clearLocationFeedback: () => setLocationFeedback(null),
    selectedPropertyId,
    setSelectedPropertyId,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}

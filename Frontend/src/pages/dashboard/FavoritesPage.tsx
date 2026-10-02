import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Heart, Filter, ArrowUpDown, X, Building2 } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { PropertyCard } from '../../components/property/PropertyCard';
import { EmptyState } from '../../components/common/EmptyState';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';

type SortOption =
  | 'recently-saved'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'area-asc'
  | 'area-desc';

interface FilterState {
  propertyType: string;
  listingType: string;
  priceRange: string;
  bedrooms: string;
  city: string;
}

const initialFilters: FilterState = {
  propertyType: 'All',
  listingType: 'All',
  priceRange: 'All',
  bedrooms: 'All',
  city: 'All',
};

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const { favorites, favoriteProperties, removeFavorite, clearFavorites } = useFavorites();

  const [sortBy, setSortBy] = useState<SortOption>('recently-saved');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available unique cities and types in saved properties
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    favoriteProperties.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set).sort();
  }, [favoriteProperties]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    favoriteProperties.forEach((p) => {
      if (p.propertyType) set.add(p.propertyType);
    });
    return Array.from(set).sort();
  }, [favoriteProperties]);

  // Check how many filters are active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.propertyType !== 'All') count++;
    if (filters.listingType !== 'All') count++;
    if (filters.priceRange !== 'All') count++;
    if (filters.bedrooms !== 'All') count++;
    if (filters.city !== 'All') count++;
    return count;
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    // 1. Filter
    const result = favoriteProperties.filter((prop) => {
      if (filters.propertyType !== 'All' && prop.propertyType !== filters.propertyType) {
        return false;
      }
      if (filters.listingType !== 'All' && prop.listingType !== filters.listingType) {
        return false;
      }
      if (filters.city !== 'All' && prop.city !== filters.city) {
        return false;
      }
      if (filters.bedrooms !== 'All') {
        const targetBeds = parseInt(filters.bedrooms, 10);
        if (targetBeds === 4) {
          if (prop.bedrooms < 4) return false;
        } else if (prop.bedrooms !== targetBeds) {
          return false;
        }
      }
      if (filters.priceRange !== 'All') {
        if (filters.priceRange === 'under-50l' && prop.price >= 5000000) return false;
        if (filters.priceRange === '50l-1cr' && (prop.price < 5000000 || prop.price > 10000000)) return false;
        if (filters.priceRange === '1cr-3cr' && (prop.price < 10000000 || prop.price > 30000000)) return false;
        if (filters.priceRange === 'above-3cr' && prop.price <= 30000000) return false;
      }
      return true;
    });

    // 2. Sort
    return result.sort((a, b) => {
      if (sortBy === 'recently-saved') {
        const favA = favorites.find((f) => f.propertyId === a.id);
        const favB = favorites.find((f) => f.propertyId === b.id);
        const dateA = favA ? new Date(favA.savedAt).getTime() : 0;
        const dateB = favB ? new Date(favB.savedAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'area-asc') {
        return a.area - b.area;
      }
      if (sortBy === 'area-desc') {
        return b.area - a.area;
      }
      if (sortBy === 'newest') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      return 0;
    });
  }, [favoriteProperties, favorites, filters, sortBy]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Saved Properties"
        subtitle="Properties you've saved for later."
        onOpenMobileMenu={openMobileSidebar}
        action={
          favorites.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8EBE6] text-[#C66A4A] border border-[#C66A4A]/20">
                {favorites.length} Saved
              </span>
              <button
                type="button"
                onClick={clearFavorites}
                className="text-xs text-[#737373] hover:text-[#DC2626] font-medium transition-colors px-2 py-1 rounded hover:bg-white"
              >
                Clear All
              </button>
            </div>
          )
        }
      />

      {/* Global Empty State: No Favorites at all */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved properties yet"
          description="Save properties you like and they'll appear here."
          actionLabel="Explore Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
          className="py-16 bg-white border-[#E2E2DF]"
        />
      ) : (
        <div className="space-y-5">
          {/* Controls Bar: Sort, Filter Toggle, Result Summary */}
          <div className="bg-white rounded-2xl border border-[#E2E2DF] p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Result count & Mobile Filters Button */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-sm font-bold text-[#171717]">
                {filteredAndSortedProperties.length} of {favoriteProperties.length}{' '}
                {favoriteProperties.length === 1 ? 'property' : 'properties'}
              </span>

              <button
                type="button"
                onClick={() => setShowFiltersMobile((prev) => !prev)}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E2DF] text-xs font-medium text-[#222222] bg-[#F5F5F2]"
              >
                <Filter className="w-3.5 h-3.5 text-[#C66A4A]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="favorites-sort" className="text-xs font-medium text-[#737373] whitespace-nowrap flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#A3A3A3]" />
                <span>Sort by:</span>
              </label>
              <select
                id="favorites-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 text-xs font-medium bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
              >
                <option value="recently-saved">Recently Saved</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="area-asc">Area: Small to Large</option>
                <option value="area-desc">Area: Large to Small</option>
              </select>
            </div>
          </div>

          {/* Filter Bar (Desktop persistent, Mobile collapsible) */}
          <div
            className={`bg-white rounded-2xl border border-[#E2E2DF] p-4 shadow-sm space-y-3 ${
              showFiltersMobile ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-1">
                  Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                >
                  <option value="All">All Types</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-1">
                  Listing
                </label>
                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange('listingType', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                >
                  <option value="All">All Listings</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-1">
                  Price
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                >
                  <option value="All">Any Price</option>
                  <option value="under-50l">Under ₹50 Lac</option>
                  <option value="50l-1cr">₹50 Lac – ₹1 Cr</option>
                  <option value="1cr-3cr">₹1 Cr – ₹3 Cr</option>
                  <option value="above-3cr">Above ₹3 Cr</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-1">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                >
                  <option value="All">Any Beds</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-1">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F5F5F2] border border-[#E2E2DF] rounded-lg text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                >
                  <option value="All">All Cities</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Chips & Clear Action */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E2DF]">
                <span className="text-xs text-[#737373] font-medium">Active:</span>
                {filters.propertyType !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#171717] border border-[#E2E2DF]">
                    {filters.propertyType}
                    <button
                      type="button"
                      onClick={() => handleFilterChange('propertyType', 'All')}
                      aria-label="Remove property type filter"
                    >
                      <X className="w-3 h-3 hover:text-[#DC2626]" />
                    </button>
                  </span>
                )}
                {filters.listingType !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#171717] border border-[#E2E2DF]">
                    {filters.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    <button
                      type="button"
                      onClick={() => handleFilterChange('listingType', 'All')}
                      aria-label="Remove listing type filter"
                    >
                      <X className="w-3 h-3 hover:text-[#DC2626]" />
                    </button>
                  </span>
                )}
                {filters.city !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#171717] border border-[#E2E2DF]">
                    {filters.city}
                    <button
                      type="button"
                      onClick={() => handleFilterChange('city', 'All')}
                      aria-label="Remove city filter"
                    >
                      <X className="w-3 h-3 hover:text-[#DC2626]" />
                    </button>
                  </span>
                )}
                {filters.bedrooms !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#171717] border border-[#E2E2DF]">
                    {filters.bedrooms} BHK
                    <button
                      type="button"
                      onClick={() => handleFilterChange('bedrooms', 'All')}
                      aria-label="Remove bedroom filter"
                    >
                      <X className="w-3 h-3 hover:text-[#DC2626]" />
                    </button>
                  </span>
                )}
                {filters.priceRange !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#171717] border border-[#E2E2DF]">
                    {filters.priceRange}
                    <button
                      type="button"
                      onClick={() => handleFilterChange('priceRange', 'All')}
                      aria-label="Remove price filter"
                    >
                      <X className="w-3 h-3 hover:text-[#DC2626]" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-[#C66A4A] hover:underline font-semibold ml-auto"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Properties Grid or Filter Empty State */}
          {filteredAndSortedProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E2DF] p-10 text-center space-y-3">
              <Building2 className="w-10 h-10 text-[#A3A3A3] mx-auto" />
              <h3 className="text-base font-bold text-[#171717]">
                No saved properties match your filters
              </h3>
              <p className="text-xs text-[#737373] max-w-sm mx-auto">
                Try widening your price range, choosing another city, or resetting your filter options.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="mt-2 border-[#E2E2DF]"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property) => (
                <div key={property.id} className="relative group flex flex-col h-full">
                  <PropertyCard property={property} />
                  <div className="mt-2.5 flex items-center justify-between text-xs text-[#737373] px-1">
                    <button
                      type="button"
                      onClick={() => removeFavorite(property.id)}
                      className="text-[#737373] hover:text-[#DC2626] transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DC2626] rounded font-medium"
                    >
                      Remove from saved
                    </button>
                    <span className="text-[11px] text-[#A3A3A3]">
                      Saved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { SlidersHorizontal, Map, LayoutGrid, Columns, List, Bookmark } from 'lucide-react';
import { PropertySortOption } from '../../../types/property';
import { PropertySearchFilters, SearchViewMode } from '../../../types/search';
import { SortSelect } from '../../../components/search/SortSelect';
import { ActiveFilterChips } from '../../../components/search/ActiveFilterChips';

export interface PropertyResultsHeaderProps {
  totalResults: number;
  viewMode: SearchViewMode;
  onViewModeChange: (mode: SearchViewMode) => void;
  sortBy: PropertySortOption;
  onSortChange: (value: PropertySortOption) => void;
  filters: PropertySearchFilters;
  onFilterChange: (key: keyof PropertySearchFilters, value: any) => void;
  onClearAll: () => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  onSaveSearchClick?: () => void;
  className?: string;
}

export const PropertyResultsHeader: React.FC<PropertyResultsHeaderProps> = ({
  totalResults,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  onClearAll,
  onOpenMobileFilters,
  activeFilterCount,
  onSaveSearchClick,
  className = '',
}) => {
  return (
    <div className={`space-y-4 mb-6 ${className}`}>
      {/* Top Results Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E2DF]">
        {/* Left: Dynamic Results Count & Mobile Filter Trigger & Save Search */}
        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-bold text-[#171717]">
            {totalResults} {totalResults === 1 ? 'property found' : 'properties found'}
          </span>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A3A3A3] bg-white text-xs font-semibold text-[#222222] hover:bg-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C66A4A]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Save Search Button (visible when filters are active) */}
          {activeFilterCount > 0 && onSaveSearchClick && (
            <button
              type="button"
              onClick={onSaveSearchClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C66A4A]/30 bg-[#F8EBE6] text-[#C66A4A] hover:bg-[#F3DDD5] text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C66A4A]"
              title="Save this search"
            >
              <Bookmark className="w-3.5 h-3.5 fill-[#C66A4A]" />
              <span className="hidden sm:inline">Save Search</span>
              <span className="sm:hidden">Save</span>
            </button>
          )}
        </div>

        {/* Right: View Mode Toggle & Sort Control */}
        <div className="flex items-center gap-3">
          {/* Mobile Map / List Toggle */}
          <div className="flex lg:hidden bg-white border border-[#E2E2DF] rounded-lg p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="Switch to list view"
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode !== 'map'
                  ? 'bg-[#171717] text-white'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('map')}
              aria-label="Switch to map view"
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-[#171717] text-white'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>

          {/* Desktop View Mode Toggle (Split / List / Map) */}
          <div className="hidden lg:flex items-center bg-white border border-[#E2E2DF] rounded-xl p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => onViewModeChange('split')}
              aria-label="Split View: List and Map"
              title="Split View"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'split'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              title="List View"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('map')}
              aria-label="Map View"
              title="Map View"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <SortSelect value={sortBy} onChange={onSortChange} />
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAll={onClearAll}
      />
    </div>
  );
};

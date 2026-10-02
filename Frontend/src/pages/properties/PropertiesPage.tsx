import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SearchBar } from '../../components/search/SearchBar';
import { AdvancedFilterPanel } from '../../components/search/AdvancedFilterPanel';
import { PropertyResultsHeader } from './components/PropertyResultsHeader';
import { PropertyGrid } from './components/PropertyGrid';
import { Pagination } from './components/Pagination';
import { PropertyMap } from '../../components/map/PropertyMap';
import { usePropertyFilters } from './hooks/usePropertyFilters';
import { SaveSearchModal } from '../../components/search/SaveSearchModal';
import { useSavedSearch } from '../../context/SavedSearchContext';
import { Navigation, X } from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false);
  const { saveSearch } = useSavedSearch();

  const {
    filters,
    setFilterField,
    clearAllFilters,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalResults,
    totalPages,
    paginatedProperties,
    allFilteredProperties,
    activeFilterCount,
    handleNearMe,
    isLocating,
    locationFeedback,
    clearLocationFeedback,
    selectedPropertyId,
    setSelectedPropertyId,
  } = usePropertyFilters();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Determine active city for map labeling
  const activeCity = filters.city || filters.location || 'Bareilly';

  return (
    <div className="py-6 sm:py-10 bg-[#F5F5F2] min-h-screen">
      <Container size="full" className="max-w-[1536px]">
        {/* Page Header */}
        <div className="max-w-3xl mb-6">
          <div className="inline-block text-xs uppercase tracking-widest text-[#C66A4A] font-semibold mb-1.5">
            EstateX Discovery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
            Find your next place
          </h1>
          <p className="text-sm sm:text-base text-[#737373] mt-1.5 leading-relaxed">
            Search homes, apartments, villas and more across India.
          </p>
        </div>

        {/* Prominent Search Bar */}
        <SearchBar
          filters={filters}
          onFilterChange={setFilterField}
          onSearchSubmit={handleSearchSubmit}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Location / Near Me Feedback Banner */}
        {locationFeedback && (
          <div className="mb-6 p-3.5 bg-white border border-[#C66A4A]/30 rounded-xl shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs text-[#222222]">
              <Navigation className="w-4 h-4 text-[#C66A4A] shrink-0" />
              <span>{locationFeedback}</span>
            </div>
            <button
              type="button"
              onClick={clearLocationFeedback}
              aria-label="Dismiss message"
              className="text-[#737373] hover:text-[#171717] p-1 rounded-lg hover:bg-[#F5F5F2]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================
            LAYOUT 1: MOBILE MAP VIEW (Full Width)
           ======================================================== */}
        <div className="lg:hidden">
          {viewMode === 'map' ? (
            <div className="h-[calc(100vh-180px)] min-h-[500px] w-full relative">
              <PropertyMap
                properties={allFilteredProperties}
                activeCity={activeCity}
                selectedPropertyId={selectedPropertyId}
                onSelectProperty={(prop) => setSelectedPropertyId(prop?.id || null)}
                onNearMe={handleNearMe}
                isLocating={isLocating}
                onCloseMobileMap={() => setViewMode('list')}
                className="h-full"
              />
            </div>
          ) : (
            <div>
              {/* Mobile Results Header & List */}
              <PropertyResultsHeader
                totalResults={totalResults}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={filters.sortBy}
                onSortChange={(val) => setFilterField('sortBy', val)}
                filters={filters}
                onFilterChange={setFilterField}
                onClearAll={clearAllFilters}
                onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                activeFilterCount={activeFilterCount}
                onSaveSearchClick={() => setIsSaveSearchOpen(true)}
              />

              <PropertyGrid
                properties={paginatedProperties}
                onClearFilters={clearAllFilters}
                onChangeLocation={() => setFilterField('location', '')}
              />

              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            LAYOUT 2: DESKTOP VIEWS (Split, List, or Map)
           ======================================================== */}
        <div className="hidden lg:block">
          {/* A. FULL MAP VIEW (Desktop) */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <PropertyResultsHeader
                totalResults={totalResults}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={filters.sortBy}
                onSortChange={(val) => setFilterField('sortBy', val)}
                filters={filters}
                onFilterChange={setFilterField}
                onClearAll={clearAllFilters}
                onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                activeFilterCount={activeFilterCount}
                onSaveSearchClick={() => setIsSaveSearchOpen(true)}
              />

              <div className="h-[750px] w-full">
                <PropertyMap
                  properties={allFilteredProperties}
                  activeCity={activeCity}
                  selectedPropertyId={selectedPropertyId}
                  onSelectProperty={(prop) => setSelectedPropertyId(prop?.id || null)}
                  onNearMe={handleNearMe}
                  isLocating={isLocating}
                  className="h-full"
                />
              </div>
            </div>
          )}

          {/* B. LIST ONLY VIEW (Desktop: Sidebar Filters + 3-col Property Grid) */}
          {viewMode === 'list' && (
            <div className="flex items-start gap-8">
              {/* Left Filters Sidebar */}
              <aside className="w-72 shrink-0 sticky top-24">
                <AdvancedFilterPanel
                  filters={filters}
                  onFilterChange={setFilterField}
                  onReset={clearAllFilters}
                />
              </aside>

              {/* Right Results Grid */}
              <main className="flex-1 min-w-0">
                <PropertyResultsHeader
                  totalResults={totalResults}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  sortBy={filters.sortBy}
                  onSortChange={(val) => setFilterField('sortBy', val)}
                  filters={filters}
                  onFilterChange={setFilterField}
                  onClearAll={clearAllFilters}
                  onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                  activeFilterCount={activeFilterCount}
                  onSaveSearchClick={() => setIsSaveSearchOpen(true)}
                />

                <PropertyGrid
                  properties={paginatedProperties}
                  onClearFilters={clearAllFilters}
                  onChangeLocation={() => setFilterField('location', '')}
                  layout="standard"
                />

                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </main>
            </div>
          )}

          {/* C. SPLIT VIEW (Desktop: Left Filters + Center Results + Right Sticky Map) */}
          {viewMode === 'split' && (
            <div className="flex items-start gap-6">
              {/* Left Filters Column (~20% width) */}
              <aside className="w-64 2xl:w-72 shrink-0 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
                <AdvancedFilterPanel
                  filters={filters}
                  onFilterChange={setFilterField}
                  onReset={clearAllFilters}
                />
              </aside>

              {/* Center Results Column (~45-50% width) */}
              <main className="flex-1 min-w-0">
                <PropertyResultsHeader
                  totalResults={totalResults}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  sortBy={filters.sortBy}
                  onSortChange={(val) => setFilterField('sortBy', val)}
                  filters={filters}
                  onFilterChange={setFilterField}
                  onClearAll={clearAllFilters}
                  onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                  activeFilterCount={activeFilterCount}
                  onSaveSearchClick={() => setIsSaveSearchOpen(true)}
                />

                <PropertyGrid
                  properties={paginatedProperties}
                  onClearFilters={clearAllFilters}
                  onChangeLocation={() => setFilterField('location', '')}
                  layout="split"
                />

                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </main>

              {/* Right Map Column (~35% width) */}
              <aside className="hidden xl:block w-[380px] 2xl:w-[460px] shrink-0 sticky top-24 h-[calc(100vh-120px)] min-h-[580px]">
                <PropertyMap
                  properties={allFilteredProperties}
                  activeCity={activeCity}
                  selectedPropertyId={selectedPropertyId}
                  onSelectProperty={(prop) => setSelectedPropertyId(prop?.id || null)}
                  onNearMe={handleNearMe}
                  isLocating={isLocating}
                  className="h-full"
                />
              </aside>
            </div>
          )}
        </div>

        {/* Mobile Slide-Over Filter Drawer */}
        {mobileFiltersOpen && (
          <AdvancedFilterPanel
            isMobileDrawer
            onClose={() => setMobileFiltersOpen(false)}
            filters={filters}
            onFilterChange={setFilterField}
            onReset={clearAllFilters}
            onApply={() => setMobileFiltersOpen(false)}
          />
        )}

        {/* Save Search Modal */}
        <SaveSearchModal
          isOpen={isSaveSearchOpen}
          onClose={() => setIsSaveSearchOpen(false)}
          filters={filters}
          resultCount={totalResults}
          onSave={(name) => saveSearch(name, filters, totalResults)}
        />
      </Container>
    </div>
  );
};

export default PropertiesPage;

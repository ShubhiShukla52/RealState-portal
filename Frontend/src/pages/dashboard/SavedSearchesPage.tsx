import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bookmark, Search, Trash2, Calendar } from 'lucide-react';
import { useSavedSearch } from '../../context/SavedSearchContext';
import { EmptyState } from '../../components/common/EmptyState';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';
import { formatSearchSummary, getFilterTags } from '../../utils/savedSearchSummary';
import { createSearchParams } from '../../utils/searchFilters';

export const SavedSearchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const { savedSearches, deleteSavedSearch } = useSavedSearch();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSearchAgain = (filters: any) => {
    const params = createSearchParams(filters);
    navigate(`${ROUTES.PROPERTIES}?${params.toString()}`);
  };

  const confirmDelete = (id: string) => {
    deleteSavedSearch(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Saved Searches"
        subtitle="Quickly return to your preferred criteria and market filters."
        onOpenMobileMenu={openMobileSidebar}
        action={
          savedSearches.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F8EBE6] text-[#C66A4A] border border-[#C66A4A]/20">
              {savedSearches.length} Saved
            </span>
          )
        }
      />

      {savedSearches.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved searches"
          description="Save your favorite property searches so you can return to them quickly."
          actionLabel="Search Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
          className="py-16 bg-white border-[#E2E2DF]"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSearches.map((search) => {
              const summary = formatSearchSummary(search.filters);
              const tags = getFilterTags(search.filters);

              return (
                <div
                  key={search.id}
                  className="bg-white rounded-2xl border border-[#E2E2DF] p-5 shadow-sm hover:border-[#A3A3A3] transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    {/* Top Row: Title & Results Count */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#F8EBE6] text-[#C66A4A] flex items-center justify-center shrink-0">
                          <Bookmark className="w-4 h-4 fill-[#C66A4A]" />
                        </div>
                        <h3 className="text-base font-bold text-[#171717] line-clamp-1">
                          {search.name}
                        </h3>
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-[#171717] bg-[#F5F5F2] border border-[#E2E2DF] px-2.5 py-1 rounded-full">
                        {search.resultCount} {search.resultCount === 1 ? 'match' : 'matches'}
                      </span>
                    </div>

                    {/* Filter Summary */}
                    <p className="text-xs sm:text-sm text-[#222222] font-medium mb-3">
                      {summary}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F5F5F2] border border-[#E2E2DF] text-[#737373]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Saved Date */}
                    <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Saved on {search.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-3 border-t border-[#E2E2DF] flex items-center justify-between gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Search}
                      onClick={() => handleSearchAgain(search.filters)}
                      className="text-xs"
                    >
                      Search Again
                    </Button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(search.id)}
                      aria-label={`Delete search ${search.name}`}
                      className="p-2 rounded-lg text-[#737373] hover:text-[#DC2626] hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteId(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150"
          >
            <h3 id="delete-dialog-title" className="text-base font-bold text-[#171717] mb-2">
              Remove Saved Search?
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] mb-5">
              This saved criteria will be removed from your dashboard.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(null)}
                className="border-[#E2E2DF]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => confirmDelete(deleteId)}
                className="bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

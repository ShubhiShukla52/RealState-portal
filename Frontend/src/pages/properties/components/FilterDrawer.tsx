import React, { useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import { PropertyFilters } from './PropertyFilters';
import { PropertyFilterState } from '../../../types/property';

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilterState;
  onFilterChange: (key: keyof PropertyFilterState, value: string) => void;
  onClearAll: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
}) => {
  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-xl flex flex-col h-full overflow-hidden">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-[#E2E2DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C66A4A]" />
              <h2 className="text-base font-bold text-[#222222]">Filters</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body with filters */}
          <div className="flex-1 overflow-y-auto p-5">
            <PropertyFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onClearAll={onClearAll}
              onApply={onClose}
              isMobileModal
            />
          </div>
        </div>
      </div>
    </div>
  );
};

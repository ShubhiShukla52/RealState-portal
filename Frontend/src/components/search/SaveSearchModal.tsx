import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { X, Bookmark, Filter } from 'lucide-react';
import { PropertySearchFilters } from '../../types/search';
import { formatSearchSummary, getFilterTags } from '../../utils/savedSearchSummary';
import { Button } from '../ui/Button';

const saveSearchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Search name must be at least 2 characters')
    .max(50, 'Search name must be under 50 characters'),
});

type SaveSearchFormData = z.infer<typeof saveSearchSchema>;

export interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertySearchFilters;
  resultCount: number;
  onSave: (name: string) => void;
}

export const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
  isOpen,
  onClose,
  filters,
  resultCount,
  onSave,
}) => {
  const defaultSuggestedName = () => {
    const parts: string[] = [];
    if (filters.bedrooms && filters.bedrooms !== 'All') parts.push(`${filters.bedrooms}BHK`);
    if (filters.propertyType && filters.propertyType !== 'All') parts.push(filters.propertyType);
    if (filters.city && filters.city !== 'All') parts.push(`in ${filters.city}`);
    else if (filters.location) parts.push(`in ${filters.location.split(',')[0]}`);
    return parts.length > 0 ? parts.join(' ') : 'My Saved Search';
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaveSearchFormData>({
    defaultValues: {
      name: defaultSuggestedName(),
    },
    resolver: async (values) => {
      const result = saveSearchSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      const fieldErrors: Record<string, { type: string; message: string }> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = { type: 'manual', message: issue.message };
      });
      return { values: {}, errors: fieldErrors };
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValue('name', defaultSuggestedName());
    } else {
      reset();
    }
  }, [isOpen, filters, setValue, reset]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = (data: SaveSearchFormData) => {
    onSave(data.name);
    onClose();
  };

  const summary = formatSearchSummary(filters);
  const tags = getFilterTags(filters);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-search-title"
        className="relative w-full max-w-md bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E2DF] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F8EBE6] text-[#C66A4A] flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-[#C66A4A]" />
            </div>
            <div>
              <h2 id="save-search-title" className="text-base font-bold text-[#171717]">
                Save This Search
              </h2>
              <p className="text-xs text-[#737373]">
                Access your criteria anytime from your dashboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Summary Preview */}
        <div className="bg-[#F5F5F2] rounded-xl p-3.5 border border-[#E2E2DF] mb-5">
          <div className="flex items-center justify-between text-xs text-[#737373] mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#C66A4A]" />
              Active Criteria
            </span>
            <span className="font-semibold text-[#171717]">
              {resultCount} {resultCount === 1 ? 'match' : 'matches'}
            </span>
          </div>

          <p className="text-xs text-[#222222] font-semibold mb-2 line-clamp-2">
            {summary}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#E2E2DF] text-[#737373] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="search-name" className="block text-xs font-bold text-[#171717] mb-1.5">
              Search Name
            </label>
            <input
              id="search-name"
              type="text"
              autoFocus
              {...register('name')}
              placeholder="e.g., 3BHK in Bareilly"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] ${
                errors.name ? 'border-[#DC2626] bg-red-50/30' : 'border-[#E2E2DF] bg-white'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-[#E2E2DF]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Bookmark}
              disabled={isSubmitting}
            >
              Save Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

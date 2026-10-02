import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { X, Star, Edit3 } from 'lucide-react';
import { ReviewRating, Review } from '../../types/review';
import { StarRating } from './StarRating';
import { Button } from '../ui/Button';

const reviewFormSchema = z.object({
  rating: z
    .number()
    .min(1, 'Please select a star rating')
    .max(5, 'Maximum rating is 5 stars'),
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(80, 'Title cannot exceed 80 characters'),
  comment: z
    .string()
    .trim()
    .min(10, 'Comment must be at least 10 characters long')
    .max(1000, 'Comment cannot exceed 1000 characters'),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  initialReview?: Review | null;
  onSubmitReview: (rating: ReviewRating, title: string, comment: string) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  propertyTitle,
  initialReview,
  onSubmitReview,
}) => {
  const isEditing = Boolean(initialReview);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: initialReview?.rating || 5,
      title: initialReview?.title || '',
      comment: initialReview?.comment || '',
    },
    resolver: async (values) => {
      const result = reviewFormSchema.safeParse(values);
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
      if (initialReview) {
        setValue('rating', initialReview.rating);
        setValue('title', initialReview.title);
        setValue('comment', initialReview.comment);
      } else {
        reset({
          rating: 5,
          title: '',
          comment: '',
        });
      }
    }
  }, [isOpen, initialReview, setValue, reset]);

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

  const onSubmit = (data: ReviewFormData) => {
    onSubmitReview(data.rating as ReviewRating, data.title, data.comment);
    onClose();
  };

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
        aria-labelledby="review-modal-title"
        className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E2DF] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F8EBE6] text-[#C66A4A] flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Star className="w-4 h-4 fill-[#C66A4A]" />}
            </div>
            <div>
              <h2 id="review-modal-title" className="text-base font-bold text-[#171717]">
                {isEditing ? 'Edit Your Review' : 'Write a Review'}
              </h2>
              <p className="text-xs text-[#737373] truncate max-w-[280px]">
                {propertyTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating Control */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              Overall Rating <span className="text-[#C66A4A]">*</span>
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3 p-3 bg-[#F5F5F2] rounded-xl border border-[#E2E2DF]">
                  <StarRating
                    value={field.value}
                    onChange={(r) => field.onChange(r)}
                    size="lg"
                  />
                  <span className="text-xs font-semibold text-[#171717]">
                    {field.value} / 5 Star{field.value > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="review-title" className="block text-xs font-bold text-[#171717] mb-1.5">
              Review Title <span className="text-[#C66A4A]">*</span>
            </label>
            <input
              id="review-title"
              type="text"
              {...register('title')}
              placeholder="e.g., Exceptional views and thoughtful layout"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] ${
                errors.title ? 'border-[#DC2626] bg-red-50/20' : 'border-[#E2E2DF] bg-white'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-xs font-bold text-[#171717] mb-1.5">
              Your Review Experience <span className="text-[#C66A4A]">*</span>
            </label>
            <textarea
              id="review-comment"
              rows={4}
              {...register('comment')}
              placeholder="Share details about the construction quality, natural light, society amenities, accessibility, or owner interaction..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] ${
                errors.comment ? 'border-[#DC2626] bg-red-50/20' : 'border-[#E2E2DF] bg-white'
              }`}
            />
            {errors.comment && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.comment.message}</p>
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
              disabled={isSubmitting}
            >
              {isEditing ? 'Save Changes' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

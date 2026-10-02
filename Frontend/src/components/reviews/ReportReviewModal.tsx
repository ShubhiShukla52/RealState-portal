import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { X, AlertTriangle } from 'lucide-react';
import { ReportReason } from '../../types/review';
import { Button } from '../ui/Button';

const reportSchema = z.object({
  reason: z.enum([
    'Spam',
    'Inappropriate Content',
    'Misleading Information',
    'Offensive Language',
    'Other',
  ]),
  note: z.string().max(300, 'Note must be under 300 characters').optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export interface ReportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewTitle: string;
  onReport: (reason: ReportReason, note?: string) => void;
}

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  isOpen,
  onClose,
  reviewTitle,
  onReport,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    defaultValues: {
      reason: 'Misleading Information',
      note: '',
    },
    resolver: async (values) => {
      const result = reportSchema.safeParse(values);
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
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

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

  const onSubmit = (data: ReportFormData) => {
    onReport(data.reason, data.note);
    onClose();
  };

  const reasons: ReportReason[] = [
    'Spam',
    'Inappropriate Content',
    'Misleading Information',
    'Offensive Language',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E2DF] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#DC2626] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-base font-bold text-[#171717]">
                Report Review
              </h2>
              <p className="text-xs text-[#737373] truncate max-w-[240px]">
                Regarding: &quot;{reviewTitle}&quot;
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-2">
              Reason for Reporting
            </label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2.5 text-xs text-[#222222] cursor-pointer p-2 rounded-lg hover:bg-[#F5F5F2] transition-colors"
                >
                  <input
                    type="radio"
                    value={r}
                    {...register('reason')}
                    className="accent-[#171717] w-4 h-4"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            {errors.reason && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="report-note" className="block text-xs font-bold text-[#171717] mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              id="report-note"
              rows={3}
              {...register('note')}
              placeholder="Provide any additional context for the moderation team..."
              className="w-full px-3 py-2 rounded-xl border border-[#E2E2DF] text-xs text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717]"
            />
            {errors.note && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.note.message}</p>
            )}
          </div>

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
              className="bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white"
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

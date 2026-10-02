import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../../../types/property';
import { useInquiries } from '../../../context/InquiryContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const TIME_OPTIONS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const visitSchema = z.object({
  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Date cannot be in the past'),
  preferredTime: z.string().min(1, 'Please select a preferred time slot'),
  name: z.string().trim().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  message: z.string().trim().max(500, 'Message cannot exceed 500 characters').optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

export interface RequestVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const RequestVisitModal: React.FC<RequestVisitModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const { addInquiry } = useInquiries();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInquiryId, setCreatedInquiryId] = useState<string | null>(null);

  // Today in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisitFormData>({
    defaultValues: {
      preferredDate: '',
      preferredTime: '11:00 AM',
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    resolver: async (values) => {
      const result = visitSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      const fieldErrors: Record<string, { type: string; message: string }> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = { type: issue.code, message: issue.message };
        }
      });
      return { values: {}, errors: fieldErrors };
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: VisitFormData) => {
    const created = addInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images[0],
      propertyLocation: property.location || `${property.locality}, ${property.city}`,
      propertyPrice: property.price,
      listingType: property.listingType,
      userName: data.name,
      userEmail: data.email,
      userPhone: data.phone,
      ownerId: property.owner?.name,
      ownerName: property.owner?.name,
      ownerPhone: property.owner?.phone,
      type: 'visit',
      message: data.message || `Request to schedule physical walkthrough of ${property.title}.`,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      status: 'visit_requested',
    });

    setCreatedInquiryId(created.id);
    setIsSuccess(true);
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    setCreatedInquiryId(null);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E2E2DF] overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E2DF] flex items-center justify-between bg-[#F5F5F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 id="visit-modal-title" className="text-base font-bold text-[#171717]">
                Request a Property Visit
              </h3>
              <p className="text-xs text-[#737373] truncate max-w-xs sm:max-w-sm">
                {property.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#E2E2DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center space-y-4 py-3 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#171717]">
                  Visit request submitted.
                </h4>
                <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-sm mx-auto">
                  We'll notify you when the owner responds.
                </p>
              </div>

              {/* Disclaimer callout as required */}
              <div className="bg-[#F8EBE6] border border-[#C66A4A]/20 rounded-xl p-3.5 text-left text-xs text-[#222222] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#C66A4A] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important:</strong> Your requested time is not confirmed until the owner responds. You will receive an on-screen update and notification once confirmed.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-center">
                {createdInquiryId && (
                  <Link to={`/inquiries/${createdInquiryId}`} onClick={handleClose} className="w-full sm:w-auto">
                    <Button variant="primary" size="sm" icon={ArrowRight} className="w-full justify-center">
                      View Request Status
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleClose} className="w-full sm:w-auto justify-center">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="visit-date" className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Preferred Date <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="visit-date"
                      type="date"
                      min={todayStr}
                      {...register('preferredDate')}
                      className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-1 ${
                        errors.preferredDate
                          ? 'border-[#DC2626] focus:ring-[#DC2626]'
                          : 'border-[#E2E2DF] focus:border-[#171717] focus:ring-[#171717]'
                      }`}
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{errors.preferredDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="visit-time" className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Preferred Time Slot <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    id="visit-time"
                    {...register('preferredTime')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E2DF] bg-white focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]"
                  >
                    {TIME_OPTIONS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{errors.preferredTime.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-2 border-t border-[#E2E2DF] space-y-3">
                <Input
                  id="visit-name"
                  label="Your Full Name"
                  placeholder="e.g. Kunal Patel"
                  icon={User}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="visit-email"
                    type="email"
                    label="Email Address"
                    placeholder="kunal@example.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Input
                    id="visit-phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="+91 98200 12345"
                    icon={Phone}
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                <div>
                  <label htmlFor="visit-message" className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Note or Questions (Optional)
                  </label>
                  <textarea
                    id="visit-message"
                    rows={2}
                    placeholder="Any specific requests or requirements for the visit..."
                    {...register('message')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E2DF] bg-white focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{errors.message.message}</p>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#737373] bg-[#F5F5F2] p-2.5 rounded-lg leading-relaxed border border-[#E2E2DF]">
                EstateX will send your visit request directly to the listing owner. Your requested time is not confirmed until the owner responds.
              </p>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Confirm Request'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

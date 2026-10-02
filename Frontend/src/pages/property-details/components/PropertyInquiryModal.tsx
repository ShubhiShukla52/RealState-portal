import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  X,
  MessageSquare,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../../../types/property';
import { useInquiries } from '../../../context/InquiryContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { InquiryType } from '../../../types/inquiry';

const inquirySchema = z.object({
  inquiryType: z.enum(['general', 'price', 'availability', 'other']),
  name: z.string().trim().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters long').max(1000, 'Message cannot exceed 1000 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export interface PropertyInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  initialType?: InquiryType;
}

export const PropertyInquiryModal: React.FC<PropertyInquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  initialType = 'general',
}) => {
  const { addInquiry } = useInquiries();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInquiryId, setCreatedInquiryId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    defaultValues: {
      inquiryType: initialType === 'visit' ? 'general' : initialType,
      name: '',
      email: '',
      phone: '',
      message: `Hi, I am interested in "${property.title}". Please provide more information about this property.`,
    },
    resolver: async (values) => {
      const result = inquirySchema.safeParse(values);
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

  const onSubmit = (data: InquiryFormData) => {
    // Map 'other' to 'general' for backend/type compatibility
    const mappedType: InquiryType =
      data.inquiryType === 'other' ? 'general' : (data.inquiryType as InquiryType);

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
      type: mappedType,
      message: data.message,
      status: 'pending',
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
      aria-labelledby="inquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E2E2DF] overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E2DF] flex items-center justify-between bg-[#F5F5F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C66A4A] text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 id="inquiry-modal-title" className="text-base font-bold text-[#171717]">
                Submit Property Inquiry
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
                  Inquiry submitted successfully.
                </h4>
                <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-sm mx-auto">
                  The listing owner has been notified and will reply shortly. You can track this inquiry in your dashboard.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-center">
                <Link to="/inquiries" onClick={handleClose} className="w-full sm:w-auto">
                  <Button variant="primary" size="sm" icon={ArrowRight} className="w-full justify-center">
                    View My Inquiries
                  </Button>
                </Link>
                {createdInquiryId && (
                  <Link to={`/inquiries/${createdInquiryId}`} onClick={handleClose} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      View Inquiry Details
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Inquiry Type Radio / Select */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Inquiry Type <span className="text-[#DC2626]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'general', label: 'General Question' },
                    { value: 'price', label: 'Price Inquiry' },
                    { value: 'availability', label: 'Availability' },
                    { value: 'other', label: 'Other Question' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E2DF] hover:border-[#171717] cursor-pointer text-xs font-medium text-[#222222] transition-colors has-[:checked]:border-[#171717] has-[:checked]:bg-[#F5F5F2]"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('inquiryType')}
                        className="text-[#171717] focus:ring-[#171717]"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 pt-2 border-t border-[#E2E2DF]">
                <Input
                  id="inquiry-name"
                  label="Your Full Name"
                  placeholder="e.g. Kunal Patel"
                  icon={User}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="inquiry-email"
                    type="email"
                    label="Email Address"
                    placeholder="kunal@example.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Input
                    id="inquiry-phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="+91 98200 12345"
                    icon={Phone}
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-message" className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Your Message <span className="text-[#DC2626]">*</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={3}
                    placeholder="Type your question or query regarding this property..."
                    {...register('message')}
                    className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 ${
                      errors.message
                        ? 'border-[#DC2626] focus:ring-[#DC2626]'
                        : 'border-[#E2E2DF] focus:border-[#171717] focus:ring-[#171717]'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{errors.message.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

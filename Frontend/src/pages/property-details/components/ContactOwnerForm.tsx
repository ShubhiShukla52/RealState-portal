import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Mail, Phone, Send, CheckCircle2, MessageSquare, ArrowRight, Eye } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Property } from '../../../types/property';
import { useMessaging } from '../../../context/MessagingContext';
import { useInquiries } from '../../../context/InquiryContext';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  message: z.string().trim().min(1, 'Message is required'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export interface ContactOwnerFormProps {
  propertyTitle?: string;
  property?: Property;
}

export const ContactOwnerForm: React.FC<ContactOwnerFormProps> = ({
  propertyTitle,
  property,
}) => {
  const navigate = useNavigate();
  const { startOrOpenConversation } = useMessaging();
  const { addInquiry } = useInquiries();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdConvId, setCreatedConvId] = useState<string | null>(null);
  const [createdInquiryId, setCreatedInquiryId] = useState<string | null>(null);

  const title = property?.title || propertyTitle || 'this property';
  const defaultMessage = `Hi, I am interested in "${title}". Please share more details and availability for a site visit.`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: defaultMessage,
    },
    resolver: async (values) => {
      const result = contactSchema.safeParse(values);
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

  const onSubmit = (data: ContactFormData) => {
    if (property) {
      const convId = startOrOpenConversation(property, data.message);
      setCreatedConvId(convId);

      const inq = addInquiry({
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
        type: 'general',
        message: data.message,
        status: 'pending',
      });
      setCreatedInquiryId(inq.id);
    }
    setIsSuccess(true);
  };

  const handleReset = () => {
    reset();
    setIsSuccess(false);
    setCreatedConvId(null);
    setCreatedInquiryId(null);
  };

  return (
    <div
      id="contact-owner-form"
      className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#C66A4A]" />
        <h3 className="text-lg font-bold text-[#171717] tracking-tight">
          Send an Inquiry
        </h3>
      </div>

      {isSuccess ? (
        <div
          role="alert"
          className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-emerald-950">Inquiry Delivered!</h4>
            <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
              Your inquiry has been registered and delivered to the property owner. You can track this inquiry in your dashboard.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {createdInquiryId && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => navigate(`/inquiries/${createdInquiryId}`)}
                className="w-full justify-center"
                icon={Eye}
              >
                View Inquiry Details
              </Button>
            )}
            {createdConvId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/messages?conversationId=${createdConvId}`)
                }
                className="w-full justify-center border-emerald-300 text-emerald-900 hover:bg-emerald-100"
                icon={ArrowRight}
              >
                Open Conversation in Messages
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-full justify-center border-[#E2E2DF] text-[#737373]"
            >
              Send Another Inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            id="contact-name"
            label="Your Full Name"
            placeholder="e.g. Aditi Roy"
            icon={User}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            id="contact-email"
            type="email"
            label="Email Address"
            placeholder="e.g. aditi@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="contact-phone"
            type="tel"
            label="Phone Number"
            placeholder="e.g. 9876543210"
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-[#222222] mb-1.5"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={3}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#222222] placeholder-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] resize-none ${
                errors.message ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#A3A3A3]'
              }`}
              placeholder="Write your query or preferred viewing times..."
              {...register('message')}
            />
            {errors.message?.message && (
              <p className="mt-1.5 text-xs text-[#DC2626]">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            icon={Send}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>

          <p className="text-[11px] text-center text-[#A3A3A3]">
            By sending, you agree to EstateX terms and privacy policy.
          </p>
        </form>
      )}
    </div>
  );
};

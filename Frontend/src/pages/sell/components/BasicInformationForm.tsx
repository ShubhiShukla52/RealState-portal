import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IndianRupee, Tag, Type } from 'lucide-react';
import { PropertyFormData } from '../hooks/usePropertyForm';
import { Input } from '../../../components/ui/Input';
import { FormError } from '../../../components/forms/FormError';

export interface BasicInformationFormProps {
  form: UseFormReturn<PropertyFormData>;
}

export const BasicInformationForm: React.FC<BasicInformationFormProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const descriptionValue = watch('description') || '';
  const currentListingType = watch('listingType');
  const currentPrice = watch('price');

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#171717]">Basic Information</h2>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Provide the core listing highlights, classification, and expected price.
        </p>
      </div>

      <div className="space-y-4">
        {/* Listing Type Selector */}
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1.5">
            Listing Intent <span className="text-[#C66A4A]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setValue('listingType', 'sale', { shouldValidate: true })}
              className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                currentListingType === 'sale'
                  ? 'border-[#171717] bg-[#171717] text-white shadow-sm'
                  : 'border-[#E2E2DF] bg-white text-[#737373] hover:border-[#A3A3A3]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>For Sale</span>
            </button>

            <button
              type="button"
              onClick={() => setValue('listingType', 'rent', { shouldValidate: true })}
              className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                currentListingType === 'rent'
                  ? 'border-[#171717] bg-[#171717] text-white shadow-sm'
                  : 'border-[#E2E2DF] bg-white text-[#737373] hover:border-[#A3A3A3]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>For Rent</span>
            </button>
          </div>
        </div>

        {/* Property Type Radio / Buttons */}
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1.5">
            Property Category <span className="text-[#C66A4A]">*</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {propertyTypes.map((type) => {
              const selected = watch('propertyType') === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue('propertyType', type, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    selected
                      ? 'border-[#C66A4A] bg-[#F8EBE6] text-[#C66A4A]'
                      : 'border-[#E2E2DF] bg-white text-[#737373] hover:border-[#A3A3A3]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          {errors.propertyType?.message && (
            <FormError message={errors.propertyType.message} />
          )}
        </div>

        {/* Title */}
        <Input
          id="property-title"
          label="Property Title"
          placeholder="e.g. Modern 3 Bedroom Apartment with Balcony"
          icon={Type}
          error={errors.title?.message}
          helperText="A clear, appealing headline highlighting key configuration and location."
          {...register('title')}
        />

        {/* Price with Indian Currency Preview */}
        <div>
          <Input
            id="property-price"
            type="number"
            label={currentListingType === 'sale' ? 'Expected Price (₹)' : 'Monthly Rent (₹)'}
            placeholder="e.g. 8500000"
            icon={IndianRupee}
            error={errors.price?.message}
            {...register('price')}
          />
          {currentPrice > 0 && (
            <p className="mt-1 text-xs text-[#C66A4A] font-medium">
              Formatted: ₹{Number(currentPrice).toLocaleString('en-IN')}
              {currentListingType === 'rent' ? ' / month' : ''}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="property-description" className="block text-sm font-medium text-[#222222]">
              Detailed Description <span className="text-[#C66A4A]">*</span>
            </label>
            <span
              className={`text-xs ${
                descriptionValue.length < 30
                  ? 'text-[#DC2626]'
                  : descriptionValue.length > 2000
                  ? 'text-[#DC2626]'
                  : 'text-[#737373]'
              }`}
            >
              {descriptionValue.length} / 2000 (min 30)
            </span>
          </div>

          <div className="relative">
            <textarea
              id="property-description"
              rows={5}
              placeholder="Highlight architectural aspects, orientation, interior finishes, society conveniences, transit connectivity, and possession timeline..."
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#222222] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] resize-none ${
                errors.description ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#A3A3A3]'
              }`}
              {...register('description')}
            />
          </div>
          {errors.description?.message && (
            <FormError message={errors.description.message} />
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BedDouble, Bath, Maximize2, Car, Armchair, Layers } from 'lucide-react';
import { PropertyFormData } from '../hooks/usePropertyForm';
import { Input } from '../../../components/ui/Input';
import { FormError } from '../../../components/forms/FormError';

export interface PropertyDetailsFormProps {
  form: UseFormReturn<PropertyFormData>;
}

export const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentFurnishing = watch('furnishing');
  const currentParking = watch('parking');

  const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
  const parkingOptions = ['None', '1 Covered', '2 Covered', '3+ Slots'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#171717]">Property Specifications</h2>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Define dimensional metrics, rooms, level placements, and furnishing standards.
        </p>
      </div>

      <div className="space-y-5">
        {/* Bedrooms, Bathrooms & Super Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="details-bedrooms"
            type="number"
            min="0"
            label="Bedrooms (BHK)"
            placeholder="e.g. 3"
            icon={BedDouble}
            error={errors.bedrooms?.message}
            {...register('bedrooms')}
          />

          <Input
            id="details-bathrooms"
            type="number"
            min="0"
            label="Bathrooms"
            placeholder="e.g. 2"
            icon={Bath}
            error={errors.bathrooms?.message}
            {...register('bathrooms')}
          />

          <Input
            id="details-area"
            type="number"
            min="1"
            label="Super Built-up (sq.ft)"
            placeholder="e.g. 1650"
            icon={Maximize2}
            error={errors.area?.message}
            {...register('area')}
          />
        </div>

        {/* Furnishing Status Selection */}
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1.5 flex items-center gap-1.5">
            <Armchair className="w-4 h-4 text-[#A3A3A3]" />
            <span>Furnishing Status <span className="text-[#C66A4A]">*</span></span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {furnishingOptions.map((opt) => {
              const selected = currentFurnishing === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setValue('furnishing', opt, { shouldValidate: true })}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    selected
                      ? 'border-[#C66A4A] bg-[#F8EBE6] text-[#C66A4A] shadow-2xs'
                      : 'border-[#E2E2DF] bg-white text-[#737373] hover:border-[#A3A3A3]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {errors.furnishing?.message && (
            <FormError message={errors.furnishing.message} />
          )}
        </div>

        {/* Parking Allocation */}
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1.5 flex items-center gap-1.5">
            <Car className="w-4 h-4 text-[#A3A3A3]" />
            <span>Parking Space <span className="text-[#C66A4A]">*</span></span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {parkingOptions.map((opt) => {
              const selected = currentParking === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setValue('parking', opt, { shouldValidate: true })}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    selected
                      ? 'border-[#C66A4A] bg-[#F8EBE6] text-[#C66A4A] shadow-2xs'
                      : 'border-[#E2E2DF] bg-white text-[#737373] hover:border-[#A3A3A3]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {errors.parking?.message && (
            <FormError message={errors.parking.message} />
          )}
        </div>

        {/* Floor and Total Floors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="details-floor"
            label="Floor Level"
            placeholder="e.g. 4th Floor, Ground Floor"
            icon={Layers}
            error={errors.floor?.message}
            {...register('floor')}
          />

          <Input
            id="details-total-floors"
            label="Total Floors in Building"
            placeholder="e.g. 18 Floors, 4 Floors"
            icon={Layers}
            error={errors.totalFloors?.message}
            {...register('totalFloors')}
          />
        </div>
      </div>
    </div>
  );
};

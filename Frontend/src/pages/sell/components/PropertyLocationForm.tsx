import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Building, Compass, Hash } from 'lucide-react';
import { PropertyFormData } from '../hooks/usePropertyForm';
import { Input } from '../../../components/ui/Input';

export interface PropertyLocationFormProps {
  form: UseFormReturn<PropertyFormData>;
}

export const PropertyLocationForm: React.FC<PropertyLocationFormProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#171717]">Property Location</h2>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Specify exact address details so interested buyers can identify the neighborhood and transit conveniences.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Street Address */}
        <Input
          id="location-address"
          label="Street Address / Tower & Unit"
          placeholder="e.g. Tower 4, Flat 1204, The Pavilion Greens, Expressway"
          icon={Building}
          error={errors.address?.message}
          {...register('address')}
        />

        {/* Locality & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="location-locality"
            label="Locality / Sector / Neighborhood"
            placeholder="e.g. Sector 128"
            icon={Compass}
            error={errors.locality?.message}
            {...register('locality')}
          />

          <Input
            id="location-city"
            label="City"
            placeholder="e.g. Noida, Gurugram, Mumbai, Bengaluru"
            icon={MapPin}
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        {/* State & Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="location-state"
            label="State"
            placeholder="e.g. Uttar Pradesh, Maharashtra, Karnataka"
            icon={MapPin}
            error={errors.state?.message}
            {...register('state')}
          />

          <Input
            id="location-pincode"
            label="PIN Code (6 digits)"
            placeholder="e.g. 201304"
            maxLength={6}
            icon={Hash}
            error={errors.pincode?.message}
            {...register('pincode')}
          />
        </div>

        {/* Map Location Card Placeholder */}
        <div className="rounded-xl border border-[#E2E2DF] bg-[#F5F5F2] p-6 text-center select-none space-y-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-[#171717] text-[#C66A4A] mx-auto flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#171717]">Map Location</h4>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            Interactive map coordinate pinning and automated neighborhood boundary mapping will be available here in future updates.
          </p>
          <span className="inline-block text-[11px] font-semibold text-[#737373] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#E2E2DF]">
            Coordinates will auto-sync with PIN code
          </span>
        </div>
      </div>
    </div>
  );
};

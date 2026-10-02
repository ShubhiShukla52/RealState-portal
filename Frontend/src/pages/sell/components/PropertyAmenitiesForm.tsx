import React from 'react';
import {
  Wind,
  Car,
  Zap,
  Shield,
  ArrowUpDown,
  Waves,
  Dumbbell,
  Trees,
  Video,
  Building2,
  Smile,
  Snowflake,
  Wifi,
  Droplets,
  Check,
  LucideIcon,
} from 'lucide-react';

export interface PropertyAmenitiesFormProps {
  selectedAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
}

const availableAmenities: { name: string; icon: LucideIcon }[] = [
  { name: 'Balcony', icon: Wind },
  { name: 'Covered Parking', icon: Car },
  { name: 'Power Backup', icon: Zap },
  { name: 'Security', icon: Shield },
  { name: 'Lift', icon: ArrowUpDown },
  { name: 'Swimming Pool', icon: Waves },
  { name: 'Gym', icon: Dumbbell },
  { name: 'Garden', icon: Trees },
  { name: 'CCTV', icon: Video },
  { name: 'Club House', icon: Building2 },
  { name: 'Kids Play Area', icon: Smile },
  { name: 'Air Conditioning', icon: Snowflake },
  { name: 'Internet', icon: Wifi },
  { name: 'Water Supply', icon: Droplets },
];

export const PropertyAmenitiesForm: React.FC<PropertyAmenitiesFormProps> = ({
  selectedAmenities,
  onToggleAmenity,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#171717]">Select Amenities</h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Choose all lifestyle features, conveniences, and safety amenities available in this residence.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F8EBE6] text-[#C66A4A] self-start sm:self-auto border border-[#C66A4A]/20">
          {selectedAmenities.length} Selected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableAmenities.map((amenity) => {
          const isSelected = selectedAmenities.includes(amenity.name);
          const Icon = amenity.icon;

          return (
            <button
              key={amenity.name}
              type="button"
              onClick={() => onToggleAmenity(amenity.name)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all group ${
                isSelected
                  ? 'border-[#C66A4A] bg-[#F8EBE6] text-[#171717] shadow-2xs ring-1 ring-[#C66A4A]'
                  : 'border-[#E2E2DF] bg-white text-[#737373] hover:border-[#A3A3A3] hover:text-[#171717]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#C66A4A] text-white'
                      : 'bg-[#F5F5F2] text-[#737373] group-hover:text-[#171717]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold truncate">
                  {amenity.name}
                </span>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#C66A4A] text-white flex items-center justify-center shrink-0 ml-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

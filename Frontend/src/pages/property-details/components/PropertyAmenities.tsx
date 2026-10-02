import React from 'react';
import {
  Car,
  Wind,
  Zap,
  Shield,
  ArrowUpDown,
  Waves,
  Dumbbell,
  Trees,
  Video,
  Building2,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { Property } from '../../../types/property';

export interface PropertyAmenitiesProps {
  property: Property;
}

// Icon dictionary matching amenity names dynamically
const amenityIconMap: Record<string, LucideIcon> = {
  'Covered Parking': Car,
  'Balcony': Wind,
  'Power Backup': Zap,
  'Security': Shield,
  'Lift': ArrowUpDown,
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Garden': Trees,
  'CCTV': Video,
  'Club House': Building2,
};

const defaultFallbackAmenities = [
  'Covered Parking',
  'Balcony',
  'Power Backup',
  'Security',
  'Lift',
  'Swimming Pool',
  'Gym',
  'Garden',
  'CCTV',
  'Club House',
];

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property }) => {
  // Use property.amenities if provided and not empty, otherwise default fallback list
  const amenitiesList = property.amenities && property.amenities.length > 0
    ? property.amenities
    : defaultFallbackAmenities;

  return (
    <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#171717] tracking-tight">
          Amenities
        </h2>
        <span className="text-xs text-[#737373] font-medium bg-[#F5F5F2] px-2.5 py-1 rounded-full border border-[#E2E2DF]">
          {amenitiesList.length} Features
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {amenitiesList.map((amenity, index) => {
          const Icon = amenityIconMap[amenity] || CheckCircle2;
          return (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F5F5F2]/50 hover:bg-[#F5F5F2] border border-[#E2E2DF]/60 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E2DF] flex items-center justify-center text-[#171717] shrink-0 group-hover:border-[#C66A4A]/40 transition-colors">
                <Icon className="w-4 h-4 text-[#C66A4A]" />
              </div>
              <span className="text-xs font-medium text-[#222222] leading-tight">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

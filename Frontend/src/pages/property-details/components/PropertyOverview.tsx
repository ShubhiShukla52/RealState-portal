import React from 'react';
import { BedDouble, Bath, Maximize2, Building2, Tag, Car, Armchair } from 'lucide-react';
import { Property } from '../../../types/property';
import { formatArea } from '../../../utils/formatters';

export interface PropertyOverviewProps {
  property: Property;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({ property }) => {
  const items = [
    {
      label: 'Bedrooms',
      value: `${property.bedrooms} ${property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`,
      icon: BedDouble,
    },
    {
      label: 'Bathrooms',
      value: `${property.bathrooms} ${property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`,
      icon: Bath,
    },
    {
      label: 'Super Area',
      value: formatArea(property.area),
      icon: Maximize2,
    },
    {
      label: 'Property Type',
      value: property.propertyType,
      icon: Building2,
    },
    {
      label: 'Listing Type',
      value: property.listingType === 'sale' ? 'For Sale' : 'For Rent',
      icon: Tag,
    },
    {
      label: 'Parking',
      value: property.parking || 'Available',
      icon: Car,
    },
    {
      label: 'Furnishing',
      value: property.furnishing || 'Unfurnished',
      icon: Armchair,
    },
  ];

  return (
    <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#171717] tracking-tight uppercase tracking-wider text-xs text-[#737373] mb-4">
        Property Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#F5F5F2]/70 hover:bg-[#F5F5F2] border border-[#E2E2DF]/60 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E2DF] flex items-center justify-center text-[#171717] shrink-0 shadow-2xs">
                <Icon className="w-4 h-4 text-[#C66A4A]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-[#171717] truncate mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

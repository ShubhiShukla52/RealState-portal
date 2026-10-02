import React from 'react';
import { Property } from '../../../types/property';
import { Layers, Compass, CheckCircle2, Hash, Calendar, ShieldCheck } from 'lucide-react';

export interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const details = [
    {
      label: 'Property ID',
      value: property.id.toUpperCase(),
      icon: Hash,
    },
    {
      label: 'Property Type',
      value: property.propertyType,
      icon: Layers,
    },
    {
      label: 'Floor',
      value: property.floor || 'Higher Floors',
      icon: Layers,
    },
    {
      label: 'Facing',
      value: property.facing || 'East Facing',
      icon: Compass,
    },
    {
      label: 'Possession Status',
      value: property.status || 'Ready to Move',
      icon: CheckCircle2,
    },
    {
      label: 'Listed On',
      value: property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently',
      icon: Calendar,
    },
    {
      label: 'Ownership',
      value: 'Freehold Title',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#171717] tracking-tight mb-4">
        Additional Specifications
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8">
        {details.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-[#E2E2DF]/60 last:border-b-0 sm:last:border-b"
            >
              <span className="flex items-center gap-2 text-xs sm:text-sm text-[#737373]">
                <Icon className="w-3.5 h-3.5 text-[#A3A3A3]" />
                {detail.label}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#171717]">
                {detail.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

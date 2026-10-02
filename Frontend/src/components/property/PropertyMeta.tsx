import React from 'react';
import { Bed, Bath, Maximize } from 'lucide-react';
import { formatArea } from '../../utils/formatters';

export interface PropertyMetaProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const PropertyMeta: React.FC<PropertyMetaProps> = ({
  bedrooms,
  bathrooms,
  area,
  variant = 'compact',
  className = '',
}) => {
  if (variant === 'detailed') {
    return (
      <div className={`grid grid-cols-3 gap-3 p-3.5 bg-[#F5F5F2] rounded-lg text-xs text-[#222222] ${className}`}>
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-[#737373]" />
          <span>{bedrooms} Bedrooms</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-4 h-4 text-[#737373]" />
          <span>{bathrooms} Baths</span>
        </div>
        <div className="flex items-center gap-2">
          <Maximize className="w-4 h-4 text-[#737373]" />
          <span>{formatArea(area)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 text-xs text-[#737373] ${className}`}>
      <span className="flex items-center gap-1">
        <Bed className="w-3.5 h-3.5 text-[#A3A3A3]" />
        <span>{bedrooms} Beds</span>
      </span>
      <span className="text-[#A3A3A3]">•</span>
      <span className="flex items-center gap-1">
        <Bath className="w-3.5 h-3.5 text-[#A3A3A3]" />
        <span>{bathrooms} Baths</span>
      </span>
      <span className="text-[#A3A3A3]">•</span>
      <span className="flex items-center gap-1">
        <Maximize className="w-3.5 h-3.5 text-[#A3A3A3]" />
        <span>{formatArea(area)}</span>
      </span>
    </div>
  );
};

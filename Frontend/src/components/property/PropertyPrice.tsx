import React from 'react';
import { formatPrice } from '../../utils/formatters';

export interface PropertyPriceProps {
  price: number;
  listingType?: 'sale' | 'rent';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const PropertyPrice: React.FC<PropertyPriceProps> = ({
  price,
  listingType = 'sale',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl sm:text-3xl font-extrabold',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {showLabel && (
        <span className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium mb-0.5">
          {listingType === 'rent' ? 'Monthly Rent' : 'Price'}
        </span>
      )}
      <span className={`text-[#171717] tracking-tight ${sizeStyles[size]}`}>
        {formatPrice(price, listingType)}
      </span>
    </div>
  );
};

import React from 'react';
import { PropertyWithDistance } from '../../types/search';
import { formatPrice } from '../../utils/formatters';

export interface MapMarkerProps {
  property: PropertyWithDistance;
  isSelected?: boolean;
  onClick: (property: PropertyWithDistance) => void;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
}

/**
 * Formats property price into a compact map badge representation.
 * Example: ₹1.85Cr, ₹68L, ₹36k/mo
 */
function getCompactPriceLabel(price: number, listingType: 'sale' | 'rent'): string {
  if (listingType === 'rent') {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L/mo`;
    }
    return `₹${Math.round(price / 1000)}k/mo`;
  }
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2).replace(/\.?0+$/, '')}Cr`;
  }
  if (price >= 100000) {
    const l = price / 100000;
    return `₹${l % 1 === 0 ? l : l.toFixed(1).replace(/\.?0+$/, '')}L`;
  }
  return formatPrice(price);
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  property,
  isSelected = false,
  onClick,
  xPercent,
  yPercent,
}) => {
  const priceText = getCompactPriceLabel(property.price, property.listingType);

  return (
    <div
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-full z-10 transition-transform duration-200"
    >
      <button
        type="button"
        onClick={() => onClick(property)}
        aria-label={`${property.title} - ${priceText}`}
        aria-pressed={isSelected}
        className={`group relative flex items-center justify-center font-bold text-xs tracking-tight rounded-full px-2.5 py-1 shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
          isSelected
            ? 'bg-[#C66A4A] text-white scale-110 z-30 ring-2 ring-white shadow-lg'
            : 'bg-[#171717] text-white hover:bg-[#C66A4A] hover:scale-105 z-10'
        }`}
      >
        <span>{priceText}</span>

        {/* Marker Anchor Pin Bottom */}
        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 transition-colors ${
            isSelected ? 'bg-[#C66A4A]' : 'bg-[#171717] group-hover:bg-[#C66A4A]'
          }`}
        />
      </button>
    </div>
  );
};

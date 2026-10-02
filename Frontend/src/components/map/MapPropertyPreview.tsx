import React from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, Bed, Bath, Maximize2, ExternalLink } from 'lucide-react';
import { PropertyWithDistance } from '../../types/search';
import { formatPrice } from '../../utils/formatters';
import { formatDistance } from '../../utils/distance';
import { ROUTES } from '../../constants/routes';

export interface MapPropertyPreviewProps {
  property: PropertyWithDistance;
  onClose: () => void;
  className?: string;
}

export const MapPropertyPreview: React.FC<MapPropertyPreviewProps> = ({
  property,
  onClose,
  className = '',
}) => {
  const propertyUrl = ROUTES.PROPERTY_DETAILS(property.id);

  return (
    <div
      className={`bg-white rounded-xl shadow-xl border border-[#E2E2DF] overflow-hidden max-w-sm w-full animate-in fade-in-50 zoom-in-95 duration-150 ${className}`}
    >
      {/* Property Thumbnail & Close Button */}
      <div className="relative aspect-video w-full bg-[#E2E2DF]">
        <img
          src={
            property.images[0] ||
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'
          }
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Listing Type Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              property.listingType === 'sale'
                ? 'bg-[#171717] text-white'
                : 'bg-[#C66A4A] text-white'
            }`}
          >
            {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#222222] shadow-xs">
            {property.propertyType}
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#222222] shadow-md flex items-center justify-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        {/* Price & Optional Distance */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-black text-[#171717]">
            {formatPrice(property.price)}
            {property.listingType === 'rent' && (
              <span className="text-xs font-normal text-[#737373] ml-1">/ month</span>
            )}
          </div>
          {typeof property.distance === 'number' && (
            <span className="text-[11px] font-semibold text-[#C66A4A] bg-[#F8EBE6] px-2 py-0.5 rounded-full border border-[#C66A4A]/20">
              {formatDistance(property.distance)}
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={propertyUrl} className="block group">
          <h4 className="text-sm font-bold text-[#222222] group-hover:text-[#C66A4A] line-clamp-1 transition-colors">
            {property.title}
          </h4>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-[#737373]">
          <MapPin className="w-3.5 h-3.5 text-[#C66A4A] shrink-0" />
          <span className="truncate">
            {property.locality}, {property.city}
          </span>
        </div>

        {/* Meta Stats: Beds, Baths, Area */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#F5F5F2] text-xs text-[#737373]">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>{property.area} sq.ft</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            to={propertyUrl}
            className="w-full py-2 px-3 rounded-lg bg-[#171717] hover:bg-[#C66A4A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <span>View Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { MessagePropertyContext } from '../../types/message';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';

export interface PropertyContextCardProps {
  property: MessagePropertyContext;
  className?: string;
}

export const PropertyContextCard: React.FC<PropertyContextCardProps> = ({
  property,
  className = '',
}) => {
  const propertyUrl = ROUTES.PROPERTY_DETAILS(property.id);

  return (
    <div
      className={`bg-white border border-[#E2E2DF] rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
    >
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#171717] shrink-0 border border-[#E2E2DF]">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C66A4A] bg-[#F8EBE6] px-1.5 py-0.2 rounded">
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="text-xs font-black text-[#171717]">
              {formatPrice(property.price)}
              {property.listingType === 'rent' && (
                <span className="text-[10px] font-normal text-[#737373] ml-0.5">/mo</span>
              )}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-[#222222] truncate max-w-sm">
            {property.title}
          </h4>

          <div className="flex items-center gap-2.5 text-[11px] text-[#737373] mt-0.5">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-[#C66A4A] shrink-0" />
              <span className="truncate">{property.location}</span>
            </span>

            {property.bedrooms && (
              <span className="hidden sm:inline-flex items-center gap-1 shrink-0">
                <Bed className="w-3 h-3 text-[#A3A3A3]" />
                <span>{property.bedrooms} BHK</span>
              </span>
            )}
            {property.bathrooms && (
              <span className="hidden sm:inline-flex items-center gap-1 shrink-0">
                <Bath className="w-3 h-3 text-[#A3A3A3]" />
                <span>{property.bathrooms} Baths</span>
              </span>
            )}
            {property.area && (
              <span className="hidden md:inline-flex items-center gap-1 shrink-0">
                <Maximize2 className="w-3 h-3 text-[#A3A3A3]" />
                <span>{property.area} sq.ft</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: View Property CTA */}
      <Link
        to={propertyUrl}
        className="shrink-0 w-full sm:w-auto px-3 py-1.5 rounded-lg border border-[#171717] bg-white hover:bg-[#171717] text-[#171717] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
      >
        <span>View Property</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

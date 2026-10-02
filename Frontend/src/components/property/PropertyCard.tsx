import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Navigation, Star } from 'lucide-react';
import { Property } from '../../types/property';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PropertyImage } from './PropertyImage';
import { PropertyPrice } from './PropertyPrice';
import { PropertyMeta } from './PropertyMeta';
import { ROUTES } from '../../constants/routes';
import { formatDistance } from '../../utils/distance';
import { useFavorites } from '../../context/FavoritesContext';
import { useReviews } from '../../context/ReviewsContext';

export interface PropertyCardProps {
  property: Property;
  initialFavorite?: boolean;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
  className?: string;
  distance?: number | null;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavoriteToggle,
  className = '',
  distance,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getPropertyRatingSummary } = useReviews();
  const favorite = isFavorite(property.id);
  const ratingSummary = getPropertyRatingSummary(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
    if (onFavoriteToggle) {
      onFavoriteToggle(property.id, !favorite);
    }
  };

  const propertyDetailUrl = ROUTES.PROPERTY_DETAILS(property.id);

  return (
    <Card
      hoverable
      className={`group p-0 overflow-hidden flex flex-col h-full bg-white border border-[#E2E2DF] rounded-xl transition-all duration-200 ${className}`}
    >
      {/* Property Image with Badges & Favorite Button */}
      <PropertyImage
        src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
        alt={property.title}
        aspectRatio="video"
        badges={
          <>
            <Badge variant={property.listingType === 'sale' ? 'accent' : 'default'} size="sm">
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
            <Badge variant="outline" size="sm" className="bg-white/95 backdrop-blur-sm border-[#E2E2DF] text-[#222222]">
              {property.propertyType}
            </Badge>
          </>
        }
        actionOverlay={
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorite ? `Remove ${property.title} from favorites` : `Add ${property.title} to favorites`}
            aria-pressed={favorite}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#E2E2DF] flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorite
                  ? 'fill-[#C66A4A] text-[#C66A4A]'
                  : 'text-[#737373] hover:text-[#C66A4A]'
              }`}
            />
          </button>
        }
      />

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Optional Distance */}
          <div className="flex items-center justify-between gap-1 text-xs text-[#737373] mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#C66A4A] shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {ratingSummary.totalReviews > 0 && (
                <span className="text-[11px] font-semibold text-[#171717] bg-[#F5F5F2] border border-[#E2E2DF] px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#C66A4A] text-[#C66A4A]" />
                  <span>{ratingSummary.averageRating.toFixed(1)}</span>
                  <span className="text-[#737373] font-normal">({ratingSummary.totalReviews})</span>
                </span>
              )}
              {typeof distance === 'number' && (
                <span className="shrink-0 text-[11px] font-semibold text-[#171717] bg-[#F5F5F2] border border-[#E2E2DF] px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Navigation className="w-2.5 h-2.5 text-[#C66A4A]" />
                  {formatDistance(distance)}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={propertyDetailUrl} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded">
            <h3 className="font-semibold text-base text-[#222222] line-clamp-1 mb-3 group-hover:text-[#171717] transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Bedrooms, Bathrooms, Area */}
          <div className="mb-4">
            <PropertyMeta
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
            />
          </div>
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-4 border-t border-[#E2E2DF] flex items-center justify-between gap-2">
          <PropertyPrice
            price={property.price}
            listingType={property.listingType}
            size="md"
            showLabel
          />

          <Link to={propertyDetailUrl} tabIndex={-1}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

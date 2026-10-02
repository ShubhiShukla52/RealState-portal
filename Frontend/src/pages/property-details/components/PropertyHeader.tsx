import React, { useState } from 'react';
import { MapPin, Heart, Share2, Check, Star } from 'lucide-react';
import { Property } from '../../../types/property';
import { Badge } from '../../../components/ui/Badge';
import { formatPrice } from '../../../utils/formatters';
import { useFavorites } from '../../../context/FavoritesContext';
import { useReviews } from '../../../context/ReviewsContext';

export interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const { getPropertyRatingSummary } = useReviews();
  const isFavorite = checkFavorite(property.id);
  const ratingSummary = getPropertyRatingSummary(property.id);
  const [copied, setCopied] = useState(false);

  const handleScrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pricePerSqFt = property.area > 0 
    ? Math.round(property.price / property.area)
    : null;

  const handleShare = async () => {
    const shareData = {
      title: `${property.title} | EstateX`,
      text: `Check out this property: ${property.title} in ${property.locality}, ${property.city}`,
      url: window.location.href,
    };

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or unsupported, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is blocked
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(property.id);
  };

  return (
    <div className="space-y-4">
      {/* Badges and Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={property.listingType === 'sale' ? 'accent' : 'primary'}
            size="md"
            className="uppercase tracking-wider text-xs font-semibold px-3 py-1"
          >
            {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
          <Badge
            variant="outline"
            size="md"
            className="bg-white border-[#E2E2DF] text-[#171717] font-medium px-3 py-1"
          >
            {property.propertyType}
          </Badge>
          {property.featured && (
            <Badge
              variant="outline"
              size="md"
              className="border-[#C66A4A]/30 bg-[#C66A4A]/10 text-[#C66A4A] font-semibold px-2.5 py-1 text-xs"
            >
              Featured
            </Badge>
          )}
          {property.status && (
            <span className="text-xs text-[#737373] bg-[#F5F5F2] border border-[#E2E2DF] px-2.5 py-1 rounded-full font-medium">
              {property.status}
            </span>
          )}
        </div>

        {/* Share & Favorite Buttons */}
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share property link"
            title="Share property"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E2DF] bg-white hover:bg-[#F5F5F2] text-[#222222] text-xs font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#737373]" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            title={isFavorite ? 'Saved to favorites' : 'Add to favorites'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E2DF] bg-white hover:bg-[#F5F5F2] text-[#222222] text-xs font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite
                  ? 'fill-[#C66A4A] text-[#C66A4A]'
                  : 'text-[#737373]'
              }`}
            />
            <span className={isFavorite ? 'text-[#C66A4A] font-semibold' : ''}>
              {isFavorite ? 'Saved' : 'Save'}
            </span>
          </button>

          {/* Toast Notification when copied */}
          {copied && (
            <div
              role="status"
              className="absolute right-0 -bottom-9 bg-[#171717] text-white text-xs px-3 py-1.5 rounded-md shadow-lg border border-white/10 whitespace-nowrap z-20 animate-in fade-in slide-in-from-top-1"
            >
              Property link copied to clipboard
            </div>
          )}
        </div>
      </div>

      {/* Title & Location */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171717] tracking-tight leading-tight mb-2">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base text-[#737373]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#C66A4A] shrink-0" />
            <span>
              {property.locality}, {property.city}
            </span>
          </div>

          {ratingSummary.totalReviews > 0 && (
            <button
              type="button"
              onClick={handleScrollToReviews}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#C66A4A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
            >
              <div className="flex items-center gap-1 bg-[#F8EBE6] text-[#C66A4A] px-2 py-0.5 rounded-md font-bold">
                <Star className="w-3.5 h-3.5 fill-[#C66A4A]" />
                <span>{ratingSummary.averageRating.toFixed(1)}</span>
              </div>
              <span className="underline decoration-[#A3A3A3] underline-offset-4">
                ({ratingSummary.totalReviews} {ratingSummary.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-wrap items-baseline gap-3 pt-1 border-b border-[#E2E2DF] pb-4">
        <span className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
          {formatPrice(property.price, property.listingType)}
        </span>
        {pricePerSqFt && (
          <span className="text-xs sm:text-sm text-[#737373] font-medium">
            (₹{pricePerSqFt.toLocaleString('en-IN')} / sq.ft)
          </span>
        )}
      </div>
    </div>
  );
};

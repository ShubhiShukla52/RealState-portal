import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

export interface FavoriteButtonProps {
  propertyId: string;
  propertyTitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  propertyTitle = 'property',
  className = '',
  size = 'md',
  showText = false,
  onToggle,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
    if (onToggle) {
      onToggle(!active);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const ariaLabel = active
    ? `Remove ${propertyTitle} from favorites`
    : `Add ${propertyTitle} to favorites`;

  if (showText) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-pressed={active}
        title={ariaLabel}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E2DF] bg-white hover:bg-[#F5F5F2] text-[#222222] text-xs font-medium transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${className}`}
      >
        <Heart
          className={`${iconSizes} transition-colors ${
            active ? 'fill-[#C66A4A] text-[#C66A4A]' : 'text-[#737373]'
          }`}
        />
        <span className={active ? 'text-[#C66A4A] font-semibold' : ''}>
          {active ? 'Saved' : 'Save'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      title={ariaLabel}
      className={`rounded-full bg-white/90 backdrop-blur-xs border border-[#E2E2DF] flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${sizeClasses} ${className}`}
    >
      <Heart
        className={`${iconSizes} transition-colors ${
          active ? 'fill-[#C66A4A] text-[#C66A4A]' : 'text-[#737373] hover:text-[#C66A4A]'
        }`}
      />
    </button>
  );
};

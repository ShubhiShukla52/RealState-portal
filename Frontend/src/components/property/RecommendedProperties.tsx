import React, { useMemo } from 'react';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getRecommendedProperties } from '../../utils/recommendations';
import { PropertySection } from './PropertySection';
import { ROUTES } from '../../constants/routes';

export interface RecommendedPropertiesProps {
  limit?: number;
  className?: string;
  columns?: 3 | 4;
}

export const RecommendedProperties: React.FC<RecommendedPropertiesProps> = ({
  limit = 4,
  className = '',
  columns = 4,
}) => {
  const { recentlyViewed } = useRecentlyViewed();
  const { favorites } = useFavorites();

  const viewedIds = useMemo(() => recentlyViewed.map((v) => v.propertyId), [recentlyViewed]);
  const favoriteIds = useMemo(() => favorites.map((f) => f.propertyId), [favorites]);

  const recommended = useMemo(() => {
    return getRecommendedProperties({
      viewedIds,
      favoriteIds,
      limit,
    });
  }, [viewedIds, favoriteIds, limit]);

  const hasActivity = viewedIds.length > 0 || favoriteIds.length > 0;

  return (
    <PropertySection
      badge="Curated"
      title="Recommended for You"
      subtitle={
        hasActivity
          ? "Selected residences based on properties you've viewed and saved."
          : 'Handpicked premium homes and apartments trending across our network.'
      }
      properties={recommended}
      viewAllLink={ROUTES.PROPERTIES}
      viewAllText="View All Properties"
      className={className}
      columns={columns}
    />
  );
};

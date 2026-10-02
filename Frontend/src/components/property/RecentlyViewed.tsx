import React from 'react';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { PropertySection } from './PropertySection';
import { ROUTES } from '../../constants/routes';

export interface RecentlyViewedProps {
  maxItems?: number;
  className?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  maxItems = 4,
  className = '',
}) => {
  const { recentlyViewedProperties } = useRecentlyViewed();

  if (recentlyViewedProperties.length === 0) {
    return null;
  }

  const displayProperties = recentlyViewedProperties.slice(0, maxItems);

  return (
    <PropertySection
      badge="History"
      title="Recently Viewed"
      subtitle="Pick up right where you left off with homes you explored recently."
      properties={displayProperties}
      viewAllLink={ROUTES.PROPERTIES}
      viewAllText="Explore More"
      className={className}
      columns={4}
    />
  );
};

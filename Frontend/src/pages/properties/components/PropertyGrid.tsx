import React from 'react';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { PropertyWithDistance } from '../../../types/search';
import { SearchX, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface PropertyGridProps {
  properties: PropertyWithDistance[];
  isLoading?: boolean;
  onClearFilters: () => void;
  onChangeLocation?: () => void;
  layout?: 'standard' | 'split';
  className?: string;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  isLoading = false,
  onClearFilters,
  onChangeLocation,
  layout = 'standard',
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Updating properties..." />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-12 px-6 text-center bg-white border border-[#E2E2DF] rounded-2xl shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#F5F5F2] flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 text-[#737373]" />
        </div>
        <h3 className="text-lg font-bold text-[#171717] mb-1">No properties found</h3>
        <p className="text-sm text-[#737373] max-w-md mx-auto mb-6">
          Try adjusting your filters or searching another location.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </Button>
          {onChangeLocation && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeLocation}
              className="inline-flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C66A4A]" />
              <span>Change Location</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        layout === 'split'
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
      } ${className}`}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          distance={property.distance}
        />
      ))}
    </div>
  );
};

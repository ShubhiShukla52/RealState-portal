import React, { useMemo } from 'react';
import { Property } from '../../../types/property';
import { mockProperties } from '../../../data/mockProperties';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { SectionHeading } from '../../../components/common/SectionHeading';
import { getSimilarProperties } from '../../../utils/recommendations';

export interface SimilarPropertiesProps {
  currentProperty: Property;
  allProperties?: Property[];
}

export const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentProperty,
  allProperties = mockProperties,
}) => {
  const similar = useMemo(() => {
    return getSimilarProperties(currentProperty, allProperties, 4);
  }, [currentProperty, allProperties]);

  if (similar.length === 0) {
    return null;
  }

  return (
    <section className="pt-12 sm:pt-16 border-t border-[#E2E2DF]">
      <SectionHeading
        badge="Discovery"
        title="Similar Properties"
        subtitle="Explore comparable residences in matching locations and architectural styles."
        className="mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};

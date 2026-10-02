import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Property } from '../../types/property';
import { PropertyCard } from './PropertyCard';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../ui/Container';

export interface PropertySectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  properties: Property[];
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
  columns?: 3 | 4;
}

export const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  subtitle,
  badge,
  properties,
  viewAllLink,
  viewAllText = 'View All',
  className = '',
  columns = 4,
}) => {
  if (properties.length === 0) {
    return null;
  }

  const gridColsClass = columns === 3
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <Container size="xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <SectionHeading
            badge={badge}
            title={title}
            subtitle={subtitle}
            className="mb-0 text-left"
          />

          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors shrink-0 self-start sm:self-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C66A4A] rounded px-1"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className={`grid ${gridColsClass} gap-6`}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </Container>
    </section>
  );
};

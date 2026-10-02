import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { SectionHeading } from '../../../components/common/SectionHeading';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { featuredProperties } from '../../../data/mockProperties';
import { ROUTES } from '../../../constants/routes';

export const FeaturedProperties: React.FC = () => {
  // Take top 6 featured properties
  const displayProperties = featuredProperties.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-white border-y border-[#E2E2DF]">
      <Container size="xl">
        <SectionHeading
          title="Featured Properties"
          subtitle="Explore some of the properties people are discovering on EstateX across India's top cities."
          badge="Curated Selection"
          action={
            <Link to={ROUTES.PROPERTIES} className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                View All Properties
              </Button>
            </Link>
          }
        />

        {/* 6 Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Mobile View All Properties Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link to={ROUTES.PROPERTIES}>
            <Button variant="secondary" size="md" className="w-full" icon={ArrowRight} iconPosition="right">
              View All Properties
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Home,
  Building,
  Layers,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { SectionHeading } from '../../../components/common/SectionHeading';
import { ROUTES } from '../../../constants/routes';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PropertyCategories: React.FC = () => {
  const categories: CategoryItem[] = [
    {
      id: 'apartments',
      name: 'Apartments',
      description: 'Modern high-rises, penthouses, and condominiums in prime urban sectors.',
      count: '420+ Listings',
      icon: Building2,
    },
    {
      id: 'houses',
      name: 'Houses',
      description: 'Independent builder floors and residential homes with dedicated parking.',
      count: '180+ Listings',
      icon: Home,
    },
    {
      id: 'villas',
      name: 'Villas',
      description: 'Private gated estates, luxury duplexes, and landscaped suburban residences.',
      count: '95+ Listings',
      icon: Building,
    },
    {
      id: 'plots',
      name: 'Plots',
      description: 'Residential & mixed-use freehold plots ready for custom development.',
      count: '140+ Listings',
      icon: Layers,
    },
    {
      id: 'commercial',
      name: 'Commercial',
      description: 'Grade-A corporate office suites, retail outlets, and co-working towers.',
      count: '110+ Listings',
      icon: Briefcase,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F2]">
      <Container size="xl">
        <SectionHeading
          title="Explore Properties"
          subtitle="Find the right property for every lifestyle across key categories."
          badge="Property Types"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`${ROUTES.PROPERTIES}?category=${category.id}`}
                className="group bg-white rounded-xl border border-[#E2E2DF] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#C66A4A] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#F8EBE6] text-[#C66A4A] flex items-center justify-center transition-colors group-hover:bg-[#171717] group-hover:text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#A3A3A3] transition-colors group-hover:text-[#C66A4A]" />
                  </div>

                  <h3 className="text-base font-bold text-[#222222] mb-1.5 group-hover:text-[#171717]">
                    {category.name}
                  </h3>

                  <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E2E2DF] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#171717]">{category.count}</span>
                  <span className="text-[#C66A4A] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

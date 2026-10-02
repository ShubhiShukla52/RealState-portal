import React from 'react';
import { ShieldCheck, Search, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { SectionHeading } from '../../../components/common/SectionHeading';
import { Card } from '../../../components/ui/Card';

export const WhyEstateX: React.FC = () => {
  const features = [
    {
      title: 'Verified Properties',
      description: 'Discover listings with clear and structured property information vetted for accuracy.',
      icon: ShieldCheck,
    },
    {
      title: 'Easy Property Search',
      description: 'Find properties using location, type, price, and other preferences effortlessly.',
      icon: Search,
    },
    {
      title: 'Connect With Owners',
      description: 'Reach property owners directly when you find the right place without middleman bottlenecks.',
      icon: MessageSquare,
    },
    {
      title: 'Simple & Transparent',
      description: 'Everything you need to explore properties in one clean, architectural experience.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F2]">
      <Container size="xl">
        <SectionHeading
          title="Why Choose EstateX?"
          subtitle="Designed to eliminate friction from property search, verified comparisons, and owner negotiations."
          badge="The EstateX Advantage"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 bg-white border border-[#E2E2DF] hover:border-[#C66A4A] transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F8EBE6] text-[#C66A4A] flex items-center justify-center mb-5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#222222] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

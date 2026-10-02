import React from 'react';
import { Search, SlidersHorizontal, KeyRound } from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { SectionHeading } from '../../../components/common/SectionHeading';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search',
      description: 'Explore properties using your preferred location, type, and budget.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Compare',
      description: 'Review property details and find the options that fit your needs.',
      icon: SlidersHorizontal,
    },
    {
      step: '03',
      title: 'Connect',
      description: 'Contact the owner and take the next step toward your new property.',
      icon: KeyRound,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#E2E2DF]">
      <Container size="xl">
        <SectionHeading
          title="Find Your Next Home in 3 Simple Steps"
          subtitle="Navigate from initial browsing to property tour in minutes."
          badge="Simple Process"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mt-12">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#F5F5F2] rounded-2xl p-8 border border-[#E2E2DF] flex flex-col justify-between transition-all duration-200 hover:border-[#A3A3A3]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-[#C66A4A] tracking-tighter">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E2DF] text-[#171717] flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#222222] mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#737373] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E2E2DF]/60 text-xs text-[#A3A3A3] font-medium">
                  Step {index + 1} of 3
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

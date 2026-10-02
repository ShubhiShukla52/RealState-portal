import React from 'react';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Building2, ShieldCheck, Compass, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const highlights = [
    {
      title: 'Architectural Excellence',
      description: 'Carefully curated properties prioritizing exceptional layout, natural light, and modern craftsmanship.',
      icon: Building2,
    },
    {
      title: 'Verified Listings',
      description: '100% verified titles and vetted real estate partners across primary urban corridors in India.',
      icon: ShieldCheck,
    },
    {
      title: 'Seamless Discovery',
      description: 'Streamlined search, transparent pricing, and instant connections between buyers, sellers, and tenants.',
      icon: Compass,
    },
    {
      title: 'Trusted Community',
      description: 'Empowering homeowners, brokers, and institutional developers with modern transaction tools.',
      icon: Users,
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <Container size="lg">
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-widest text-[#C66A4A] font-semibold mb-2">
            About EstateX
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            A refined approach to modern real estate.
          </h1>
          <p className="text-base text-[#737373] leading-relaxed">
            EstateX is India's premium property discovery platform. We connect discerning homebuyers and tenants with distinguished apartments, villas, and penthouses through a design-led, transparent experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6">
                <div className="w-10 h-10 rounded-lg bg-[#F8EBE6] flex items-center justify-center text-[#C66A4A] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#222222] mb-2">{item.title}</h2>
                <p className="text-sm text-[#737373] leading-relaxed">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

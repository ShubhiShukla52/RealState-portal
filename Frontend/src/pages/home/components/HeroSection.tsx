import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle, Building2, ShieldCheck, MapPin } from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ROUTES } from '../../../constants/routes';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white border-b border-[#E2E2DF] overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background Architectural Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:24px_24px]" />

      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="accent" size="md">
                Modern Real Estate Marketplace
              </Badge>
              <span className="hidden sm:inline-block text-xs text-[#737373] font-medium">
                Delhi NCR • Mumbai • Bengaluru • Hyderabad • Pune
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#222222] tracking-tight leading-[1.15]">
              Find a place you'll <span className="text-[#C66A4A]">love to live in</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#737373] max-w-xl leading-relaxed">
              Discover homes, apartments, and properties that match your lifestyle. Connect directly with owners and trusted builders across premier Indian cities.
            </p>

            {/* Primary Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to={ROUTES.PROPERTIES}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={ArrowRight} iconPosition="right">
                  Explore Properties
                </Button>
              </Link>
              <Link to={ROUTES.SELL.ROOT}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" icon={PlusCircle}>
                  List Your Property
                </Button>
              </Link>
            </div>

            {/* Architectural Trust Points */}
            <div className="pt-6 border-t border-[#E2E2DF] grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#171717]">100%</p>
                <p className="text-xs text-[#737373] mt-0.5">Verified Listings</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#171717]">0%</p>
                <p className="text-xs text-[#737373] mt-0.5">Hidden Fees</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#171717]">Direct</p>
                <p className="text-xs text-[#737373] mt-0.5">Owner Contact</p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Visual Treatment */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E2DF] shadow-sm bg-[#F5F5F2]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Contemporary architectural residence"
                className="w-full h-[380px] sm:h-[460px] object-cover"
                loading="eager"
              />

              {/* Subtle Floating Detail Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E2E2DF] shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#C66A4A] shrink-0">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#222222]">Prime Residences</p>
                      <p className="text-[11px] text-[#737373] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C66A4A]" /> Noida, Mumbai & Bengaluru
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

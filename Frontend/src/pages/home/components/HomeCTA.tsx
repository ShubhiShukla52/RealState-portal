import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle, Building2 } from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../constants/routes';

export const HomeCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F5F5F2] border-t border-[#E2E2DF]">
      <Container size="xl">
        <div className="relative bg-[#171717] rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-sm">
          {/* Subtle architectural background element */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-end pr-8">
            <Building2 className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#C66A4A] text-xs font-semibold uppercase tracking-wider">
              Get Started Today
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Find Your <span className="text-[#C66A4A]">Next Place</span>?
            </h2>

            <p className="text-base sm:text-lg text-[#A3A3A3] leading-relaxed max-w-xl">
              Explore properties that fit your lifestyle, location, and budget. Whether buying your dream home or listing your residence, EstateX simplifies the journey.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to={ROUTES.PROPERTIES}>
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Explore Properties
                </Button>
              </Link>
              <Link to={ROUTES.SELL.ROOT}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20"
                  icon={PlusCircle}
                >
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

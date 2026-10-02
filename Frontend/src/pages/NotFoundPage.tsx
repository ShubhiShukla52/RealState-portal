import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 sm:py-32 bg-[#F5F5F2] min-h-[75vh] flex items-center justify-center">
      <Container size="md">
        <div className="bg-white rounded-3xl border border-[#E2E2DF] p-8 sm:p-14 text-center shadow-xs space-y-6 max-w-xl mx-auto">
          {/* Architectural Badge & Number */}
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#C66A4A] bg-[#F8EBE6] px-3 py-1 rounded-full border border-[#C66A4A]/20">
              Error 404
            </span>
            <h1 className="text-6xl sm:text-8xl font-black text-[#171717] tracking-tighter">
              404
            </h1>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
              Page not found
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              The address you navigated to does not exist or may have been relocated. Discover verified residences across India or return to our homepage.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={ROUTES.HOME} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                icon={Home}
                className="w-full sm:w-auto justify-center"
              >
                Go Home
              </Button>
            </Link>

            <Link to={ROUTES.PROPERTIES} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                icon={Compass}
                className="w-full sm:w-auto justify-center border-[#E2E2DF]"
              >
                Explore Properties
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

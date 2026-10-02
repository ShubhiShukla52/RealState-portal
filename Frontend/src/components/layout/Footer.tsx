import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E2E2DF] mt-auto">
      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="space-y-4 lg:col-span-2">
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center font-bold text-white transition-colors group-hover:bg-[#262626]">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#171717]">
                Estate<span className="text-[#C66A4A]">X</span>
              </span>
            </Link>
            <p className="text-sm text-[#737373] max-w-sm leading-relaxed">
              Find a place you'll love to live in. EstateX is a design-first real estate marketplace offering curated properties across premier Indian cities.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full border border-[#E2E2DF] flex items-center justify-center text-[#737373] hover:text-[#171717] hover:border-[#171717] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-[#E2E2DF] flex items-center justify-center text-[#737373] hover:text-[#171717] hover:border-[#171717] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[#E2E2DF] flex items-center justify-center text-[#737373] hover:text-[#171717] hover:border-[#171717] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#website"
                aria-label="Global Website"
                className="w-8 h-8 rounded-full border border-[#E2E2DF] flex items-center justify-center text-[#737373] hover:text-[#171717] hover:border-[#171717] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Properties Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#222222] mb-4">
              Properties
            </h4>
            <ul className="space-y-2.5 text-sm text-[#737373]">
              <li>
                <Link to={ROUTES.PROPERTIES} className="hover:text-[#C66A4A] transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=sale" className="hover:text-[#C66A4A] transition-colors">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rent" className="hover:text-[#C66A4A] transition-colors">
                  Homes for Rent
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SELL.ROOT} className="hover:text-[#C66A4A] transition-colors">
                  Post a Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#222222] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#737373]">
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-[#C66A4A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INQUIRIES} className="hover:text-[#C66A4A] transition-colors">
                  My Inquiries
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD.ROOT} className="hover:text-[#C66A4A] transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ADMIN.ROOT} className="hover:text-[#C66A4A] transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Placeholder */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#222222] mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-[#737373]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C66A4A] shrink-0 mt-0.5" />
                <span>Sector 128, Noida Expressway, Delhi NCR, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C66A4A] shrink-0" />
                <span>+91 (011) 4567-8900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C66A4A] shrink-0" />
                <span>contact@estatex.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-12 pt-6 border-t border-[#E2E2DF] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A3A3A3] gap-2">
          <p>© {currentYear} EstateX Technologies Inc. All rights reserved.</p>
          <p className="text-[#737373]">Find a place you'll love to live in.</p>
        </div>
      </Container>
    </footer>
  );
};

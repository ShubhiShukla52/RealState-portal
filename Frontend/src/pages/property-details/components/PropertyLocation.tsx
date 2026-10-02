import React from 'react';
import { MapPin, Navigation, School, Train, Building } from 'lucide-react';
import { Property } from '../../../types/property';

export interface PropertyLocationProps {
  property: Property;
}

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ property }) => {
  const nearbyPoints = [
    { label: 'Nearest Metro Station', distance: '1.2 km', icon: Train },
    { label: 'City Business Center', distance: '3.5 km', icon: Building },
    { label: 'Top International School', distance: '800 m', icon: School },
    { label: 'Expressway Highway Access', distance: '500 m', icon: Navigation },
  ];

  return (
    <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#171717] tracking-tight">
            Location & Neighbourhood
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            {property.locality}, {property.city}
          </p>
        </div>
        {property.address && (
          <span className="text-xs text-[#737373] bg-[#F5F5F2] border border-[#E2E2DF] px-3 py-1.5 rounded-lg max-w-sm truncate">
            {property.address}
          </span>
        )}
      </div>

      {/* Map Placeholder Card */}
      <div className="relative w-full h-56 sm:h-72 rounded-xl border border-[#E2E2DF] bg-[#F5F5F2] overflow-hidden flex flex-col items-center justify-center text-center p-6 select-none group">
        {/* Subtle geometric pattern lines representing map grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#171717 1px, transparent 1px), radial-gradient(#171717 1px, #F5F5F2 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Decorative map roads placeholder */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#A3A3A3" strokeWidth="6" strokeDasharray="12 6" />
            <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#A3A3A3" strokeWidth="8" />
            <line x1="0" y1="80%" x2="100%" y2="60%" stroke="#A3A3A3" strokeWidth="4" />
            <circle cx="45%" cy="30%" r="48" fill="#C66A4A" fillOpacity="0.1" />
          </svg>
        </div>

        {/* Pin & Info Box */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center shadow-lg mb-3 animate-bounce">
            <MapPin className="w-6 h-6 text-[#C66A4A]" />
          </div>
          <p className="text-sm font-bold text-[#171717]">
            {property.locality}, {property.city}
          </p>
          <p className="text-xs text-[#737373] mt-1 max-w-xs">
            Interactive map view and neighbourhood navigation will be available here.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#C66A4A] bg-white px-3 py-1 rounded-full border border-[#E2E2DF] shadow-2xs">
            Coordinates Verified
          </span>
        </div>
      </div>

      {/* Nearby Key Landmarks */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-3">
          Neighborhood Highlights
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {nearbyPoints.map((point, idx) => {
            const Icon = point.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F5F5F2]/60 border border-[#E2E2DF]/60 flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E2DF] flex items-center justify-center text-[#737373] shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#C66A4A]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#171717] truncate">
                    {point.distance}
                  </p>
                  <p className="text-[11px] text-[#737373] truncate">
                    {point.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

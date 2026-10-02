import React from 'react';
import { Building2, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export const AuthVisualPanel: React.FC = () => {
  const highlights = [
    {
      title: 'Verified Listings',
      desc: '100% verified properties and authentic owner details.',
      icon: ShieldCheck,
    },
    {
      title: 'Direct Owner Connect',
      desc: 'Communicate directly with verified sellers and landlords.',
      icon: KeyRound,
    },
    {
      title: 'Curated Experiences',
      desc: 'Handpicked residences with detailed specs and high-res tours.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="relative h-full w-full bg-[#171717] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden select-none">
      {/* Subtle Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#F5F5F2 1px, transparent 1px), linear-gradient(90deg, #F5F5F2 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Decorative Subtle Accent Shape */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#C66A4A]/10 blur-3xl pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white">
            <Building2 className="w-5 h-5 text-[#C66A4A]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Estate<span className="text-[#C66A4A]">X</span>
          </span>
        </div>
      </div>

      {/* Center Hero Copy */}
      <div className="relative z-10 my-auto py-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C66A4A] block mb-2">
          Modern Real Estate Portal
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Find a place you'll <br />
          <span className="text-[#C66A4A]">love to live in.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-md leading-relaxed">
          Discover properties, connect with owners, and find a place that fits your lifestyle.
        </p>

        {/* Feature Highlights */}
        <div className="mt-10 space-y-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C66A4A] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A3A3A3]">
        <span>© {new Date().getFullYear()} EstateX Inc.</span>
        <span className="font-medium text-white/80">Premium Living Redefined</span>
      </div>
    </div>
  );
};

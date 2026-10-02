import React from 'react';
import { Compass } from 'lucide-react';

export interface MapPlaceholderProps {
  zoom: number; // 1 to 5
  activeCity?: string;
  className?: string;
}

interface LocalityLabel {
  name: string;
  x: number; // percent
  y: number; // percent
  type?: 'major' | 'minor';
}

const CITY_LABELS: Record<string, LocalityLabel[]> = {
  bareilly: [
    { name: 'Civil Lines', x: 38, y: 46, type: 'major' },
    { name: 'Rajendra Nagar', x: 62, y: 32, type: 'major' },
    { name: 'Model Town', x: 26, y: 64, type: 'minor' },
    { name: 'Pilibhit Bypass', x: 74, y: 55, type: 'minor' },
    { name: 'Suresh Sharma Ngr', x: 48, y: 72, type: 'minor' },
    { name: 'Ramlila Grounds', x: 52, y: 22, type: 'minor' },
  ],
  delhi: [
    { name: 'Connaught Place', x: 50, y: 38, type: 'major' },
    { name: 'Dwarka Sector 12', x: 22, y: 62, type: 'major' },
    { name: 'Saket & Mehrauli', x: 65, y: 70, type: 'minor' },
    { name: 'Vasant Kunj', x: 36, y: 74, type: 'minor' },
    { name: 'Greater Kailash', x: 68, y: 52, type: 'major' },
    { name: 'Yamuna Riverbank', x: 78, y: 30, type: 'minor' },
  ],
  noida: [
    { name: 'Sector 18 Market', x: 30, y: 35, type: 'major' },
    { name: 'Sector 62 IT Park', x: 65, y: 28, type: 'minor' },
    { name: 'Sector 128 Expressway', x: 54, y: 56, type: 'major' },
    { name: 'Sector 150 Greens', x: 72, y: 76, type: 'minor' },
    { name: 'Hindon Corridor', x: 25, y: 72, type: 'minor' },
  ],
  gurugram: [
    { name: 'DLF Cyber City', x: 38, y: 28, type: 'major' },
    { name: 'Golf Course Road', x: 56, y: 48, type: 'major' },
    { name: 'Sector 65 Ext', x: 68, y: 68, type: 'minor' },
    { name: 'DLF Phase 1', x: 44, y: 38, type: 'minor' },
    { name: 'Aravali Ridge Sanctuary', x: 24, y: 78, type: 'minor' },
  ],
  mumbai: [
    { name: 'Bandra West Promenade', x: 32, y: 42, type: 'major' },
    { name: 'Andheri West Link', x: 28, y: 26, type: 'major' },
    { name: 'Powai Hiranandani', x: 66, y: 34, type: 'major' },
    { name: 'Worli Sea Face', x: 34, y: 68, type: 'minor' },
    { name: 'Thane West Corridor', x: 78, y: 18, type: 'minor' },
    { name: 'Arabian Sea Front', x: 12, y: 54, type: 'minor' },
  ],
  bengaluru: [
    { name: 'Koramangala 4th Block', x: 42, y: 48, type: 'major' },
    { name: 'Indiranagar 100ft Rd', x: 54, y: 34, type: 'major' },
    { name: 'Whitefield ITPL', x: 78, y: 40, type: 'major' },
    { name: 'HSR Layout Sector 1', x: 50, y: 66, type: 'minor' },
    { name: 'Bannerghatta Rd Corridor', x: 36, y: 78, type: 'minor' },
  ],
  hyderabad: [
    { name: 'Gachibowli Financial Dist', x: 30, y: 46, type: 'major' },
    { name: 'Madhapur Hitec City', x: 42, y: 36, type: 'major' },
    { name: 'Jubilee Hills Rd 36', x: 58, y: 38, type: 'major' },
    { name: 'Banjara Hills Rd 1', x: 68, y: 52, type: 'minor' },
    { name: 'Durgam Cheruvu Lake', x: 46, y: 44, type: 'minor' },
  ],
  pune: [
    { name: 'Baner Hills Road', x: 26, y: 40, type: 'major' },
    { name: 'Koregaon Park North', x: 64, y: 46, type: 'major' },
    { name: 'Kalyani Nagar Avenue', x: 74, y: 38, type: 'minor' },
    { name: 'Hinjewadi Tech Corridor', x: 18, y: 28, type: 'minor' },
    { name: 'Mula-Mutha Riverbank', x: 52, y: 54, type: 'minor' },
  ],
  lucknow: [
    { name: 'Hazratganj Central', x: 34, y: 46, type: 'major' },
    { name: 'Gomti Nagar Extension', x: 68, y: 58, type: 'major' },
    { name: 'Indira Nagar Block B', x: 60, y: 32, type: 'minor' },
    { name: 'Gomti Riverfront Park', x: 48, y: 42, type: 'minor' },
    { name: 'Aliganj Main Market', x: 28, y: 28, type: 'minor' },
  ],
  jaipur: [
    { name: 'C-Scheme Central', x: 46, y: 40, type: 'major' },
    { name: 'Malviya Nagar Calgiri', x: 66, y: 64, type: 'major' },
    { name: 'Vaishali Nagar', x: 24, y: 44, type: 'minor' },
    { name: 'Mansarovar Metro', x: 32, y: 68, type: 'minor' },
    { name: 'Central Park Green', x: 52, y: 48, type: 'minor' },
  ],
};

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  zoom,
  activeCity = 'Bareilly',
  className = '',
}) => {
  // Determine labels to show based on active city
  const cityKey = (activeCity || 'bareilly').toLowerCase();
  const matchedKey =
    Object.keys(CITY_LABELS).find((k) => cityKey.includes(k) || k.includes(cityKey)) || 'bareilly';
  const labels = CITY_LABELS[matchedKey] || CITY_LABELS.bareilly;

  // Zoom scale transform: 1 -> 1x, 2 -> 1.15x, 3 -> 1.3x, 4 -> 1.45x, 5 -> 1.6x
  const scale = 1 + (zoom - 1) * 0.15;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#EBEAE5] ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Scalable Vector Cartography Surface */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Waterway / River corridor */}
          <path
            d="M -50 480 C 200 420, 350 560, 600 490 C 850 420, 950 540, 1050 510 L 1050 570 C 950 600, 850 480, 600 550 C 350 620, 200 480, -50 540 Z"
            fill="#D5E1E8"
            opacity="0.8"
          />

          {/* Urban Parks & Reserve Corridors */}
          <path
            d="M 120 180 C 180 150, 240 160, 260 220 C 280 280, 180 320, 130 290 C 80 260, 60 210, 120 180 Z"
            fill="#DFE8DD"
            opacity="0.9"
          />
          <path
            d="M 680 120 C 740 90, 840 110, 860 170 C 880 230, 800 270, 740 250 C 680 230, 620 150, 680 120 Z"
            fill="#DFE8DD"
            opacity="0.9"
          />
          <path
            d="M 420 540 C 470 510, 530 520, 540 570 C 550 620, 480 650, 430 630 C 380 610, 370 570, 420 540 Z"
            fill="#DFE8DD"
            opacity="0.9"
          />

          {/* Secondary Street Grid Network */}
          <g stroke="#DDD9CF" strokeWidth="2.5" strokeDasharray="none" opacity="0.75">
            <line x1="80" y1="0" x2="80" y2="700" />
            <line x1="220" y1="0" x2="220" y2="700" />
            <line x1="360" y1="0" x2="360" y2="700" />
            <line x1="500" y1="0" x2="500" y2="700" />
            <line x1="640" y1="0" x2="640" y2="700" />
            <line x1="780" y1="0" x2="780" y2="700" />
            <line x1="920" y1="0" x2="920" y2="700" />

            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="220" x2="1000" y2="220" />
            <line x1="0" y1="340" x2="1000" y2="340" />
            <line x1="0" y1="460" x2="1000" y2="460" />
            <line x1="0" y1="580" x2="1000" y2="580" />
          </g>

          {/* Primary Arterial Roadways */}
          <g stroke="#C8C4B8" strokeWidth="7" strokeLinecap="round" fill="none">
            {/* Horizontal Expressway */}
            <path d="M -20 280 Q 250 310, 520 270 T 1020 290" />
            {/* Diagonal Bypass */}
            <path d="M 120 -20 Q 320 280, 540 420 T 940 720" />
            {/* Cross-Ring Corridor */}
            <path d="M 880 -20 Q 720 240, 510 460 T 140 720" />
          </g>

          {/* Road Center Highlighting */}
          <g stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
            <path d="M -20 280 Q 250 310, 520 270 T 1020 290" />
            <path d="M 120 -20 Q 320 280, 540 420 T 940 720" />
            <path d="M 880 -20 Q 720 240, 510 460 T 140 720" />
          </g>

          {/* Traffic Circles / Roundabouts */}
          <circle cx="520" cy="270" r="16" fill="#FFFFFF" stroke="#C8C4B8" strokeWidth="4" />
          <circle cx="540" cy="420" r="14" fill="#FFFFFF" stroke="#C8C4B8" strokeWidth="4" />
          <circle cx="340" cy="300" r="12" fill="#FFFFFF" stroke="#C8C4B8" strokeWidth="3" />
          <circle cx="700" cy="280" r="13" fill="#FFFFFF" stroke="#C8C4B8" strokeWidth="3" />
        </svg>

        {/* Dynamic Neighborhood / Locality Labels */}
        {labels.map((loc) => (
          <div
            key={loc.name}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div
              className={`font-sans tracking-wide text-center uppercase ${
                loc.type === 'major'
                  ? 'text-xs font-black text-[#5C5A55] tracking-widest bg-white/70 px-2 py-0.5 rounded shadow-xs'
                  : 'text-[10px] font-semibold text-[#8C8880] tracking-wider'
              }`}
            >
              {loc.name}
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Compass Rose */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-white/90 border border-[#E2E2DF] shadow-xs flex items-center justify-center">
          <Compass className="w-5 h-5 text-[#171717]" />
        </div>
        <span className="text-[10px] font-black text-[#171717] mt-0.5 tracking-tighter">N</span>
      </div>

      {/* Map Scale Bar */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-[#E2E2DF] shadow-xs flex items-center gap-2">
        <div className="w-12 h-1 bg-[#171717] rounded-full relative">
          <div className="absolute -top-1 left-0 w-0.5 h-3 bg-[#171717]" />
          <div className="absolute -top-1 right-0 w-0.5 h-3 bg-[#171717]" />
        </div>
        <span className="text-[10px] font-bold text-[#222222]">
          {zoom <= 1 ? '5 km' : zoom === 2 ? '2 km' : zoom === 3 ? '1 km' : '500 m'}
        </span>
      </div>
    </div>
  );
};

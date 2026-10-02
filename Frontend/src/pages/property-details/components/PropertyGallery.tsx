import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if images array is empty
  const safeImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-[#171717] aspect-[16/10] sm:aspect-[16/9] border border-[#E2E2DF] shadow-sm select-none group">
        <img
          src={safeImages[currentIndex]}
          alt={`${title} - View ${currentIndex + 1} of ${safeImages.length}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
        />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 bg-[#171717]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium border border-white/10 z-10">
          <ImageIcon className="w-3.5 h-3.5 text-[#C66A4A]" />
          <span>{currentIndex + 1} / {safeImages.length}</span>
        </div>

        {/* Navigation Arrows (if more than 1 image) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#171717] shadow-md flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#171717] shadow-md flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {safeImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                aria-pressed={isSelected}
                className={`relative w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden shrink-0 transition-all border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
                  isSelected
                    ? 'border-[#C66A4A] ring-1 ring-[#C66A4A] scale-[1.02]'
                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#A3A3A3]'
                }`}
              >
                <img
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

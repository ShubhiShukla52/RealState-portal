import React, { useState, useEffect } from 'react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

export interface PropertyImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  badges?: React.ReactNode;
  actionOverlay?: React.ReactNode;
  className?: string;
}

export const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  alt,
  aspectRatio = 'video',
  badges,
  actionOverlay,
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_IMAGE);
  }, [src]);

  const aspectStyles = {
    video: 'aspect-[16/10]',
    square: 'aspect-square',
    wide: 'aspect-[2/1]',
  };

  return (
    <div className={`relative overflow-hidden bg-[#F5F5F2] ${aspectStyles[aspectRatio]} ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => {
          if (imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
          }
        }}
        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />

      {/* Top Left Badges Slot */}
      {badges && (
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {badges}
        </div>
      )}

      {/* Top Right Action Overlay (e.g. Favorite Button) */}
      {actionOverlay && (
        <div className="absolute top-3 right-3 z-10">
          {actionOverlay}
        </div>
      )}
    </div>
  );
};

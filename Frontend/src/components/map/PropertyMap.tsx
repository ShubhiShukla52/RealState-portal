import React, { useState, useMemo } from 'react';
import { List, Info } from 'lucide-react';
import { PropertyWithDistance } from '../../types/search';
import { MapPlaceholder } from './MapPlaceholder';
import { MapMarker } from './MapMarker';
import { MapControls } from './MapControls';
import { MapPropertyPreview } from './MapPropertyPreview';

export interface PropertyMapProps {
  properties: PropertyWithDistance[];
  activeCity?: string;
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: PropertyWithDistance | null) => void;
  onNearMe?: () => void;
  isLocating?: boolean;
  onCloseMobileMap?: () => void;
  className?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  activeCity = 'Bareilly',
  selectedPropertyId,
  onSelectProperty,
  onNearMe,
  isLocating = false,
  onCloseMobileMap,
  className = '',
}) => {
  const [zoom, setZoom] = useState(2);
  const [internalSelectedProp, setInternalSelectedProp] = useState<PropertyWithDistance | null>(null);

  // Sync with prop if provided
  const activeSelectedProp = useMemo(() => {
    if (selectedPropertyId) {
      return properties.find((p) => p.id === selectedPropertyId) || null;
    }
    return internalSelectedProp;
  }, [selectedPropertyId, properties, internalSelectedProp]);

  // Project properties with coordinates onto normalized percentages [15% to 85%]
  const projectedMarkers = useMemo(() => {
    const validProps = properties.filter(
      (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
    );

    if (validProps.length === 0) return [];

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    validProps.forEach((p) => {
      if (p.latitude! < minLat) minLat = p.latitude!;
      if (p.latitude! > maxLat) maxLat = p.latitude!;
      if (p.longitude! < minLng) minLng = p.longitude!;
      if (p.longitude! > maxLng) maxLng = p.longitude!;
    });

    const latDelta = maxLat - minLat || 0.05;
    const lngDelta = maxLng - minLng || 0.05;

    // Margin from canvas edges
    const MARGIN = 18;
    const SPAN = 100 - MARGIN * 2;

    return validProps.map((p, index) => {
      // If delta is 0 (single item), position near center
      const normX =
        latDelta === 0.05 && validProps.length === 1
          ? 50
          : ((p.longitude! - minLng) / lngDelta);
      const normY =
        lngDelta === 0.05 && validProps.length === 1
          ? 50
          : ((maxLat - p.latitude!) / latDelta);

      // Clamp between margin and 100-margin
      let xPercent = MARGIN + normX * SPAN;
      let yPercent = MARGIN + normY * SPAN;

      // Small pseudo offset if multiple overlap exactly
      if (validProps.length > 1) {
        xPercent = Math.max(12, Math.min(88, xPercent + ((index % 3) - 1) * 2.5));
        yPercent = Math.max(16, Math.min(85, yPercent + (((index + 1) % 3) - 1) * 2.5));
      }

      return {
        property: p,
        xPercent,
        yPercent,
      };
    });
  }, [properties]);

  const handleMarkerClick = (property: PropertyWithDistance) => {
    setInternalSelectedProp(property);
    if (onSelectProperty) {
      onSelectProperty(property);
    }
  };

  const handleClosePreview = () => {
    setInternalSelectedProp(null);
    if (onSelectProperty) {
      onSelectProperty(null);
    }
  };

  const handleResetView = () => {
    setZoom(2);
    setInternalSelectedProp(null);
    if (onSelectProperty) {
      onSelectProperty(null);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-[#E2E2DF] shadow-xs bg-[#EBEAE5] ${className}`}
      role="region"
      aria-label="Interactive Property Map"
    >
      {/* Visual Cartographic Canvas */}
      <MapPlaceholder zoom={zoom} activeCity={activeCity} />

      {/* Property Markers Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {projectedMarkers.map(({ property, xPercent, yPercent }) => {
          const isSelected = activeSelectedProp?.id === property.id;
          return (
            <div key={property.id} className="pointer-events-auto">
              <MapMarker
                property={property}
                xPercent={xPercent}
                yPercent={yPercent}
                isSelected={isSelected}
                onClick={handleMarkerClick}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20">
        <MapControls
          onZoomIn={() => setZoom((z) => Math.min(5, z + 1))}
          onZoomOut={() => setZoom((z) => Math.max(1, z - 1))}
          onResetView={handleResetView}
          onNearMe={onNearMe || (() => {})}
          isLocating={isLocating}
          canZoomIn={zoom < 5}
          canZoomOut={zoom > 1}
        />
      </div>

      {/* Mobile Back to List Button */}
      {onCloseMobileMap && (
        <button
          type="button"
          onClick={onCloseMobileMap}
          className="absolute top-4 left-4 z-20 lg:hidden px-3.5 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
        >
          <List className="w-4 h-4" />
          <span>List View</span>
        </button>
      )}

      {/* Property Detail Floating Preview Card */}
      {activeSelectedProp && (
        <div className="absolute bottom-10 left-4 right-4 sm:left-auto sm:right-4 z-30 max-w-sm">
          <MapPropertyPreview
            property={activeSelectedProp}
            onClose={handleClosePreview}
          />
        </div>
      )}

      {/* Demo Disclaimer Pill */}
      <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#E2E2DF] text-[10px] text-[#737373] shadow-xs">
          <Info className="w-3 h-3 text-[#A3A3A3]" />
          <span>Map view is for demonstration purposes. Property locations are approximate.</span>
        </div>
      </div>
    </div>
  );
};

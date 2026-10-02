import React from 'react';
import { Plus, Minus, RotateCcw, Crosshair } from 'lucide-react';

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onNearMe: () => void;
  isLocating?: boolean;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onNearMe,
  isLocating = false,
  canZoomIn = true,
  canZoomOut = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 shadow-md rounded-xl bg-white/95 backdrop-blur-sm border border-[#E2E2DF] p-1.5 ${className}`}>
      {/* Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        aria-label="Zoom in on map"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#222222] hover:bg-[#F5F5F2] hover:text-[#171717] disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        aria-label="Zoom out on map"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#222222] hover:bg-[#F5F5F2] hover:text-[#171717] disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="w-full h-px bg-[#E2E2DF] my-0.5" />

      {/* Near Me / Locate */}
      <button
        type="button"
        onClick={onNearMe}
        disabled={isLocating}
        aria-label="Find properties near me"
        title="Find properties near me"
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
          isLocating
            ? 'bg-[#F8EBE6] text-[#C66A4A] animate-pulse'
            : 'text-[#222222] hover:bg-[#F5F5F2] hover:text-[#C66A4A]'
        }`}
      >
        <Crosshair className="w-4 h-4" />
      </button>

      {/* Reset View */}
      <button
        type="button"
        onClick={onResetView}
        aria-label="Reset map view"
        title="Reset map view"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#222222] hover:bg-[#F5F5F2] hover:text-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

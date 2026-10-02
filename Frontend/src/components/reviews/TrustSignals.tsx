import React from 'react';
import {
  ShieldCheck,
  Camera,
  MessageCircle,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Property } from '../../types/property';

export interface TrustSignalsProps {
  property: Property;
  reviewCount?: number;
  className?: string;
}

export const TrustSignals: React.FC<TrustSignalsProps> = ({
  property,
  reviewCount = 0,
  className = '',
}) => {
  const signals = [
    {
      icon: ShieldCheck,
      title: 'Verified Listing',
      description: 'Title deeds & physical parameters cross-referenced with local registry.',
      visible: true,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Camera,
      title: `${property.images.length} High-Res Photos`,
      description: 'Authentic architectural photographs and room orientations.',
      visible: property.images.length > 0,
      color: 'text-blue-700 bg-blue-50 border-blue-200/60',
      iconColor: 'text-blue-600',
    },
    {
      icon: MessageCircle,
      title: property.owner?.responseTime || 'Responsive Host',
      description: 'Property owner maintains prompt messaging turnaround.',
      visible: Boolean(property.owner),
      color: 'text-[#C66A4A] bg-[#F8EBE6] border-[#C66A4A]/20',
      iconColor: 'text-[#C66A4A]',
    },
    {
      icon: Sparkles,
      title: 'Popular Property',
      description: `${reviewCount > 0 ? `${reviewCount} verified reviews` : 'High visitor engagement'} and frequent inquiries.`,
      visible: Boolean(property.featured || reviewCount >= 3),
      color: 'text-amber-800 bg-amber-50 border-amber-200/60',
      iconColor: 'text-amber-600',
    },
    {
      icon: Clock,
      title: 'Direct Handover',
      description: property.status || 'Ready for physical handover.',
      visible: Boolean(property.status),
      color: 'text-[#171717] bg-[#F5F5F2] border-[#E2E2DF]',
      iconColor: 'text-[#171717]',
    },
  ].filter((s) => s.visible);

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E2DF]">
        <CheckCircle2 className="w-4 h-4 text-[#C66A4A]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Trust & Verification Signals
        </h3>
        <span className="text-[10px] text-[#A3A3A3] ml-auto">
          Demo Indicators
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {signals.map((sig, idx) => {
          const Icon = sig.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${sig.color}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${sig.iconColor}`} />
              <div className="min-w-0">
                <h4 className="text-xs font-bold leading-tight truncate">
                  {sig.title}
                </h4>
                <p className="text-[11px] opacity-80 mt-0.5 leading-snug line-clamp-2">
                  {sig.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

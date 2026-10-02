import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm flex items-start justify-between transition-all hover:border-[#A3A3A3] ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          {value}
        </p>
        {(description || trend) && (
          <p className="text-xs text-[#737373] pt-0.5">
            {trend && <span className="font-semibold text-emerald-700 mr-1">{trend}</span>}
            {description}
          </p>
        )}
      </div>

      <div className="w-11 h-11 rounded-xl bg-[#F5F5F2] border border-[#E2E2DF] flex items-center justify-center text-[#171717] shrink-0">
        <Icon className="w-5 h-5 text-[#C66A4A]" />
      </div>
    </div>
  );
};

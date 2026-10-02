import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  badge?: string;
  variant?: 'default' | 'accent' | 'warning';
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  badge,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return {
          iconBox: 'bg-[#F8EBE6] text-[#C66A4A]',
          border: 'hover:border-[#C66A4A]',
        };
      case 'warning':
        return {
          iconBox: 'bg-amber-50 text-amber-700',
          border: 'hover:border-amber-300',
        };
      default:
        return {
          iconBox: 'bg-[#F5F5F2] text-[#171717]',
          border: 'hover:border-[#A3A3A3]',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E2DF] p-5 shadow-sm transition-all flex items-start justify-between ${styles.border} ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#737373]">
            {title}
          </p>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8EBE6] text-[#C66A4A]">
              {badge}
            </span>
          )}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          {value}
        </p>
        {subtext && <p className="text-xs text-[#737373] pt-0.5">{subtext}</p>}
      </div>

      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-[#E2E2DF]/60 ${styles.iconBox}`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

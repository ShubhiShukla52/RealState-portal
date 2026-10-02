import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

export interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  variant?: 'primary' | 'default';
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  href,
  icon: Icon,
  badge,
  variant = 'default',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <Link
      to={href}
      className={`group p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between h-full relative overflow-hidden ${
        isPrimary
          ? 'bg-[#171717] text-white border-[#171717] hover:bg-[#222222]'
          : 'bg-white text-[#171717] border-[#E2E2DF] hover:border-[#A3A3A3] hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isPrimary ? 'bg-white/10 text-[#C66A4A]' : 'bg-[#F5F5F2] text-[#C66A4A]'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isPrimary
                  ? 'bg-white/15 text-white'
                  : 'bg-[#F8EBE6] text-[#C66A4A]'
              }`}
            >
              {badge}
            </span>
          )}
          <ArrowUpRight
            className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
              isPrimary ? 'text-white/60' : 'text-[#A3A3A3]'
            }`}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm sm:text-base font-bold tracking-tight">{title}</h4>
        <p
          className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${
            isPrimary ? 'text-[#A3A3A3]' : 'text-[#737373]'
          }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
};

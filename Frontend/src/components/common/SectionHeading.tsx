import React from 'react';
import { Badge } from '../ui/Badge';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  action,
  centered = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${
        centered ? 'text-center items-center justify-center' : ''
      } ${className}`}
    >
      <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        {badge && (
          <Badge variant="accent" className="mb-2">
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#222222]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-[#737373] mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

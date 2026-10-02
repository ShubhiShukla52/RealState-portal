import React from 'react';
import { LucideIcon, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AdminEmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  icon: Icon = Search,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 text-center bg-white rounded-2xl border border-[#E2E2DF] flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#F5F5F2] text-[#737373] flex items-center justify-center shadow-2xs">
        <Icon className="w-6 h-6 text-[#C66A4A]" />
      </div>

      <div className="max-w-md">
        <h3 className="text-base font-bold text-[#171717]">{title}</h3>
        <p className="text-xs text-[#737373] mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2 text-xs">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

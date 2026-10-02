import React from 'react';
import {
  Building2,
  CheckCircle2,
  UserPlus,
  AlertTriangle,
  BadgeCheck,
  Edit,
  Clock,
  LucideIcon,
} from 'lucide-react';
import { AdminActivity } from '../../types/admin';

export interface AdminActivityListProps {
  activities: AdminActivity[];
  className?: string;
}

const activityIconMap: Record<AdminActivity['type'], { icon: LucideIcon; color: string; bg: string }> = {
  property_submitted: {
    icon: Building2,
    color: 'text-[#C66A4A]',
    bg: 'bg-[#F8EBE6]',
  },
  property_approved: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  user_registered: {
    icon: UserPlus,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  property_reported: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  property_sold: {
    icon: BadgeCheck,
    color: 'text-[#171717]',
    bg: 'bg-[#F5F5F2]',
  },
  profile_updated: {
    icon: Edit,
    color: 'text-[#737373]',
    bg: 'bg-[#F5F5F2]',
  },
};

export const AdminActivityList: React.FC<AdminActivityListProps> = ({
  activities,
  className = '',
}) => {
  return (
    <div className={`space-y-3.5 ${className}`}>
      {activities.map((act) => {
        const config = activityIconMap[act.type] || {
          icon: Clock,
          color: 'text-[#737373]',
          bg: 'bg-[#F5F5F2]',
        };
        const Icon = config.icon;

        return (
          <div
            key={act.id}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-[#E2E2DF] hover:border-[#A3A3A3] transition-colors"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <h4 className="text-sm font-bold text-[#171717] truncate">
                  {act.title}
                </h4>
                <span className="text-[11px] text-[#A3A3A3] shrink-0">
                  {act.timestamp}
                </span>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed">
                {act.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { ReviewStatus } from '../../types/review';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Clock, AlertTriangle, EyeOff } from 'lucide-react';

export interface ReviewStatusBadgeProps {
  status: ReviewStatus;
  className?: string;
}

export const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'published':
      return (
        <Badge variant="success" size="sm" className={`gap-1 ${className}`}>
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          <span>Published</span>
        </Badge>
      );

    case 'pending':
      return (
        <Badge variant="warning" size="sm" className={`gap-1 ${className}`}>
          <Clock className="w-3 h-3 shrink-0" />
          <span>Pending Moderation</span>
        </Badge>
      );

    case 'reported':
      return (
        <Badge variant="error" size="sm" className={`gap-1 ${className}`}>
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>Reported</span>
        </Badge>
      );

    case 'hidden':
      return (
        <Badge variant="secondary" size="sm" className={`gap-1 text-[#737373] ${className}`}>
          <EyeOff className="w-3 h-3 shrink-0" />
          <span>Hidden</span>
        </Badge>
      );

    default:
      return null;
  }
};

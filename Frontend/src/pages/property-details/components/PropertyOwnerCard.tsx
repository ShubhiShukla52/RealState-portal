import React, { useState } from 'react';
import { Phone, MessageSquare, ShieldCheck, Clock, Check, Calendar } from 'lucide-react';
import { PropertyOwner } from '../../../types/property';
import { Button } from '../../../components/ui/Button';

export interface PropertyOwnerCardProps {
  owner?: PropertyOwner;
  onContactClick?: () => void;
  onRequestVisitClick?: () => void;
}

export const PropertyOwnerCard: React.FC<PropertyOwnerCardProps> = ({
  owner,
  onContactClick,
  onRequestVisitClick,
}) => {
  const [showPhone, setShowPhone] = useState(false);

  const displayOwner = {
    name: owner?.name || 'Rahul Sharma',
    role: owner?.role || 'Property Owner',
    phone: owner?.phone || '+91 98765 43210',
    responseTime: owner?.responseTime || 'Usually responds in under 2 hours',
  };

  // Get initials for avatar
  const initials = displayOwner.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleCallClick = () => {
    setShowPhone(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm space-y-5">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C66A4A] block mb-1">
          Direct Listing
        </span>
        <h3 className="text-lg font-bold text-[#171717] tracking-tight">
          Interested in this property?
        </h3>
      </div>

      {/* Owner Profile Row */}
      <div className="flex items-center gap-3.5 pt-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-base border-2 border-white shadow-sm">
            {initials}
          </div>
          <span
            title="Verified Owner"
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white"
          >
            <ShieldCheck className="w-3 h-3" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-bold text-[#171717] truncate">
              {displayOwner.name}
            </h4>
          </div>
          <p className="text-xs text-[#737373] font-medium">
            {displayOwner.role}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#737373] mt-0.5">
            <Clock className="w-3 h-3 text-[#A3A3A3]" />
            <span>{displayOwner.responseTime}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        {onRequestVisitClick && (
          <Button
            type="button"
            variant="primary"
            className="w-full bg-[#C66A4A] hover:bg-[#b05d40] text-white border-[#C66A4A]"
            icon={Calendar}
            onClick={onRequestVisitClick}
          >
            Request a Visit
          </Button>
        )}

        <Button
          type="button"
          variant={onRequestVisitClick ? 'outline' : 'primary'}
          className="w-full"
          icon={MessageSquare}
          onClick={onContactClick}
        >
          Contact Owner
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          icon={showPhone ? Check : Phone}
          onClick={handleCallClick}
        >
          {showPhone ? displayOwner.phone : 'Call Owner'}
        </Button>
      </div>

      <p className="text-[11px] text-center text-[#A3A3A3] leading-tight">
        EstateX verifies all owner credentials before publishing.
      </p>
    </div>
  );
};

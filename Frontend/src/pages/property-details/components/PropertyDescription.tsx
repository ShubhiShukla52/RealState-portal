import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface PropertyDescriptionProps {
  description: string;
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = description && description.length > 240;

  return (
    <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#171717] tracking-tight mb-3">
        About This Property
      </h2>

      <div className="relative">
        <p
          className={`text-sm sm:text-base text-[#737373] leading-relaxed transition-all duration-200 ${
            !isExpanded && isLong ? 'line-clamp-3' : ''
          }`}
        >
          {description}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded"
          >
            <span>{isExpanded ? 'Read less' : 'Read more'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </section>
  );
};

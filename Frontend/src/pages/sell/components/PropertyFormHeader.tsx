import React from 'react';
import { Check } from 'lucide-react';
import { STEPS } from '../hooks/usePropertyForm';

export interface PropertyFormHeaderProps {
  isEditMode?: boolean;
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const PropertyFormHeader: React.FC<PropertyFormHeaderProps> = ({
  isEditMode = false,
  currentStep,
  onStepClick,
}) => {
  const heading = isEditMode ? 'Edit Your Property' : 'List Your Property';
  const supporting = isEditMode
    ? 'Update your property information and listing details.'
    : "Share your property with people looking for their next place to live.";

  return (
    <div className="space-y-6 mb-8">
      {/* Title & subtitle */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#171717]">
          {heading}
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-2 leading-relaxed">
          {supporting}
        </p>
      </div>

      {/* Step Indicator Navigation */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative overflow-x-auto pb-2 scrollbar-none">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={step.id > currentStep}
                className={`flex flex-col items-center group focus-visible:outline-none transition-all ${
                  step.id > currentStep ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${
                    isCurrent
                      ? 'bg-[#171717] border-[#171717] text-white shadow-sm ring-4 ring-[#171717]/10'
                      : isCompleted
                      ? 'bg-[#C66A4A] border-[#C66A4A] text-white'
                      : 'bg-white border-[#E2E2DF] text-[#737373]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-semibold mt-1.5 whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#171717]'
                      : isCompleted
                      ? 'text-[#C66A4A]'
                      : 'text-[#A3A3A3]'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-[#E2E2DF] h-1 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#C66A4A] h-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

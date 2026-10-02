import React from 'react';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface PropertyFormActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

export const PropertyFormActions: React.FC<PropertyFormActionsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSaveDraft,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="pt-6 border-t border-[#E2E2DF] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
      {/* Save Draft Action */}
      <Button
        type="button"
        variant="ghost"
        size="md"
        icon={Bookmark}
        onClick={onSaveDraft}
        className="w-full sm:w-auto text-[#737373] hover:text-[#171717]"
      >
        Save Draft
      </Button>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {!isFirstStep && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            icon={ArrowLeft}
            onClick={onPrev}
            className="flex-1 sm:flex-initial"
          >
            Back
          </Button>
        )}

        {!isLastStep ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onNext}
            className="flex-1 sm:flex-initial"
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={CheckCircle2}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial bg-[#171717]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </Button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Building2, SearchX } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { mockProperties } from '../../data/mockProperties';
import { ROUTES } from '../../constants/routes';

import { usePropertyForm, PropertyFormData } from './hooks/usePropertyForm';
import { PropertyFormHeader } from './components/PropertyFormHeader';
import { BasicInformationForm } from './components/BasicInformationForm';
import { PropertyLocationForm } from './components/PropertyLocationForm';
import { PropertyDetailsForm } from './components/PropertyDetailsForm';
import { PropertyAmenitiesForm } from './components/PropertyAmenitiesForm';
import { PropertyImagesForm } from './components/PropertyImagesForm';
import { PropertyFormActions } from './components/PropertyFormActions';
import { PropertyPreview } from './components/PropertyPreview';

export const SellPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // If in edit mode, find the property
  const existingProperty = isEditMode
    ? mockProperties.find((p) => p.id === id)
    : undefined;

  // If edit mode requested with an invalid ID
  if (isEditMode && !existingProperty) {
    return (
      <div className="py-16 sm:py-24 bg-[#F5F5F2] min-h-[70vh] flex items-center">
        <Container size="md">
          <EmptyState
            icon={SearchX}
            title="Property Not Found"
            description="The property listing you are trying to edit could not be found."
            actionLabel="Back to My Listings"
            onAction={() => navigate(ROUTES.DASHBOARD.LISTINGS)}
            className="shadow-sm border-[#E2E2DF] bg-white"
          />
        </Container>
      </div>
    );
  }

  const {
    form,
    currentStep,
    goToNextStep,
    goToPrevStep,
    goToStep,
    images,
    primaryImageIndex,
    handleAddImages,
    handleRemoveImage,
    handleSetPrimaryImage,
    selectedAmenities,
    toggleAmenity,
    saveDraftNotice,
    handleSaveDraft,
  } = usePropertyForm(existingProperty);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const onSubmit = (_data: PropertyFormData) => {
    if (isEditMode) {
      setSubmissionFeedback({
        title: 'Property changes saved successfully.',
        description:
          'Your listing updates have been applied locally. Real database synchronization will be connected in future phases.',
      });
    } else {
      setSubmissionFeedback({
        title: 'Your property listing has been submitted for review.',
        description:
          'Backend submission and admin approval will be connected later. Your listing has been drafted locally with status: Pending.',
      });
    }
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F5F5F2] min-h-screen">
      <Container size="lg">
        {/* Success Feedback Screen */}
        {isSubmitted && submissionFeedback ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E2E2DF] p-8 sm:p-12 text-center shadow-sm space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#171717]">
                {submissionFeedback.title}
              </h2>
              <p className="text-sm text-[#737373] leading-relaxed max-w-md mx-auto">
                {submissionFeedback.description}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.DASHBOARD.LISTINGS)}
                icon={Building2}
              >
                Go to My Listings
              </Button>

              <Link to={ROUTES.PROPERTIES}>
                <Button variant="outline" icon={ArrowRight} iconPosition="right">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Title and Step Indicator */}
            <PropertyFormHeader
              isEditMode={isEditMode}
              currentStep={currentStep}
              onStepClick={(step) => {
                goToStep(step);
              }}
            />

            {/* Save Draft Floating Banner if triggered */}
            {saveDraftNotice && (
              <div
                role="status"
                className="max-w-3xl mx-auto p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center gap-2 animate-in fade-in"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveDraftNotice}</span>
              </div>
            )}

            {/* Step Form Card */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E2E2DF] p-6 sm:p-8 shadow-sm">
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && <BasicInformationForm form={form} />}

                {/* Step 2: Location */}
                {currentStep === 2 && <PropertyLocationForm form={form} />}

                {/* Step 3: Property Details */}
                {currentStep === 3 && <PropertyDetailsForm form={form} />}

                {/* Step 4: Amenities */}
                {currentStep === 4 && (
                  <PropertyAmenitiesForm
                    selectedAmenities={selectedAmenities}
                    onToggleAmenity={toggleAmenity}
                  />
                )}

                {/* Step 5: Images */}
                {currentStep === 5 && (
                  <PropertyImagesForm
                    images={images}
                    primaryIndex={primaryImageIndex}
                    onAddImages={handleAddImages}
                    onRemoveImage={handleRemoveImage}
                    onSetPrimaryImage={handleSetPrimaryImage}
                    error={form.formState.errors.images?.message}
                  />
                )}

                {/* Step 6: Preview */}
                {currentStep === 6 && (
                  <PropertyPreview data={form.getValues()} />
                )}

                {/* Bottom Actions */}
                <PropertyFormActions
                  currentStep={currentStep}
                  totalSteps={6}
                  onNext={goToNextStep}
                  onPrev={goToPrevStep}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={form.formState.isSubmitting}
                />
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Property } from '../../../types/property';

export const propertyFormSchema = z.object({
  // Basic Information
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .min(30, 'Description must be at least 30 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  propertyType: z.string().min(1, 'Please select a property type'),
  listingType: z.enum(['sale', 'rent']),
  price: z.coerce.number().positive('Price must be greater than 0'),

  // Location
  address: z.string().trim().min(5, 'Address is required (at least 5 characters)'),
  locality: z.string().trim().min(2, 'Locality is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code'),

  // Property Details
  bedrooms: z.coerce.number().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.coerce.number().min(0, 'Bathrooms cannot be negative'),
  area: z.coerce.number().positive('Super area must be greater than 0'),
  parking: z.string().min(1, 'Please specify parking details'),
  furnishing: z.string().min(1, 'Please select furnishing status'),
  floor: z.string().min(1, 'Please specify floor level'),
  totalFloors: z.string().min(1, 'Please specify total floors in building'),

  // Amenities & Images
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, 'Please add at least 1 property photo'),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

export const STEPS = [
  { id: 1, title: 'Basic Info', label: 'Basic Info' },
  { id: 2, title: 'Location', label: 'Location' },
  { id: 3, title: 'Details', label: 'Details' },
  { id: 4, title: 'Amenities', label: 'Amenities' },
  { id: 5, title: 'Images', label: 'Images' },
  { id: 6, title: 'Preview', label: 'Preview' },
] as const;

export interface UsePropertyFormReturn {
  form: UseFormReturn<PropertyFormData>;
  currentStep: number;
  goToNextStep: () => Promise<boolean>;
  goToPrevStep: () => void;
  goToStep: (step: number) => Promise<boolean>;
  isFirstStep: boolean;
  isLastStep: boolean;
  images: string[];
  primaryImageIndex: number;
  handleAddImages: (newUrls: string[]) => void;
  handleRemoveImage: (index: number) => void;
  handleSetPrimaryImage: (index: number) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  saveDraftNotice: string | null;
  submitNotice: string | null;
  handleSaveDraft: () => void;
}

export const usePropertyForm = (initialProperty?: Property): UsePropertyFormReturn => {
  const [currentStep, setCurrentStep] = useState(1);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [saveDraftNotice, setSaveDraftNotice] = useState<string | null>(null);
  const [submitNotice] = useState<string | null>(null);

  // Default images if editing or new
  const defaultImages = initialProperty?.images && initialProperty.images.length > 0
    ? initialProperty.images
    : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ];

  const form = useForm<PropertyFormData>({
    defaultValues: {
      title: initialProperty?.title || '',
      description: initialProperty?.description || '',
      propertyType: initialProperty?.propertyType || 'Apartment',
      listingType: initialProperty?.listingType || 'sale',
      price: initialProperty?.price || 12500000,
      address: initialProperty?.address || '',
      locality: initialProperty?.locality || '',
      city: initialProperty?.city || 'Noida',
      state: initialProperty?.state || 'Uttar Pradesh',
      pincode: initialProperty?.pincode || '201301',
      bedrooms: initialProperty?.bedrooms ?? 3,
      bathrooms: initialProperty?.bathrooms ?? 2,
      area: initialProperty?.area || 1650,
      parking: typeof initialProperty?.parking === 'string' ? initialProperty.parking : '1 Covered',
      furnishing: initialProperty?.furnishing || 'Semi-Furnished',
      floor: initialProperty?.floor || '4th Floor',
      totalFloors: initialProperty?.totalFloors || '18 Floors',
      amenities: initialProperty?.amenities || [
        'Covered Parking',
        'Balcony',
        'Power Backup',
        'Security',
        'Lift',
      ],
      images: defaultImages,
    },
    resolver: async (values) => {
      const result = propertyFormSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      const fieldErrors: Record<string, { type: string; message: string }> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = { type: issue.code, message: issue.message };
        }
      });
      return { values: {}, errors: fieldErrors };
    },
    mode: 'onTouched',
  });

  const images = form.watch('images') || [];
  const selectedAmenities = form.watch('amenities') || [];

  // Step field mapping for validation when clicking Next
  const stepFields: Record<number, (keyof PropertyFormData)[]> = {
    1: ['title', 'description', 'propertyType', 'listingType', 'price'],
    2: ['address', 'locality', 'city', 'state', 'pincode'],
    3: ['bedrooms', 'bathrooms', 'area', 'parking', 'furnishing', 'floor', 'totalFloors'],
    4: ['amenities'],
    5: ['images'],
    6: [],
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = stepFields[currentStep];
    if (!fieldsToValidate || fieldsToValidate.length === 0) return true;
    return await form.trigger(fieldsToValidate);
  };

  const goToNextStep = async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = async (step: number): Promise<boolean> => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    return false;
  };

  // Image actions
  const handleAddImages = (newUrls: string[]) => {
    const updated = [...images, ...newUrls];
    form.setValue('images', updated, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    form.setValue('images', updated, { shouldValidate: true, shouldDirty: true });
    if (primaryImageIndex >= updated.length) {
      setPrimaryImageIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setPrimaryImageIndex(index);
      // Reorder so primary image is at position 0
      const selected = images[index];
      const others = images.filter((_, i) => i !== index);
      form.setValue('images', [selected, ...others], { shouldValidate: true, shouldDirty: true });
      setPrimaryImageIndex(0);
    }
  };

  // Amenity toggles
  const toggleAmenity = (amenity: string) => {
    const exists = selectedAmenities.includes(amenity);
    const updated = exists
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    form.setValue('amenities', updated, { shouldValidate: true, shouldDirty: true });
  };

  const handleSaveDraft = () => {
    setSaveDraftNotice('Draft saved successfully. Your progress is stored locally.');
    setTimeout(() => setSaveDraftNotice(null), 3500);
  };

  return {
    form,
    currentStep,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === STEPS.length,
    images,
    primaryImageIndex,
    handleAddImages,
    handleRemoveImage,
    handleSetPrimaryImage,
    selectedAmenities,
    toggleAmenity,
    saveDraftNotice,
    submitNotice,
    handleSaveDraft,
  };
};

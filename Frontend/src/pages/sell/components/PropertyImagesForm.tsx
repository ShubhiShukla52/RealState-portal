import React, { useRef, useEffect } from 'react';
import { UploadCloud, Trash2, Star, ImagePlus, Info, Check } from 'lucide-react';
import { FormError } from '../../../components/forms/FormError';

export interface PropertyImagesFormProps {
  images: string[];
  primaryIndex: number;
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (index: number) => void;
  onSetPrimaryImage: (index: number) => void;
  error?: string;
}

export const PropertyImagesForm: React.FC<PropertyImagesFormProps> = ({
  images,
  primaryIndex,
  onAddImages,
  onRemoveImage,
  onSetPrimaryImage,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createdObjectUrlsRef = useRef<string[]>([]);

  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      createdObjectUrlsRef.current.push(url);
      newUrls.push(url);
    });

    onAddImages(newUrls);

    // Reset input so same file can be re-selected if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sampleArchitecturalPhotos = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleAddSamplePhotos = () => {
    onAddImages(sampleArchitecturalPhotos);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#171717]">Property Photos</h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Upload clear photographs of interiors, facade, balcony views, and society amenities.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F2] text-[#737373] self-start sm:self-auto border border-[#E2E2DF]">
          {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
        </span>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F8EBE6]/60 border border-[#C66A4A]/20 text-xs text-[#222222]">
        <Info className="w-4 h-4 text-[#C66A4A] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#171717]">Listing Recommendation:</span>{' '}
          Upload at least 3 photos for a better listing. The primary photo is displayed as the main banner on cards and search results.
        </div>
      </div>

      {/* Upload Drop Zone / Button */}
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload property photos"
          className="w-full border-2 border-dashed border-[#A3A3A3] hover:border-[#171717] bg-white hover:bg-[#F5F5F2]/50 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F2] text-[#171717] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            <UploadCloud className="w-7 h-7 text-[#C66A4A]" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-[#171717]">
            Click to upload photos
          </h4>
          <p className="text-xs text-[#737373] mt-1">
            PNG, JPG, or WEBP from your local device. Multiple files supported.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C66A4A] bg-[#F8EBE6] px-3 py-1 rounded-full">
            <ImagePlus className="w-3.5 h-3.5" />
            Browse from Device
          </span>
        </div>

        {/* Quick Sample Photos Helper */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleAddSamplePhotos}
            className="text-xs font-semibold text-[#737373] hover:text-[#171717] underline hover:no-underline"
          >
            + Add Sample High-Res Photos
          </button>
        </div>

        {error && <FormError message={error} />}

        {/* Thumbnails Grid */}
        {images.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Uploaded Photos ({images.length})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imgUrl, index) => {
                const isPrimary = index === primaryIndex;

                return (
                  <div
                    key={imgUrl + index}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] bg-[#171717] border-2 group transition-all ${
                      isPrimary
                        ? 'border-[#C66A4A] ring-2 ring-[#C66A4A]/30'
                        : 'border-[#E2E2DF] hover:border-[#A3A3A3]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge */}
                    {isPrimary ? (
                      <div className="absolute top-2 left-2 bg-[#C66A4A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Primary Photo</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSetPrimaryImage(index)}
                        aria-label={`Set image ${index + 1} as primary photo`}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-[#171717]/80 hover:bg-[#171717] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs transition-opacity"
                      >
                        <Star className="w-3 h-3 text-amber-400" />
                        <span>Make Primary</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-[#DC2626] hover:text-white text-[#171717] flex items-center justify-center shadow-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Photo index indicator */}
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                      #{index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

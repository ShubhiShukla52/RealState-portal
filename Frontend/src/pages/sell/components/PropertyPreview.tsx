import React from 'react';
import {
  BedDouble,
  Bath,
  Maximize2,
  Car,
  Armchair,
  Layers,
  MapPin,
  CheckCircle2,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { PropertyFormData } from '../hooks/usePropertyForm';
import { Property } from '../../../types/property';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { Badge } from '../../../components/ui/Badge';
import { formatPrice, formatArea } from '../../../utils/formatters';

export interface PropertyPreviewProps {
  data: PropertyFormData;
}

export const PropertyPreview: React.FC<PropertyPreviewProps> = ({ data }) => {
  // Construct a Property object compatible with shared EstateX components
  const previewProperty: Property = {
    id: 'preview-listing',
    title: data.title || 'Modern Residence',
    description: data.description || 'No description provided.',
    price: Number(data.price) || 0,
    propertyType: data.propertyType || 'Apartment',
    listingType: data.listingType || 'sale',
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    area: Number(data.area) || 0,
    city: data.city || 'Noida',
    locality: data.locality || 'Sector 128',
    address: data.address || '',
    state: data.state || '',
    pincode: data.pincode || '',
    images: data.images && data.images.length > 0
      ? data.images
      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    parking: data.parking || '1 Covered',
    furnishing: data.furnishing || 'Semi-Furnished',
    floor: data.floor || 'Ground',
    totalFloors: data.totalFloors || '4 Floors',
    amenities: data.amenities || [],
    status: 'Pending',
    owner: {
      name: 'Rahul Sharma',
      role: 'Direct Owner',
      phone: '+91 98765 43210',
      responseTime: 'Responds within 2 hours',
    },
  };

  const specs = [
    { label: 'Bedrooms', value: `${previewProperty.bedrooms} BHK`, icon: BedDouble },
    { label: 'Bathrooms', value: `${previewProperty.bathrooms} Baths`, icon: Bath },
    { label: 'Super Area', value: formatArea(previewProperty.area), icon: Maximize2 },
    { label: 'Parking', value: String(previewProperty.parking), icon: Car },
    { label: 'Furnishing', value: String(previewProperty.furnishing), icon: Armchair },
    { label: 'Floor Level', value: `${previewProperty.floor} of ${previewProperty.totalFloors}`, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Notice Pill */}
      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm">
        <Eye className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong className="font-semibold">Listing Preview:</strong> Review your listing details below before final submission for marketplace review.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Detailed Full Page Preview */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm space-y-6">
          {/* Main Photo Gallery Preview */}
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#171717] border border-[#E2E2DF]">
              <img
                src={previewProperty.images[0]}
                alt={previewProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge
                  variant={previewProperty.listingType === 'sale' ? 'accent' : 'primary'}
                  className="px-3 py-1 font-semibold"
                >
                  {previewProperty.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/95 border-[#E2E2DF] text-[#171717] font-medium"
                >
                  {previewProperty.propertyType}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Preview Strip */}
            {previewProperty.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {previewProperty.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E2E2DF]"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="border-b border-[#E2E2DF] pb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#737373] mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#C66A4A]" />
              <span>
                {previewProperty.locality}, {previewProperty.city}, {previewProperty.state} - {previewProperty.pincode}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
              {previewProperty.title}
            </h3>
            <p className="text-2xl font-black text-[#171717] mt-2">
              {formatPrice(previewProperty.price, previewProperty.listingType)}
            </p>
          </div>

          {/* Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-3">
              Overview Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {specs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F5F5F2]/70 border border-[#E2E2DF]/60 flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E2DF] flex items-center justify-center text-[#C66A4A] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[#737373] truncate">
                        {item.label}
                      </p>
                      <p className="text-xs font-bold text-[#171717] truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">
              About This Property
            </h4>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed whitespace-pre-line">
              {previewProperty.description}
            </p>
          </div>

          {/* Amenities */}
          {previewProperty.amenities && previewProperty.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">
                Included Amenities ({previewProperty.amenities.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {previewProperty.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F2] text-[#222222] border border-[#E2E2DF]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#C66A4A]" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Card Representation & Owner Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Marketplace Card Preview
            </h4>
            <PropertyCard property={previewProperty} />
          </div>

          {/* Owner Information Preview */}
          <div className="bg-white rounded-2xl border border-[#E2E2DF] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#171717] flex items-center gap-1">
                  Rahul Sharma
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </h5>
                <p className="text-xs text-[#737373]">Direct Property Owner</p>
              </div>
            </div>
            <p className="text-xs text-[#737373] pt-2 border-t border-[#E2E2DF]">
              Buyers will be able to message you directly through the EstateX dashboard once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

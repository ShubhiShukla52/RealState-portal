import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../constants/routes';

export const PropertySearch: React.FC = () => {
  const navigate = useNavigate();

  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare query parameters for future filter connectivity
    const params = new URLSearchParams();
    if (listingType) params.append('type', listingType);
    if (location) params.append('location', location);
    if (propertyType) params.append('propertyType', propertyType);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const queryString = params.toString();
    navigate(queryString ? `${ROUTES.PROPERTIES}?${queryString}` : ROUTES.PROPERTIES);
  };

  return (
    <section className="relative -mt-8 sm:-mt-10 z-20">
      <Container size="xl">
        <div className="bg-white rounded-2xl border border-[#E2E2DF] shadow-md p-5 sm:p-7">
          {/* Listing Type Toggle Tabs */}
          <div className="flex items-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => setListingType('sale')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                listingType === 'sale'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'bg-[#F5F5F2] text-[#737373] hover:text-[#171717]'
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => setListingType('rent')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                listingType === 'rent'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'bg-[#F5F5F2] text-[#737373] hover:text-[#171717]'
              }`}
            >
              For Rent
            </button>
          </div>

          {/* Search Form Fields */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
            {/* Location Field */}
            <div className="lg:col-span-3">
              <label htmlFor="search-location" className="block text-xs font-semibold text-[#222222] mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <MapPin className="w-4 h-4 text-[#C66A4A]" />
                </div>
                <input
                  id="search-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, locality, or landmark"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] placeholder-[#A3A3A3] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
                />
              </div>
            </div>

            {/* Property Type Field */}
            <div className="lg:col-span-3">
              <label htmlFor="search-property-type" className="block text-xs font-semibold text-[#222222] mb-1.5">
                Property Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <Home className="w-4 h-4" />
                </div>
                <select
                  id="search-property-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] appearance-none"
                >
                  <option value="">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Min Price Field */}
            <div className="lg:col-span-2">
              <label htmlFor="search-min-price" className="block text-xs font-semibold text-[#222222] mb-1.5">
                Min Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <IndianRupee className="w-3.5 h-3.5" />
                </div>
                <select
                  id="search-min-price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] appearance-none"
                >
                  <option value="">No Min</option>
                  {listingType === 'sale' ? (
                    <>
                      <option value="5000000">₹50 Lac</option>
                      <option value="10000000">₹1 Cr</option>
                      <option value="20000000">₹2 Cr</option>
                      <option value="35000000">₹3.5 Cr</option>
                    </>
                  ) : (
                    <>
                      <option value="25000">₹25,000</option>
                      <option value="50000">₹50,000</option>
                      <option value="75000">₹75,000</option>
                      <option value="100000">₹1 Lac</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Max Price Field */}
            <div className="lg:col-span-2">
              <label htmlFor="search-max-price" className="block text-xs font-semibold text-[#222222] mb-1.5">
                Max Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <IndianRupee className="w-3.5 h-3.5" />
                </div>
                <select
                  id="search-max-price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-[#A3A3A3] text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717] appearance-none"
                >
                  <option value="">No Max</option>
                  {listingType === 'sale' ? (
                    <>
                      <option value="10000000">₹1 Cr</option>
                      <option value="25000000">₹2.5 Cr</option>
                      <option value="50000000">₹5 Cr</option>
                      <option value="100000000">₹10 Cr+</option>
                    </>
                  ) : (
                    <>
                      <option value="50000">₹50,000</option>
                      <option value="100000">₹1 Lac</option>
                      <option value="200000">₹2 Lac</option>
                      <option value="300000">₹3 Lac+</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Search Submit Button */}
            <div className="lg:col-span-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Search}
                className="w-full h-[42px]"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};

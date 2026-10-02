import React from 'react';
import { HeroSection } from './components/HeroSection';
import { PropertySearch } from './components/PropertySearch';
import { PropertyCategories } from './components/PropertyCategories';
import { FeaturedProperties } from './components/FeaturedProperties';
import { RecentlyViewed } from '../../components/property/RecentlyViewed';
import { RecommendedProperties } from '../../components/property/RecommendedProperties';
import { WhyEstateX } from './components/WhyEstateX';
import { HowItWorks } from './components/HowItWorks';
import { HomeCTA } from './components/HomeCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Search Properties Section */}
      <PropertySearch />

      {/* 3. Property Categories Section */}
      <PropertyCategories />

      {/* 4. Featured Properties Section */}
      <FeaturedProperties />

      {/* 5. Recently Viewed Section (renders only if data exists) */}
      <RecentlyViewed className="bg-white border-t border-[#E2E2DF]" />

      {/* 6. Recommended Properties Section */}
      <RecommendedProperties className="bg-[#F5F5F2] border-t border-[#E2E2DF]" />

      {/* 7. Why EstateX Section */}
      <WhyEstateX />

      {/* 8. How It Works Section */}
      <HowItWorks />

      {/* 9. Call To Action Section */}
      <HomeCTA />
    </div>
  );
};

export default HomePage;

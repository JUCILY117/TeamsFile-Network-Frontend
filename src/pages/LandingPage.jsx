import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import TestimonialSection from '../components/TestimonialSection';


export default function LandingPage() {
  return (
    <div className='overflow-x-hidden scroll-hidden'>
      <HeroSection />
      <FeatureSection/>
      <TestimonialSection/>
      </div>
  );
};

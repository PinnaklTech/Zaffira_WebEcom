
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedProducts from '@/components/FeaturedProducts';
import Refurbish from '@/components/Refurbish';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen animate-fade-in">
        <Navigation />
        <Hero />
        <About />
        <FeaturedProducts />
        <Refurbish />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;

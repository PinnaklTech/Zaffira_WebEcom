import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Sparkles, Clock, Shield, Award } from 'lucide-react';

const Refurbish = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const beforeAfterImages = [
    {
      id: 1,
      before: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
      after: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
      title: "Vintage Ring Restoration",
      description: "Transformed a worn family heirloom into a stunning modern piece"
    },
    {
      id: 2,
      before: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
      after: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
      title: "Necklace Redesign",
      description: "Reimagined an old necklace with contemporary styling"
    },
    {
      id: 3,
      before: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
      after: "https://images.unsplash.com/photo-1635767582909-345fa88ada70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
      title: "Earring Transformation",
      description: "Updated classic earrings with modern diamond settings"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + beforeAfterImages.length) % beforeAfterImages.length);
  };

  const handleBookConsultation = () => {
    navigate('/book-consultation');
  };

  return (
    <section id="refurbish" className="py-20 sm:py-24 lg:py-32 luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gold rounded-full animate-float"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-gold rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full px-6 py-3 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-navy/80 font-medium">Restoration Excellence</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-navy mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Refurbish Your Treasures
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
          <p className="text-xl text-navy/70 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Give new life to your cherished jewelry pieces. Our master craftsmen specialize in restoration, 
            redesign, and modernization while preserving the sentimental value of your treasures.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Before/After Gallery */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="overflow-hidden shadow-luxury-lg border-gold/20 rounded-3xl">
              <div className="relative">
                <div className="grid grid-cols-2">
                  {/* Before */}
                  <div className="relative">
                    <img
                      src={beforeAfterImages[currentSlide].before}
                      alt="Before refurbishment"
                      className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Before
                    </div>
                  </div>
                  
                  {/* After */}
                  <div className="relative">
                    <img
                      src={beforeAfterImages[currentSlide].after}
                      alt="After refurbishment"
                      className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      After
                    </div>
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-navy p-3 rounded-full shadow-luxury transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-navy p-3 rounded-full shadow-luxury transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <CardContent className="p-8">
                <h3 className="text-2xl font-playfair font-bold text-navy mb-3">
                  {beforeAfterImages[currentSlide].title}
                </h3>
                <p className="text-navy/70 text-lg leading-relaxed">
                  {beforeAfterImages[currentSlide].description}
                </p>
              </CardContent>
            </Card>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {beforeAfterImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-gold' : 'bg-gray-300'
                  } hover:scale-125`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div>
              <h3 className="text-4xl font-playfair font-bold text-navy mb-6">
                Transform Your Legacy
              </h3>
              <p className="text-xl text-navy/80 leading-relaxed mb-8">
                Whether it's a family heirloom that needs restoration or a piece you'd like to modernize, 
                our expert craftsmen can breathe new life into your jewelry while maintaining its emotional significance.
              </p>
            </div>

            {/* Services List */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="bg-gold/20 rounded-full p-3 group-hover:bg-gold/30 transition-colors duration-300">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-navy text-lg mb-2">Restoration</h4>
                  <p className="text-navy/70">Bring back the original beauty of vintage pieces</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-gold/20 rounded-full p-3 group-hover:bg-gold/30 transition-colors duration-300">
                  <Award className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-navy text-lg mb-2">Redesign</h4>
                  <p className="text-navy/70">Transform outdated styles into contemporary masterpieces</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-gold/20 rounded-full p-3 group-hover:bg-gold/30 transition-colors duration-300">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-navy text-lg mb-2">Stone Setting</h4>
                  <p className="text-navy/70">Secure loose stones or add new ones for enhanced beauty</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-gold/20 rounded-full p-3 group-hover:bg-gold/30 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-navy text-lg mb-2">Resizing & Repair</h4>
                  <p className="text-navy/70">Perfect fit and structural integrity restoration</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-10 py-5 mb-6 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-luxury-lg group"
                onClick={handleBookConsultation}
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Book Free Consultation
              </Button>
              <p className="text-navy/60 text-lg">
                Get a free estimate and consultation with our master jewelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Refurbish;

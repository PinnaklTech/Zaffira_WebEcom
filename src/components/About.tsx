
import React from 'react';
import { Award, Users, Gem, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-20 w-40 h-40 border border-navy rounded-full"></div>
        <div className="absolute bottom-20 left-16 w-28 h-28 border border-navy rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8 sm:space-y-10 order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full px-6 py-3 mb-6 animate-fade-in">
                <Heart className="h-4 w-4 text-gold" />
                <span className="text-navy/80 font-medium">Our Heritage</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-navy mb-6 sm:mb-8 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                About Zaffira
              </h2>
              <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-gold to-gold-light rounded-full mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            <p className="text-lg sm:text-xl text-navy/80 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              For over three decades, Zaffira has been synonymous with exceptional craftsmanship and timeless elegance. Our master artisans pour their passion into every piece, creating jewelry that transcends trends and becomes treasured heirlooms.
            </p>
            
            <p className="text-lg sm:text-xl text-navy/80 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Each piece in our collection tells a story of dedication, precision, and artistry. From selecting the finest materials to the final polish, we ensure that every detail meets our exacting standards of perfection.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-8 sm:pt-10">
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="bg-gold/10 rounded-2xl p-4 mb-3 group-hover:bg-gold/20 transition-colors duration-300">
                  <Award className="h-8 w-8 text-gold mx-auto" />
                </div>
                <div className="text-3xl sm:text-4xl font-playfair font-bold text-navy mb-2">30+</div>
                <div className="text-sm sm:text-base text-navy/70 font-medium">Years of Excellence</div>
              </div>
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-gold/10 rounded-2xl p-4 mb-3 group-hover:bg-gold/20 transition-colors duration-300">
                  <Users className="h-8 w-8 text-gold mx-auto" />
                </div>
                <div className="text-3xl sm:text-4xl font-playfair font-bold text-navy mb-2">10K+</div>
                <div className="text-sm sm:text-base text-navy/70 font-medium">Happy Customers</div>
              </div>
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <div className="bg-gold/10 rounded-2xl p-4 mb-3 group-hover:bg-gold/20 transition-colors duration-300">
                  <Gem className="h-8 w-8 text-gold mx-auto" />
                </div>
                <div className="text-3xl sm:text-4xl font-playfair font-bold text-navy mb-2">500+</div>
                <div className="text-sm sm:text-base text-navy/70 font-medium">Unique Designs</div>
              </div>
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="bg-gold/10 rounded-2xl p-4 mb-3 group-hover:bg-gold/20 transition-colors duration-300">
                  <Heart className="h-8 w-8 text-gold mx-auto" />
                </div>
                <div className="text-3xl sm:text-4xl font-playfair font-bold text-navy mb-2">100%</div>
                <div className="text-sm sm:text-base text-navy/70 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative overflow-hidden rounded-3xl shadow-luxury-lg">
              <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=90"
                alt="Jewelry craftsmanship"
                className="w-full h-80 sm:h-96 lg:h-[28rem] object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-gold/10"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-white p-6 sm:p-8 rounded-2xl shadow-luxury border border-gold/20 animate-float">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-navy mb-2">Master Crafted</div>
                <div className="text-sm sm:text-base text-gold font-semibold">Since 1993</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

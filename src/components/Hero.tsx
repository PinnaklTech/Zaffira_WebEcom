import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Award, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(26, 43, 76, 0.3) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(26, 43, 76, 0.4) 100%), url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90')`,
        }}
      />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <Sparkles className="h-8 w-8 text-gold" />
      </div>
      <div className="absolute bottom-32 right-16 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <Award className="h-6 w-6 text-gold" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <Shield className="h-7 w-7 text-gold" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-sm font-medium text-white/90">
            <Sparkles className="h-4 w-4 text-gold" />
            Handcrafted Excellence Since 1993
          </span>
        </div>
        
        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-bold mb-6 sm:mb-8 animate-fade-in leading-tight" style={{ animationDelay: '0.2s' }}>
          Exquisite
          <span className="block text-gold drop-shadow-lg">Jewelry</span>
          Crafted with Love
        </h1>

        <p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 text-white/90 max-w-3xl mx-auto animate-fade-in px-2 leading-relaxed font-light"
          style={{ animationDelay: "0.3s" }}
        >
          Discover our collection of handcrafted jewelry pieces that tell your
          unique story
        </p>

        {/* Trust Indicators */}
        <div 
          className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mb-8 sm:mb-10 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Shield className="h-4 w-4 text-gold" />
            <span>Certified Authentic</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Award className="h-4 w-4 text-gold" />
            <span>30+ Years Legacy</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>Handcrafted Excellence</span>
          </div>
        </div>
        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in px-4"
          style={{ animationDelay: "0.5s" }}
        >
          <Link to="/products" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-navy font-bold px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg min-h-[52px] sm:min-h-[56px] transition-all duration-500 transform hover:scale-105 hover:shadow-luxury-lg rounded-2xl group"
            >
              <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
              Browse Collection
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white hover:text-navy backdrop-blur-md px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg min-h-[52px] sm:min-h-[56px] transition-all duration-500 transform hover:scale-105 hover:shadow-luxury-lg rounded-2xl font-semibold"
            onClick={() => {
              const aboutSection = document.getElementById("about");
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Our Story
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

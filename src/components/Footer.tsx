
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Heart, Award, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gold rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-gold rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-gold rounded-full"></div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Company Info */}
          <div className="space-y-8 sm:col-span-2 lg:col-span-1">
            <div>
              <h3 className="text-3xl sm:text-4xl font-playfair font-bold text-gold mb-2">Zaffira</h3>
              <p className="text-gold/80 font-medium">Luxury Jewelry Collection</p>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              Crafting timeless jewelry pieces that celebrate life's most precious moments. 
              Experience the art of fine jewelry with Zaffira.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Award className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium">30+ Years</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium">Certified</span>
              </div>
            </div>
            
            <div className="flex space-x-6 pt-6">
              <a href="#" className="text-gray-400 hover:text-gold transition-all duration-300 hover:scale-110">
                <Facebook className="w-7 h-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-all duration-300 hover:scale-110">
                <Instagram className="w-7 h-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-all duration-300 hover:scale-110">
                <Twitter className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl sm:text-2xl font-playfair font-bold text-gold mb-6 sm:mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">About Us</a></li>
              <li><a href="#products" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Products</a></li>
              <li><a href="#refurbish" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Refurbish</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl sm:text-2xl font-playfair font-bold text-gold mb-6 sm:mb-8">Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Custom Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Jewelry Repair</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Appraisals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Ring Resizing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium hover:translate-x-1">Cleaning & Care</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl sm:text-2xl font-playfair font-bold text-gold mb-6 sm:mb-8">Contact Us</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <MapPin className="w-6 h-6 text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-gray-300 text-lg font-medium">Telangana State</p>
                  <p className="text-gray-300 text-lg">Hyderabad, Secunderabad</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <Phone className="w-6 h-6 text-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium">
                  +91 0000000000
                </a>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <Mail className="w-6 h-6 text-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <a href="mailto:info@zaffira.com" className="text-gray-300 hover:text-gold transition-all duration-300 text-lg font-medium">
                  info@zaffira.com
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-10">
              <h5 className="text-lg font-playfair font-bold text-gold mb-4">Business Hours</h5>
              <div className="text-gray-300 space-y-2">
                <p className="font-medium">Mon - Fri: 10am - 7pm</p>
                <p className="font-medium">Saturday: 10am - 6pm</p>
                <p className="font-medium">Sunday: 12pm - 5pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/20 bg-navy-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-center sm:text-left flex items-center gap-2">
              © {currentYear} Zaffira Jewelry. All rights reserved.
              <Heart className="h-4 w-4 text-gold inline" />
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-8">
              <a href="#" className="text-gray-400 hover:text-gold transition-all duration-300 font-medium hover:translate-y-[-2px]">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gold transition-all duration-300 font-medium hover:translate-y-[-2px]">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-gold transition-all duration-300 font-medium hover:translate-y-[-2px]">Return Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

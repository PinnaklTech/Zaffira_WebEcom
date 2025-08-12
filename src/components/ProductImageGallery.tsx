
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProductImage } from '@/types/product';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
  showThumbnails?: boolean;
  isOutOfStock?: boolean;
  showArrows?: boolean;
  enableZoom?: boolean;
}

const ProductImageGallery = ({ 
  images, 
  productName, 
  className = '', 
  showThumbnails = false,
  isOutOfStock = false,
  showArrows = false,
  enableZoom = true
}: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square overflow-hidden relative ${className}`}>
        <img
          src="/placeholder.svg"
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : ''}`}
        />
      </div>
    );
  }

  const currentImage = images[currentImageIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="aspect-square overflow-hidden relative group cursor-pointer" onClick={() => enableZoom && setIsZoomOpen(true)}>
        <img
          src={currentImage.url}
          alt={currentImage.altText || productName}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
        />
        
        {/* Zoom Icon */}
        {enableZoom && (
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ZoomIn className="h-4 w-4 text-navy" />
            </div>
          </div>
        )}
        
        {/* Image Counter Badge */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4 bg-navy/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full font-medium shadow-lg">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Navigation Arrows - Only show if multiple images and showArrows is true */}
        {hasMultipleImages && showArrows && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-luxury hover:scale-110"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-luxury hover:scale-110"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Zoom Modal */}
      {enableZoom && (
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogContent className="max-w-6xl glass-effect border-gold/20 rounded-3xl p-2">
            <div className="relative">
              <img
                src={currentImage.url}
                alt={currentImage.altText || productName}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-gold scale-125' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Thumbnails */}
      {showThumbnails && hasMultipleImages && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'border-gold shadow-luxury scale-105' 
                  : 'border-gray-200 hover:border-gold/50 hover:scale-105'
              }`}
            >
              <img
                src={image.url}
                alt={image.altText || `${productName} view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators for Mobile */}
      {hasMultipleImages && !showThumbnails && (
        <div className="flex justify-center gap-2 mt-4 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-gold scale-125' 
                  : 'bg-gray-300 hover:bg-gold/50 hover:scale-110'
              } shadow-sm`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

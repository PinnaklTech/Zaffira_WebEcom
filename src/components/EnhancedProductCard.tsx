
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product, getStockStatus } from '@/types/product';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';
import ProductImageGallery from '@/components/ProductImageGallery';
import { Eye, Heart, ShoppingCart, Star, Zap } from 'lucide-react';

interface EnhancedProductCardProps {
  product: Product;
  view: 'grid' | 'list';
  showAddToCart?: boolean;
}

const EnhancedProductCard = ({ product, view, showAddToCart = true }: EnhancedProductCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const stockInfo = getStockStatus(product);

  const handleAddToCart = () => {
    if (!stockInfo.inStock) {
      toast({
        title: "Item unavailable",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast({
      title: "Item added to cart successfully!",
      description: (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">{product.name}</span>
          <Link to="/cart">
            <Button 
              size="sm" 
              className="bg-gold hover:bg-gold-dark text-navy font-bold w-full min-h-[44px] rounded-xl"
            >
              View Cart
            </Button>
          </Link>
        </div>
      ),
      duration: 4000,
    });
  };

  const QuickViewModal = () => (
    <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
      <DialogContent className="max-w-4xl glass-effect border-gold/20 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl text-navy">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
              isOutOfStock={!stockInfo.inStock}
              showThumbnails={true}
              className="aspect-square rounded-2xl overflow-hidden"
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.isFeatured && (
                  <Badge className="bg-gold text-navy font-semibold">Featured</Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-100 text-red-800 font-semibold">Sale</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-navy">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-gold fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-navy/60">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              )}
            </div>
            <p className="text-navy/80 leading-relaxed">{product.description}</p>
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!stockInfo.inStock}
                className="flex-1 bg-gold hover:bg-gold-dark text-navy font-bold py-3 rounded-xl transition-all duration-300"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {stockInfo.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Link to={`/products/${product._id}`} className="flex-1">
                <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-navy py-3 rounded-xl font-semibold">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  const getButtonContent = () => {
    if (!stockInfo.inStock) return 'Out of Stock';
    return 'Add to Cart';
  };

  const isButtonDisabled = !stockInfo.inStock;
  const buttonClassName = `w-full font-semibold transition-all duration-300 ${
    isButtonDisabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
      : 'bg-gold hover:bg-gold-dark text-navy'
  }`;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  if (view === 'list') {
    return (
      <div 
        className={`group bg-white rounded-2xl shadow-elegant border border-gray-100 overflow-hidden hover:shadow-luxury-lg transition-all duration-500 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 ${!stockInfo.inStock ? 'opacity-75' : ''} hover:border-gold/30`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full sm:w-64 flex-shrink-0 relative">
          <ProductImageGallery
            images={product.images || []}
            productName={product.name}
            isOutOfStock={!stockInfo.inStock}
            showThumbnails={true}
            className="h-64 rounded-2xl overflow-hidden"
          />
          {/* Quick View Overlay */}
          <div className={`absolute inset-0 bg-navy/60 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              onClick={() => setIsQuickViewOpen(true)}
              className="bg-white/90 hover:bg-white text-navy font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <Link to={`/products/${product._id}`}>
                <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-navy group-hover:text-gold transition-colors leading-tight hover:text-gold cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <div className="flex gap-2 flex-wrap">
                {product.isFeatured && (
                  <Badge className="bg-gold text-navy font-bold px-3 py-1 rounded-full">
                    Featured
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                    Sale
                  </Badge>
                )}
              </div>
            </div>
            

            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <span className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></span>
                <span className={stockInfo.color}>{stockInfo.text}</span>
              </span>
              {product.rating > 0 && (
                <span className="text-navy/70 flex items-center gap-1">
                  <Star className="h-4 w-4 text-gold fill-current" />
                  {product.rating.toFixed(1)} ({product.numReviews})
                </span>
              )}
              {stockInfo.inStock && (
                <span className="text-navy/70 flex items-center gap-1">
                  <Zap className="h-4 w-4 text-green-500" />
                  Fast Delivery
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-navy">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {showAddToCart && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold text-gold hover:bg-gold hover:text-navy rounded-xl transition-all duration-300"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className={`${buttonClassName} sm:w-auto px-8 py-3 min-h-[48px] rounded-xl font-bold`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {getButtonContent()}
                </Button>
              </div>
            )}
          </div>
        </div>
        <QuickViewModal />
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={`group bg-white rounded-3xl shadow-elegant border border-gray-100 hover:border-gold/40 hover:shadow-luxury-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-2 relative ${!stockInfo.inStock ? 'opacity-60' : ''} animate-fade-in cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product._id}`}>
        <ProductImageGallery
          images={product.images || []}
          productName={product.name}
          isOutOfStock={!stockInfo.inStock}
          className="w-full h-full object-cover aspect-square transition-transform duration-700 group-hover:scale-110"
        />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <Badge className="bg-red-500 text-white font-bold px-3 py-1.5 rounded-full shadow-lg">
              Sale
            </Badge>
          )}
          {product.isFeatured && stockInfo.inStock && (
            <Badge className="bg-gold text-navy font-bold px-3 py-1.5 rounded-full shadow-lg">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            onClick={() => setIsQuickViewOpen(true)}
            className="bg-white/90 hover:bg-white text-navy font-semibold px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white border-gold text-gold hover:text-navy rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-4">
        <Link to={`/products/${product._id}`}>
        <h3 className="text-xl sm:text-2xl font-playfair font-bold text-navy group-hover:text-gold transition-colors leading-tight mb-2 hover:text-gold">
          {product.name}
        </h3>
        </Link>
        
        <div className="flex items-center gap-3 text-sm text-navy/70 mb-3">
          <span className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></span>
            <span className={stockInfo.color}>{stockInfo.text}</span>
          </span>
          {product.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-gold fill-current" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl sm:text-3xl font-bold text-navy">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-500 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        {showAddToCart && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-gold text-gold hover:bg-gold hover:text-navy rounded-xl transition-all duration-300 flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist functionality
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="flex-1 rounded-xl bg-gold text-navy font-bold py-3 shadow-elegant hover:bg-gold-dark hover:shadow-luxury transition-all duration-300 text-base"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {getButtonContent()}
            </Button>
          </div>
        )}
      </div>
      
      <QuickViewModal />
    </div>
  );
};

export default EnhancedProductCard;

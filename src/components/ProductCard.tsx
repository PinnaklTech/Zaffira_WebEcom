
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, getStockStatus } from '@/types/product';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';
import ProductImageGallery from '@/components/ProductImageGallery';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: ProductCardProps) => {
  const dispatch = useAppDispatch();
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
              className="bg-gold hover:bg-gold-dark text-navy font-bold w-full rounded-xl"
            >
              View Cart
            </Button>
          </Link>
        </div>
      ),
      duration: 4000,
    });
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div 
      className={`group bg-white rounded-3xl shadow-elegant border border-gray-100 hover:border-gold/40 hover:shadow-luxury-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-3 ${!stockInfo.inStock ? 'opacity-75' : ''} cursor-pointer relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product._id}`}>
      <ProductImageGallery
        images={product.images || []}
        productName={product.name}
        isOutOfStock={!stockInfo.inStock}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <Badge className="bg-red-500 text-white font-bold px-3 py-1.5 rounded-full shadow-lg animate-scale-in">
              {discountPercentage}% OFF
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-gold text-navy font-bold px-3 py-1.5 rounded-full shadow-lg animate-scale-in">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white border-gold text-gold hover:text-navy rounded-xl shadow-lg backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link to={`/products/${product._id}`}>
            <Button className="bg-white/90 hover:bg-white text-navy font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-6 sm:p-7">
        <div className="mb-4">
          <Link to={`/products/${product._id}`}>
          <h3 className="text-lg sm:text-xl font-playfair font-bold text-navy group-hover:text-gold transition-colors leading-tight mb-2 hover:text-gold">
            {product.name}
          </h3>
          </Link>
        </div>
        
        <div className="flex items-center gap-3 text-sm mb-4">
          <span className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></span>
            <span className={stockInfo.color}>{stockInfo.text}</span>
          </span>
          {product.rating > 0 && (
            <span className="text-navy/70 flex items-center gap-1">
              <Star className="h-3 w-3 text-gold fill-current" />
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
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
                disabled={!stockInfo.inStock}
                className={`flex-1 font-bold text-sm py-3 min-h-[48px] transition-all duration-300 rounded-xl ${
                  stockInfo.inStock 
                    ? 'bg-gold hover:bg-gold-dark text-navy' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {stockInfo.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

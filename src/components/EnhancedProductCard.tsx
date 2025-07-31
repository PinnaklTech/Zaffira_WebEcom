
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product, getStockStatus } from '@/types/product';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';
import ProductImageGallery from '@/components/ProductImageGallery';

interface EnhancedProductCardProps {
  product: Product;
  view: 'grid' | 'list';
  showAddToCart?: boolean;
}

const EnhancedProductCard = ({ product, view, showAddToCart = true }: EnhancedProductCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const stockInfo = getStockStatus(product);
  // Assume user is always authenticated for add-to-cart (since cart is only for signed-in users)

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
              className="bg-gold hover:bg-gold-dark text-navy font-semibold w-full min-h-[44px]"
            >
              View Cart
            </Button>
          </Link>
        </div>
      ),
      duration: 4000,
    });
  };

  const getButtonContent = () => {
    if (!stockInfo.inStock) return 'Out of Stock';
    // if (!user) return 'Sign in to Add'; // Removed user check
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
      <div className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 ${!stockInfo.inStock ? 'opacity-75' : ''}`}>
        <div className="w-full sm:w-52 flex-shrink-0">
          <ProductImageGallery
            images={product.images || []}
            productName={product.name}
            isOutOfStock={!stockInfo.inStock}
            showThumbnails={true}
            className="h-52 rounded-lg overflow-hidden"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
              <Link to={`/products/${product._id}`}>
                <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-navy group-hover:text-gold transition-colors leading-tight hover:text-gold cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <div className="flex gap-2">
                {product.isFeatured && (
                  <span className="bg-gold text-white text-xs px-3 py-1.5 rounded-full w-fit font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>
            

            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={stockInfo.color}>{stockInfo.text}</span>
              </span>
              {product.rating > 0 && (
                <span className="text-gray-600">
                  ⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              )}
              {stockInfo.inStock && <span className="text-gray-600">2-Day Delivery</span>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
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
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className={`${buttonClassName} sm:w-auto px-6 py-3 min-h-[48px]`}
                >
                  {getButtonContent()}
                </Button>
                {/* {!user && stockInfo.inStock && ( // Removed user check
                  <span className="text-xs text-gray-500 text-center sm:text-right">Login required</span>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Link to={`/products/${product._id}`} className="block">
      <div className={`group bg-ivory rounded-2xl shadow-md border border-ivory hover:border-gold hover:border-2 hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 relative ${!stockInfo.inStock ? 'opacity-60' : ''} animate-fade-in cursor-pointer`}> 
      <div className="relative aspect-square overflow-hidden min-h-[320px]">
        <ProductImageGallery
          images={product.images || []}
          productName={product.name}
          isOutOfStock={!stockInfo.inStock}
          className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
        />
        {/* Featured/On Sale badge */}
        {product.isFeatured && stockInfo.inStock && (
          <span className="absolute top-3 right-3 bg-gold text-ivory text-xs px-3 py-1.5 rounded-full font-semibold shadow-md z-10">
            Featured
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-gold-dark text-ivory text-xs px-3 py-1.5 rounded-full font-semibold shadow-md z-10">
            Sale
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3">
        <h3 className="text-lg sm:text-xl font-playfair font-bold text-navy group-hover:text-gold transition-colors leading-tight mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-navy/70 mb-2">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={stockInfo.color}>{stockInfo.text}</span>
          </span>
          {product.rating > 0 && (
            <span>⭐ {product.rating.toFixed(1)}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-navy">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-base text-gold-dark line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        {showAddToCart && (
          <div onClick={(e) => e.preventDefault()}>
            <Button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="w-full rounded-full bg-gold text-navy font-bold py-3 shadow-md hover:bg-gold-dark hover:text-ivory transition-all text-base"
            >
              {getButtonContent()}
            </Button>
          </div>
        )}
      </div>
      </div>
    </Link>
  );
};

export default EnhancedProductCard;

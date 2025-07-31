
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product, getStockStatus } from '@/types/product';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';
import ProductImageGallery from '@/components/ProductImageGallery';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: ProductCardProps) => {
  const dispatch = useAppDispatch();
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
              className="bg-gold hover:bg-gold-dark text-navy font-semibold w-full"
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

  return (
    <Link to={`/products/${product._id}`} className="block">
      <div className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${!stockInfo.inStock ? 'opacity-75' : ''} cursor-pointer`}>
      <ProductImageGallery
        images={product.images || []}
        productName={product.name}
        isOutOfStock={!stockInfo.inStock}
        className="aspect-square"
      />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base sm:text-lg font-playfair font-semibold text-navy group-hover:text-gold transition-colors leading-tight flex-1 pr-2">
            {product.name}
          </h3>
          <div className="flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-gold text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                Featured
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs mb-4">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${stockInfo.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={stockInfo.color}>{stockInfo.text}</span>
          </span>
          {product.rating > 0 && (
            <span className="text-gray-500">
              ⭐ {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-navy">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          {showAddToCart && (
            <div onClick={(e) => e.preventDefault()}>
              <Button
                onClick={handleAddToCart}
                disabled={!stockInfo.inStock}
                className={`w-full font-semibold text-sm py-2.5 min-h-[44px] transition-all duration-300 ${
                  stockInfo.inStock 
                    ? 'bg-gold hover:bg-gold-dark text-navy' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {stockInfo.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
};

export default ProductCard;

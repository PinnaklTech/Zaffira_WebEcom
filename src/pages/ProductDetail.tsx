import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchProductById, clearCurrentProduct } from '@/store/slices/productSlice';
import { addToCart } from '@/store/slices/cartSlice';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductImageGallery from '@/components/ProductImageGallery';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  Minus,
  Plus,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award
} from 'lucide-react';
import { getStockStatus } from '@/types/product';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    
    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = () => {
    if (!currentProduct) return;
    
    const stockInfo = getStockStatus(currentProduct);
    if (!stockInfo.inStock) {
      toast({
        title: "Item unavailable",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ productId: currentProduct._id, quantity }));
    toast({
      title: "Added to cart!",
      description: `${currentProduct.name} has been added to your cart.`,
      action: (
        <Link to="/cart">
          <Button size="sm" className="bg-gold hover:bg-gold-dark text-navy">
            View Cart
          </Button>
        </Link>
      ),
    });
  };

  const handleShare = async () => {
    if (navigator.share && currentProduct) {
      try {
        await navigator.share({
          title: currentProduct.name,
          text: currentProduct.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard.",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-28">
          <Loading message="Loading product details..." />
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-28">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-playfair text-navy mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-gold hover:bg-gold-dark text-navy"
            >
              Browse All Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stockInfo = getStockStatus(currentProduct);
  const displayPrice = currentProduct.discountPrice || currentProduct.price;
  const hasDiscount = currentProduct.discountPrice && currentProduct.discountPrice < currentProduct.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((currentProduct.price - currentProduct.discountPrice) / currentProduct.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gold transition-colors">Products</Link>
            <span>/</span>
            <span className="text-navy font-medium">{currentProduct.name}</span>
          </nav>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-navy hover:text-gold hover:bg-gold/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <ProductImageGallery
                images={currentProduct.images || []}
                productName={currentProduct.name}
                isOutOfStock={!stockInfo.inStock}
                showThumbnails={true}
                showArrows={true}
                className="aspect-square rounded-2xl overflow-hidden shadow-lg"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title and Badges */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-playfair font-bold text-navy mb-2">
                      {currentProduct.name}
                    </h1>
                    <p className="text-navy/60 text-sm font-medium">SKU: {currentProduct.sku}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="border-gold text-gold hover:bg-gold hover:text-navy"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gold text-gold hover:bg-gold hover:text-navy"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  {currentProduct.isFeatured && (
                    <Badge className="bg-gold text-navy">Featured</Badge>
                  )}
                  {hasDiscount && (
                    <Badge className="bg-red-100 text-red-800">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                  <Badge className={`${stockInfo.color} border`} variant="outline">
                    {stockInfo.text}
                  </Badge>
                </div>

                {/* Rating */}
                {currentProduct.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(currentProduct.rating)
                              ? 'text-gold fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-navy/60">
                      {currentProduct.rating.toFixed(1)} ({currentProduct.numReviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-navy">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{currentProduct.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-green-600 font-medium">
                    You save ₹{(currentProduct.price - currentProduct.discountPrice).toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3">Description</h3>
                <p className="text-navy/80 leading-relaxed">{currentProduct.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gold/20">
                <div>
                  <span className="text-sm text-navy/60">Category</span>
                  <p className="font-medium text-navy capitalize">{currentProduct.category}</p>
                </div>
                <div>
                  <span className="text-sm text-navy/60">Collection</span>
                  <p className="font-medium text-navy capitalize">{currentProduct.collections}</p>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="py-4 border-b border-gold/20">
                <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold" />
                  Supplier Information
                </h3>
                {currentProduct.supplier ? (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">{currentProduct.supplier.name}</h4>
                        {currentProduct.supplier.specialty && (
                          <p className="text-sm text-navy/60">{currentProduct.supplier.specialty}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-navy/60" />
                        <span className="text-sm text-navy">{currentProduct.supplier.emailId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-navy/60" />
                        <span className="text-sm text-navy">{currentProduct.supplier.phoneNumber}</span>
                      </div>
                      {currentProduct.supplier.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-navy/60" />
                          <span className="text-sm text-navy">{currentProduct.supplier.location}</span>
                        </div>
                      )}
                      {currentProduct.supplier.certification && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-navy">{currentProduct.supplier.certification}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">No supplier information available for this product.</p>
                  </div>
                )}
              </div>
              


              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-navy">Quantity:</span>
                  <div className="flex items-center border border-gold/30 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0 hover:bg-gold/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(currentProduct.countInStock, quantity + 1))}
                      disabled={quantity >= currentProduct.countInStock}
                      className="h-10 w-10 p-0 hover:bg-gold/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!stockInfo.inStock}
                  className={`w-full py-6 text-lg font-semibold ${
                    stockInfo.inStock
                      ? 'bg-gold hover:bg-gold-dark text-navy'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {stockInfo.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Truck className="h-5 w-5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-navy">Free Shipping</p>
                    <p className="text-xs text-navy/60">On orders over ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Shield className="h-5 w-5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-navy">Authentic</p>
                    <p className="text-xs text-navy/60">100% genuine jewelry</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <RotateCcw className="h-5 w-5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-navy">Easy Returns</p>
                    <p className="text-xs text-navy/60">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16">
            <Card className="border-gold/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-playfair font-bold text-navy mb-6">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-navy mb-3">Care Instructions</h4>
                    <ul className="space-y-2 text-navy/80">
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>Store in a dry, cool place away from direct sunlight</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>Clean gently with a soft cloth after each use</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>Avoid contact with perfumes, lotions, and chemicals</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>Professional cleaning recommended annually</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy mb-3">Shipping & Returns</h4>
                    <ul className="space-y-2 text-navy/80">
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>Free shipping on orders over ₹5,000</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>2-3 business days delivery within city</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>30-day return policy for unworn items</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>Certificate of authenticity included</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
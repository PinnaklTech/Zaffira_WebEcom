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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Award,
  Video,
  Calendar,
  Zap,
  Crown
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
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);

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
          <Button size="sm" className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl">
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

  const VideoCallModal = () => (
    <Dialog open={isVideoCallModalOpen} onOpenChange={setIsVideoCallModalOpen}>
      <DialogContent className="max-w-md glass-effect border-gold/20 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl text-navy text-center">Book Video Consultation</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-2">
          <div className="text-center">
            <div className="bg-gold/10 rounded-full p-6 w-20 h-20 mx-auto mb-4">
              <Video className="h-8 w-8 text-gold mx-auto" />
            </div>
            <h3 className="font-playfair font-bold text-navy mb-2">Personal Jewelry Consultation</h3>
            <p className="text-navy/70 text-sm leading-relaxed">
              Connect with our jewelry experts via video call to discuss this piece in detail, 
              get styling advice, and ask any questions you may have.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-navy/80">
              <Check className="h-4 w-4 text-green-500" />
              <span>Free 15-minute consultation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy/80">
              <Check className="h-4 w-4 text-green-500" />
              <span>Expert styling recommendations</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy/80">
              <Check className="h-4 w-4 text-green-500" />
              <span>Detailed product information</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to="/book-appointment" className="flex-1">
              <Button className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Now
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  if (loading) {
    return (
      <div className="min-h-screen luxury-gradient">
        <Navigation />
        <div className="pt-28">
          <Loading message="Loading product details..." />
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen luxury-gradient">
        <Navigation />
        <div className="pt-28">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4">Product Not Found</h2>
            <p className="text-navy/70 mb-6 text-lg">{error || "The product you're looking for doesn't exist."}</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-4 rounded-2xl"
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
    <div className="min-h-screen luxury-gradient">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-navy/60 mb-10 animate-fade-in">
            <Link to="/" className="hover:text-gold transition-colors font-medium">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gold transition-colors font-medium">Products</Link>
            <span>/</span>
            <span className="text-navy font-bold">{currentProduct.name}</span>
          </nav>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-navy hover:text-gold hover:bg-gold/10 rounded-xl font-semibold animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <ProductImageGallery
                images={currentProduct.images || []}
                productName={currentProduct.name}
                isOutOfStock={!stockInfo.inStock}
                showThumbnails={true}
                showArrows={true}
                className="aspect-square rounded-3xl overflow-hidden shadow-luxury-lg"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Product Title and Badges */}
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-navy mb-3 leading-tight">
                      {currentProduct.name}
                    </h1>
                    <p className="text-navy/60 text-base font-medium">SKU: {currentProduct.sku}</p>
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="border-gold text-gold hover:bg-gold hover:text-navy rounded-xl transition-all duration-300 hover:scale-110"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gold text-gold hover:bg-gold hover:text-navy rounded-xl transition-all duration-300 hover:scale-110"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-3 mb-6">
                  {currentProduct.isFeatured && (
                    <Badge className="bg-gold text-navy font-bold px-4 py-2 rounded-full">
                      <Crown className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {hasDiscount && (
                    <Badge className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">
                      <Zap className="h-3 w-3 mr-1" />
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                  <Badge className={`${stockInfo.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-bold px-4 py-2 rounded-full`}>
                    {stockInfo.text}
                  </Badge>
                </div>

                {/* Rating */}
                {currentProduct.rating > 0 && (
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(currentProduct.rating)
                              ? 'text-gold fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-base text-navy/70 font-medium">
                      {currentProduct.rating.toFixed(1)} ({currentProduct.numReviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-3">
                <div className="flex items-baseline space-x-4">
                  <span className="text-5xl font-bold text-navy">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{currentProduct.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-green-600 font-bold text-lg">
                    You save ₹{(currentProduct.price - currentProduct.discountPrice).toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-playfair font-bold text-navy mb-4">Description</h3>
                <p className="text-navy/80 leading-relaxed text-lg">{currentProduct.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gold/20">
                <div>
                  <span className="text-sm text-navy/60 font-medium">Category</span>
                  <p className="font-bold text-navy capitalize text-lg">{currentProduct.category}</p>
                </div>
                <div>
                  <span className="text-sm text-navy/60 font-medium">Collection</span>
                  <p className="font-bold text-navy capitalize text-lg">{currentProduct.collections}</p>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="py-6 border-b border-gold/20">
                <h3 className="text-xl font-playfair font-bold text-navy mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-gold" />
                  Supplier Information
                </h3>
                {currentProduct.supplier ? (
                  <div className="bg-gradient-to-r from-gold/5 to-gold/10 rounded-2xl p-6 space-y-4 border border-gold/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/30 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-playfair font-bold text-navy text-lg">{currentProduct.supplier.name}</h4>
                        {currentProduct.supplier.specialty && (
                          <p className="text-navy/70 font-medium">{currentProduct.supplier.specialty}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gold" />
                        <span className="text-navy font-medium">{currentProduct.supplier.emailId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gold" />
                        <span className="text-navy font-medium">{currentProduct.supplier.phoneNumber}</span>
                      </div>
                      {currentProduct.supplier.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gold" />
                          <span className="text-navy font-medium">{currentProduct.supplier.location}</span>
                        </div>
                      )}
                      {currentProduct.supplier.certification && (
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-gold" />
                          <span className="text-navy font-medium">{currentProduct.supplier.certification}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-navy/60">No supplier information available for this product.</p>
                  </div>
                )}
              </div>
              


              {/* Quantity and Add to Cart */}
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <span className="text-base font-bold text-navy">Quantity:</span>
                  <div className="flex items-center border-2 border-gold/30 rounded-xl bg-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-12 w-12 p-0 hover:bg-gold/10 rounded-l-xl"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(currentProduct.countInStock, quantity + 1))}
                      disabled={quantity >= currentProduct.countInStock}
                      className="h-12 w-12 p-0 hover:bg-gold/10 rounded-r-xl"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!stockInfo.inStock}
                    className={`flex-1 py-6 text-lg font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-luxury-lg ${
                      stockInfo.inStock
                        ? 'bg-gold hover:bg-gold-dark text-navy'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {stockInfo.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  
                  <Button
                    onClick={() => setIsVideoCallModalOpen(true)}
                    variant="outline"
                    className="px-6 py-6 border-2 border-gold text-gold hover:bg-gold hover:text-navy font-bold rounded-2xl transition-all duration-500 transform hover:scale-105"
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Video Call
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-elegant border border-gold/10 hover:shadow-luxury transition-all duration-300">
                  <Truck className="h-6 w-6 text-gold" />
                  <div>
                    <p className="font-bold text-navy">Free Shipping</p>
                    <p className="text-sm text-navy/60">On orders over ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-elegant border border-gold/10 hover:shadow-luxury transition-all duration-300">
                  <Shield className="h-6 w-6 text-gold" />
                  <div>
                    <p className="font-bold text-navy">Authentic</p>
                    <p className="text-sm text-navy/60">100% genuine jewelry</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-elegant border border-gold/10 hover:shadow-luxury transition-all duration-300">
                  <RotateCcw className="h-6 w-6 text-gold" />
                  <div>
                    <p className="font-bold text-navy">Easy Returns</p>
                    <p className="text-sm text-navy/60">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="border-gold/20 shadow-luxury rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10">
                <h3 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-playfair font-bold text-navy mb-6 text-xl">Care Instructions</h4>
                    <ul className="space-y-4 text-navy/80">
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">Store in a dry, cool place away from direct sunlight</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">Clean gently with a soft cloth after each use</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">Avoid contact with perfumes, lotions, and chemicals</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">Professional cleaning recommended annually</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-navy mb-6 text-xl">Shipping & Returns</h4>
                    <ul className="space-y-4 text-navy/80">
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">Free shipping on orders over ₹5,000</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">2-3 business days delivery within city</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">30-day return policy for unworn items</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-base">Certificate of authenticity included</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <VideoCallModal />
      <Footer />
    </div>
  );
};

export default ProductDetail;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchFeaturedProducts } from '@/store/slices/productSlice';
import { Sparkles, ArrowRight } from 'lucide-react';

const FeaturedProducts = () => {
  const dispatch = useAppDispatch();
  const { featuredProducts, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Fetch featured products when component mounts
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  // If loading, show loading state
  if (loading && featuredProducts.length === 0) {
    return (
      <section className="py-20 sm:py-24 lg:py-32 luxury-gradient">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <Loading message="Loading featured products..." />
          </div>
        </div>
      </section>
    );
  }

  // If error and no products, show error state
  if (error && featuredProducts.length === 0) {
    return (
      <section className="py-20 sm:py-24 lg:py-32 luxury-gradient">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-navy mb-8">
              Featured Collection
            </h2>
            <p className="text-gray-600 mb-6">Unable to load featured products at the moment.</p>
            <Button 
              onClick={() => dispatch(fetchFeaturedProducts())}
              className="bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-4 rounded-2xl"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // If no featured products are available, don't render the section at all
  if (featuredProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-20 sm:py-24 lg:py-32 luxury-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gold rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-gold rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-gold rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full px-6 py-3 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-navy/80 font-medium">Curated Excellence</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-navy mb-8 sm:mb-10 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Featured Collection
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl text-navy/70 max-w-4xl mx-auto leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover our most beloved pieces, carefully curated for their exceptional craftsmanship and timeless elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-16 sm:mb-20">
          {featuredProducts.slice(0, 6).map((product, idx) => (
            <div 
              key={product.id ?? idx} 
              className="animate-fade-in" 
              style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Link to="/products">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-navy font-bold px-10 sm:px-12 py-5 text-lg sm:text-xl min-h-[56px] transition-all duration-500 transform hover:scale-105 hover:shadow-luxury-lg rounded-2xl group"
            >
              View All Products
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>

        {/* Show loading indicator if refreshing */}
        {loading && featuredProducts.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-sm text-navy/60">Updating featured products...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

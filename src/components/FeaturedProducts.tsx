
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchFeaturedProducts } from '@/store/slices/productSlice';

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
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
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
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Featured Collection
            </h2>
            <p className="text-gray-600 mb-6">Unable to load featured products at the moment.</p>
            <Button 
              onClick={() => dispatch(fetchFeaturedProducts())}
              className="bg-gold hover:bg-gold-dark text-navy"
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
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-navy mb-6 sm:mb-8 leading-tight">
            Featured Collection
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover our most beloved pieces, carefully curated for their exceptional craftsmanship and timeless elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
          {featuredProducts.slice(0, 6).map((product, idx) => (
            <ProductCard key={product.id ?? idx} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-navy font-semibold px-8 sm:px-10 py-4 text-base sm:text-lg min-h-[52px] transition-all duration-300"
            >
              View All Products
            </Button>
          </Link>
        </div>

        {/* Show loading indicator if refreshing */}
        {loading && featuredProducts.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Updating featured products...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

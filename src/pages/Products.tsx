import React, { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import ProductFilters from '@/components/ProductFilters';
import ProductBreadcrumb from '@/components/ProductBreadcrumb';
import ProductsHeader from '@/components/ProductsHeader';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchProducts, setFilters, clearFilters } from '@/store/slices/productSlice';
import { productService } from '@/services/productService';
import { ProductFilters as ProductFiltersType } from '@/types/redux';
import { Product, getStockStatus } from '@/types/product';

interface FilterOptions {
  categories: string[];
  collections: string[];
  priceRange: [number, number];
  isFeatured: boolean;
  onSale: boolean;
  inStockOnly: boolean;
}

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [filters, setLocalFilters] = useState<FilterOptions>({
    categories: [],
    collections: [],
    priceRange: [0, 100000],
    isFeatured: false,
    onSale: false,
    inStockOnly: false,
  });

  // Fetch all products once for sidebar counts
  useEffect(() => {
    productService.getProducts({ limit: 10000 }).then(setAllProducts);
  }, []);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    const apiFilters: ProductFiltersType = {
      sortBy: sortBy,
      limit: productsPerPage,
    };

    if (filters.categories.length > 0) {
      apiFilters.category = filters.categories; // Send all selected categories
    }
    if (filters.collections.length > 0) {
      apiFilters.collections = filters.collections; // Send all selected collections
    }
    if (filters.priceRange[0] > 0) {
      apiFilters.minPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1] < 100000) {
      apiFilters.maxPrice = filters.priceRange[1];
    }

    dispatch(fetchProducts(apiFilters));
  }, [dispatch, sortBy, filters, productsPerPage]);

  // Calculate product counts by category and collection
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    allProducts.forEach((product: Product) => {
      const category = product.category?.toLowerCase();
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    });
    
    return counts;
  }, [allProducts]);

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    allProducts.forEach((product: Product) => {
      const collection = product.collections?.toLowerCase();
      if (collection) {
        counts[collection] = (counts[collection] || 0) + 1;
      }
    });
    
    return counts;
  }, [allProducts]);

  // Filter products on client side for additional filters not handled by API
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const stockInfo = getStockStatus(product);
      
      // Stock filter
      if (filters.inStockOnly && !stockInfo.inStock) {
        return false;
      }
      
      // Featured products filter
      if (filters.isFeatured && !product.isFeatured) {
        return false;
      }
      
      // Sale filter - check if product has discount price
      if (filters.onSale && (!product.discountPrice || product.discountPrice >= product.price)) {
        return false;
      }
      
      return true;
    });
  }, [products, filters]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.collections.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++;
    if (filters.isFeatured) count++;
    if (filters.onSale) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  const breadcrumbItems = [
    { label: 'Products' }
  ];

  const clearAllFiltersAction = () => {
    setLocalFilters({
      categories: [],
      collections: [],
      priceRange: [0, 100000],
      isFeatured: false,
      onSale: false,
      inStockOnly: false,
    });
    dispatch(clearFilters());
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-28">
          <Loading message="Loading products..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-28">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <h2 className="text-2xl font-playfair text-navy mb-4">Error Loading Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => dispatch(fetchProducts({}))}
              className="bg-gold hover:bg-gold-dark text-navy"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <div className="pt-28">
        <div className="flex w-full max-w-7xl mx-auto">
          {/* Desktop Sidebar with Enhanced Scrollbar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-lg shadow-sm mr-6 border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-xl font-playfair font-bold text-navy">Filters</h2>
                </div>
                <div className="p-5">
                  <ProductFilters
                    filters={filters}
                    onFiltersChange={setLocalFilters}
                    productCounts={productCounts}
                    collectionCounts={collectionCounts}
                    totalProducts={allProducts.length}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-0">
            <div className="py-6">
              <ProductBreadcrumb items={breadcrumbItems} />
              
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-4">
                  Our Collection
                </h1>
                <p className="text-gray-600 max-w-3xl leading-relaxed">
                  Discover our exquisite selection of handcrafted jewelry pieces, each telling its own unique story.
                </p>
              </div>

              {/* Mobile Filter Sheet */}
              <div className="lg:hidden mb-6">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-navy min-h-[48px] px-4"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md pt-20">
                    <SheetHeader className="pb-6">
                      <SheetTitle className="text-navy font-playfair">Filters</SheetTitle>
                    </SheetHeader>
                    <ProductFilters
                      filters={filters}
                      onFiltersChange={setLocalFilters}
                      productCounts={productCounts}
                      collectionCounts={collectionCounts}
                      totalProducts={allProducts.length}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Products Header */}
              <ProductsHeader
                totalProducts={filteredProducts.length}
                currentPage={currentPage}
                productsPerPage={productsPerPage}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                view={view}
                onViewChange={setView}
                activeFiltersCount={activeFiltersCount}
              />

              {/* Loading indicator for filters */}
              {loading && (
                <div className="text-center py-8">
                  <Loading message="Updating products..." />
                </div>
              )}

              {/* Products Grid/List */}
              <div className={
                view === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }>
                {paginatedProducts.map((product: Product) => (
                  <EnhancedProductCard 
                    key={product._id} 
                    product={product} 
                    view={view}
                  />
                ))}
              </div>

              {/* No Results */}
              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-playfair text-navy mb-4">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more products.</p>
                  <Button
                    onClick={clearAllFiltersAction}
                    className="bg-gold hover:bg-gold-dark text-navy min-h-[48px] px-6"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  {/* Mobile: Simple prev/next */}
                  <div className="flex sm:hidden items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-gold text-gold hover:bg-gold hover:text-navy disabled:opacity-50 min-h-[48px] px-4"
                    >
                      Previous
                    </Button>
                    
                    <span className="px-4 py-2 text-sm text-navy bg-white border rounded-lg min-h-[48px] flex items-center">
                      {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gold text-gold hover:bg-gold hover:text-navy disabled:opacity-50 min-h-[48px] px-4"
                    >
                      Next
                    </Button>
                  </div>

                  {/* Desktop: Full pagination */}
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-gold text-gold hover:bg-gold hover:text-navy disabled:opacity-50 min-h-[48px]"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page 
                              ? "bg-gold text-navy min-h-[48px]" 
                              : "border-gold text-gold hover:bg-gold hover:text-navy min-h-[48px]"
                            }
                            size="sm"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gold text-gold hover:bg-gold hover:text-navy disabled:opacity-50 min-h-[48px]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
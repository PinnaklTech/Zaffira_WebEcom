import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ViewToggle from './ViewToggle';
import { Filter, SortAsc } from 'lucide-react';

interface ProductsHeaderProps {
  totalProducts: number;
  currentPage: number;
  productsPerPage: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  activeFiltersCount: number;
}

const ProductsHeader = ({
  totalProducts,
  currentPage,
  productsPerPage,
  sortBy,
  onSortChange,
  view,
  onViewChange,
  activeFiltersCount
}: ProductsHeaderProps) => {
  const startItem = (currentPage - 1) * productsPerPage + 1;
  const endItem = Math.min(currentPage * productsPerPage, totalProducts);

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'name', label: 'Name A-Z' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-luxury border border-gold/20 p-6 sm:p-8 mb-8">
      {/* Results info and filters count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-base text-navy/70 font-medium">
            Showing {startItem}-{endItem} of {totalProducts} results
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-sm bg-gold/20 text-gold px-4 py-2 rounded-full w-fit font-bold border border-gold/30">
              <Filter className="h-3 w-3 mr-1 inline" />
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <span className="text-base text-navy font-bold sm:whitespace-nowrap flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-gold" />
            Sort by:
          </span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-64 min-h-[52px] border-2 border-gold/30 rounded-2xl font-medium hover:border-gold transition-colors duration-300">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="glass-effect border-gold/20 shadow-luxury-lg z-50 rounded-2xl">
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer hover:bg-gold/10 min-h-[52px] flex items-center font-medium rounded-xl"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center sm:justify-end">
          <ViewToggle view={view} onViewChange={onViewChange} />
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
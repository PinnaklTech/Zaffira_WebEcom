import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Filter, Tag, DollarSign, Star } from 'lucide-react';

interface FilterOptions {
  categories: string[];
  collections: string[];
  priceRange: [number, number];
  isFeatured: boolean;
  onSale: boolean;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  productCounts: Record<string, number>;
  collectionCounts: Record<string, number>;
  totalProducts: number;
}

const ProductFilters = ({ 
  filters, 
  onFiltersChange, 
  productCounts, 
  collectionCounts,
  totalProducts 
}: ProductFiltersProps) => {
  const categories = [
    { value: 'rings', label: 'Rings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'pendants', label: 'Pendants' },
    { value: 'chains', label: 'Chains' },
    { value: 'watches', label: 'Watches' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const collections = [
    { value: 'gold', label: 'Gold Collection' },
    { value: 'silver', label: 'Silver Collection' },
    { value: 'diamond', label: 'Diamond Collection' },
    { value: 'platinum', label: 'Platinum Collection' },
    { value: 'vintage', label: 'Vintage Collection' },
    { value: 'modern', label: 'Modern Collection' },
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleCollectionChange = (collection: string, checked: boolean) => {
    const newCollections = checked
      ? [...filters.collections, collection]
      : filters.collections.filter(c => c !== collection);
    
    onFiltersChange({ ...filters, collections: newCollections });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      collections: [],
      priceRange: [0, 100000],
      isFeatured: false,
      onSale: false,
      inStockOnly: false,
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.collections.length > 0 ||
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 100000 ||
    filters.isFeatured || 
    filters.onSale ||
    filters.inStockOnly;

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6 pr-4">
        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pb-2">
            <span className="text-base font-bold text-navy flex items-center gap-2">
              <Filter className="h-4 w-4 text-gold" />
              Active Filters
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gold hover:text-gold-dark hover:bg-gold/10 h-9 px-3 rounded-xl font-medium"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-playfair font-bold text-navy text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-gold" />
            Categories
          </h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-3 py-1 hover:bg-gold/5 rounded-lg px-2 transition-colors duration-200">
                <Checkbox
                  id={category.value}
                  checked={filters.categories.includes(category.value)}
                  onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                  className="w-5 h-5 border-2 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                />
                <Label 
                  htmlFor={category.value} 
                  className="cursor-pointer flex-1 flex justify-between items-center font-medium"
                >
                  <span className="text-navy">{category.label}</span>
                  <span className="text-navy/60 text-sm bg-gold/10 px-2 py-1 rounded-full">
                    ({productCounts[category.value] || 0})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-gold/20" />

        {/* Collections */}
        <div className="space-y-4">
          <h3 className="font-playfair font-bold text-navy text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-gold" />
            Collections
          </h3>
          <div className="space-y-3">
            {collections.map((collection) => (
              <div key={collection.value} className="flex items-center space-x-3 py-1 hover:bg-gold/5 rounded-lg px-2 transition-colors duration-200">
                <Checkbox
                  id={collection.value}
                  checked={filters.collections.includes(collection.value)}
                  onCheckedChange={(checked) => handleCollectionChange(collection.value, checked as boolean)}
                  className="w-5 h-5 border-2 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                />
                <Label 
                  htmlFor={collection.value} 
                  className="cursor-pointer flex-1 flex justify-between items-center font-medium"
                >
                  <span className="text-navy">{collection.label}</span>
                  <span className="text-navy/60 text-sm bg-gold/10 px-2 py-1 rounded-full">
                    ({collectionCounts[collection.value] || 0})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-gold/20" />

        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="font-playfair font-bold text-navy text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gold" />
            Price Range
          </h3>
          <div className="px-2 py-4 bg-gold/5 rounded-2xl">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-navy font-bold mt-4">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">₹{filters.priceRange[0].toLocaleString('en-IN')}</span>
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-gold/20" />

        {/* Availability */}
        <div className="space-y-4">
          <h3 className="font-playfair font-bold text-navy text-lg">Availability</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 py-1 hover:bg-gold/5 rounded-lg px-2 transition-colors duration-200">
              <Checkbox
                id="inStockOnly"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, inStockOnly: checked as boolean })}
                className="w-5 h-5 border-2 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <Label htmlFor="inStockOnly" className="cursor-pointer font-medium text-navy">
                In Stock Only
              </Label>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-gold/20" />

        {/* Special Offers */}
        <div className="space-y-4 pb-6">
          <h3 className="font-playfair font-bold text-navy text-lg">Special Offers</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 py-1 hover:bg-gold/5 rounded-lg px-2 transition-colors duration-200">
              <Checkbox
                id="isFeatured"
                checked={filters.isFeatured}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, isFeatured: checked as boolean })}
                className="w-5 h-5 border-2 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <Label htmlFor="isFeatured" className="cursor-pointer font-medium text-navy">
                Featured Products
              </Label>
            </div>
            <div className="flex items-center space-x-3 py-1 hover:bg-gold/5 rounded-lg px-2 transition-colors duration-200">
              <Checkbox
                id="onSale"
                checked={filters.onSale}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, onSale: checked as boolean })}
                className="w-5 h-5 border-2 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <Label htmlFor="onSale" className="cursor-pointer font-medium text-navy">
                On Sale
              </Label>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ProductFilters;
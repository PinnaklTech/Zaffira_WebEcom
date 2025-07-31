import api from './api';

export interface ProductFilters {
  category?: string | string[];
  collections?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  limit?: number;
}

export const productService = {
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    
    // Handle category filter - support both single and multiple categories
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        params.append('category', filters.category.join(','));
      } else {
        if (filters.category.toLowerCase() !== 'all') {
          params.append('category', filters.category);
        }
      }
    }
    
    // Handle collections filter - support both single and multiple collections
    if (filters.collections) {
      if (Array.isArray(filters.collections)) {
        params.append('collections', filters.collections.join(','));
      } else {
        if (filters.collections.toLowerCase() !== 'all') {
          params.append('collections', filters.collections);
        }
      }
    }
    
    // Price range filters
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    // Sorting
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    // Limit
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Admin only
  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
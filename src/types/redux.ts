
import { Product } from './product';

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ProductFilters {
  category?: string | string[];
  collections?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

export interface AuthState {
  user: any;
  profile: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: any[];
  guestId: string | null;
  itemCount: number;
  total: number;
  loading: boolean;
  error: string | null;
}

// Auth-related interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Cart-related interfaces
export interface CartRequest {
  productId: string;
  quantity: number;
  guestId?: string;
}

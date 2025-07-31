
export interface ProductImage {
  url: string;
  altText?: string;
}

export interface Supplier {
  _id: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  certification?: string;
  location?: string;
  specialty?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  sku: string;
  category: string;
  collections: string;
  images: ProductImage[];
  isFeatured: boolean;
  isPublished: boolean;
  rating: number;
  numReviews: number;
  tags: string[];
  user: string;
  supplier?: Supplier;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
}

// Helper functions for product images
export const getPrimaryImage = (product: Product): string => {
  return product.images?.[0]?.url || '/placeholder.svg';
};

export const getImageCount = (product: Product): number => {
  return product.images?.length || 0;
};

// Helper function for stock status
export const getStockStatus = (product: Product) => {
  if (product.countInStock <= 0) {
    return { inStock: false, text: "Out of Stock", color: "text-red-500" };
  }
  if (product.countInStock <= 5) {
    return { inStock: true, text: `Only ${product.countInStock} left`, color: "text-orange-500" };
  }
  return { inStock: true, text: "In Stock", color: "text-green-500" };
};

// Map MongoDB product to frontend format
export const mapProductFromAPI = (apiProduct: any): Product => {
  return {
    id: apiProduct._id,
    _id: apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    discountPrice: apiProduct.discountPrice,
    countInStock: apiProduct.countInStock,
    sku: apiProduct.sku,
    category: apiProduct.category,
    collections: apiProduct.collections,
    images: apiProduct.images || [],
    isFeatured: apiProduct.isFeatured || false,
    isPublished: apiProduct.isPublished || false,
    rating: apiProduct.rating || 0,
    numReviews: apiProduct.numReviews || 0,
    tags: apiProduct.tags || [],
    user: apiProduct.user,
    supplier: apiProduct.supplier,
    metaTitle: apiProduct.metaTitle,
    metaDescription: apiProduct.metaDescription,
    metaKeywords: apiProduct.metaKeywords,
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,
    // Add legacy fields for compatibility
    popularity: apiProduct.rating || 0,
    isNew: false, // You can add logic to determine if product is new based on createdAt
    stockQuantity: apiProduct.countInStock,
    inStock: apiProduct.countInStock > 0
  } as Product;
};

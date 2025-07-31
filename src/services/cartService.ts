import api from './api';

export interface CartRequest {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (data: CartRequest) => {
    const response = await api.post('/cart', data);
    return response.data;
  },

  updateCartItem: async (data: CartRequest) => {
    const response = await api.put('/cart', data);
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const data = { productId };
    const response = await api.delete('/cart', { data });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/all');
    return response.data;
  },
};
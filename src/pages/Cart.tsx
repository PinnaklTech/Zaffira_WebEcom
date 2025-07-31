import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCart, updateCartItem, removeFromCart, addToCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, total, itemCount, loading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch cart when component mounts
    dispatch(fetchCart());
  }, [dispatch, user, navigate]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-navy">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-playfair font-bold text-navy mb-4">Your Cart</h1>
              <p className="text-xl text-red-600 mb-8">Error: {error}</p>
              <Button
                onClick={() => dispatch(fetchCart())}
                className="bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-3 mr-4"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="px-8 py-3"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-playfair font-bold text-navy mb-4">Your Cart</h1>
              <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-3"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-playfair font-bold text-navy mb-8">Your Cart</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <h3 className="font-playfair font-semibold text-navy text-lg">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-8 w-8"
                    disabled={loading}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="h-8 w-8"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-navy">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-700 mt-1"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-navy">Total: ₹{total.toLocaleString('en-IN')}</span>
                <span className="text-gray-600">({itemCount} items)</span>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/products')}
                  className="flex-1"
                  disabled={loading}
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => navigate('/book-appointment')}
                  className="flex-1 bg-gold hover:bg-gold-dark text-navy font-semibold"
                  disabled={loading}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
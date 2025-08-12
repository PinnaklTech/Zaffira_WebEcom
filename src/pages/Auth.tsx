
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { login, register, clearError } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Clear any previous errors when switching between login/register
    if (error) {
      dispatch(clearError());
    }
  }, [isLogin, dispatch]);

  useEffect(() => {
    // After successful login, redirect to intended destination or home
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    // Show error toast when there's an authentication error
    if (error) {
      toast({
        title: isLogin ? "Sign in failed" : "Sign up failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const result = await dispatch(login({
          email: formData.email,
          password: formData.password
        })).unwrap();
        
      } else {
        const result = await dispatch(register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })).unwrap();
        
        // Switch to login mode after successful registration
        setIsLogin(true);
        setFormData({
          name: '',
          email: formData.email,
          password: ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen luxury-gradient flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <Link to="/" className="text-5xl font-playfair font-bold text-navy hover:text-gold transition-colors duration-300">
            Zaffira
          </Link>
          <p className="text-navy/60 mt-3 font-inter text-lg">Luxury Jewelry Collection</p>
          {location.state?.from && (
            <p className="text-gold mt-2 font-medium">Sign in to continue your journey</p>
          )}
        </div>

        {/* Auth Card */}
        <Card className="glass-effect shadow-luxury-lg border border-gold/20 rounded-3xl overflow-hidden animate-scale-in">
          <CardHeader className="text-center bg-gradient-to-r from-navy via-navy-light to-navy text-white py-10">
            <CardTitle className="text-3xl font-playfair font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-white/90 font-inter text-lg mt-2">
              {isLogin ? 'Sign in to your account' : 'Join our exclusive collection'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-navy font-bold text-base">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold h-5 w-5" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-12 border-2 border-gold/30 focus:border-gold focus:ring-gold/20 rounded-xl h-12"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-navy font-bold text-base">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold h-5 w-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 border-2 border-gold/30 focus:border-gold focus:ring-gold/20 rounded-xl h-12"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-navy font-bold text-base">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 border-2 border-gold/30 focus:border-gold focus:ring-gold/20 rounded-xl h-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy/60 hover:text-gold transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {isLogin && (
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-gold hover:text-gold-dark font-bold transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-navy font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-gold/20">
              <p className="text-center text-navy/70 text-lg">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    dispatch(clearError());
                  }}
                  className="ml-2 text-gold hover:text-gold-dark font-bold transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-navy/60 hover:text-navy transition-colors font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state if available
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
      toast({
        title: "Invalid OTP",
        description: "OTP must be exactly 6 digits.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(formData.email, formData.otp, formData.newPassword);
      
      toast({
        title: "Password reset successful!",
        description: "You can now sign in with your new password.",
      });
      
      setResetSuccess(true);
      
      // Redirect to login page after success
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
      
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.response?.data?.message || "Please try again or request a new OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-gold/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-playfair font-bold text-navy hover:text-gold transition-colors duration-300">
            Zaffira
          </Link>
          <p className="text-navy/60 mt-2 font-inter">Luxury Jewelry Collection</p>
        </div>

        {/* Reset Password Card */}
        <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border border-white/30 rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-navy to-navy-light text-white py-8">
            <div className="flex items-center justify-center mb-2">
              {resetSuccess ? (
                <CheckCircle className="h-8 w-8 text-green-400 mr-2" />
              ) : (
                <Key className="h-8 w-8 text-gold mr-2" />
              )}
            </div>
            <CardTitle className="text-2xl font-playfair">
              {resetSuccess ? 'Password Reset Complete' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-white/80 font-inter">
              {resetSuccess 
                ? "Your password has been successfully updated" 
                : "Enter the OTP and your new password"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {!resetSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-navy font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 border-navy/20 focus:border-gold focus:ring-gold/20 rounded-xl"
                      placeholder="Enter your email address"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-navy font-medium">6-Digit OTP</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="pl-10 border-navy/20 focus:border-gold focus:ring-gold/20 rounded-xl text-center tracking-widest font-mono text-lg"
                      placeholder="000000"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-navy/60">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-navy font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 border-navy/20 focus:border-gold focus:ring-gold/20 rounded-xl"
                      placeholder="Enter new password"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-navy/60 hover:text-navy transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-navy font-medium">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 border-navy/20 focus:border-gold focus:ring-gold/20 rounded-xl"
                      placeholder="Confirm new password"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-navy/60 hover:text-navy transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Password Reset Successful!</h3>
                  <p className="text-green-700 text-sm">
                    Your password has been successfully updated.
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    You can now sign in with your new password.
                  </p>
                </div>
                
                <p className="text-navy/60 text-sm">
                  Redirecting to sign in page...
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-navy/10">
              <div className="text-center space-y-3">
                {!resetSuccess && (
                  <Link
                    to="/forgot-password"
                    className="block text-navy/60 hover:text-navy transition-colors text-sm font-medium"
                  >
                    Request New OTP
                  </Link>
                )}
                <Link
                  to="/auth"
                  className="block text-navy/60 hover:text-navy transition-colors text-sm font-medium"
                >
                  Back to Sign In
                </Link>
                <Link
                  to="/"
                  className="block text-navy/60 hover:text-navy transition-colors text-sm font-medium"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 
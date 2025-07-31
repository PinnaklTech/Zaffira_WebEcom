import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      
      toast({
        title: "OTP sent successfully!",
        description: "Please check your email for the 6-digit OTP code.",
      });
      
      setOtpSent(true);
      
      // Navigate to reset password page with email
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.response?.data?.message || "Please try again later.",
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

        {/* Forgot Password Card */}
        <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border border-white/30 rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-navy to-navy-light text-white py-8">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-8 w-8 text-gold mr-2" />
            </div>
            <CardTitle className="text-2xl font-playfair">Forgot Password</CardTitle>
            <CardDescription className="text-white/80 font-inter">
              {otpSent 
                ? "OTP sent to your email" 
                : "Enter your email to receive an OTP"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {!otpSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-navy font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/60 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-navy/20 focus:border-gold focus:ring-gold/20 rounded-xl"
                      placeholder="Enter your email address"
                      required
                      disabled={loading}
                    />
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
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="h-4 w-4 mr-2" />
                      Send OTP
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">OTP Sent Successfully!</h3>
                  <p className="text-green-700 text-sm">
                    We've sent a 6-digit OTP to <strong>{email}</strong>
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    The OTP will expire in 10 minutes
                  </p>
                </div>
                
                <p className="text-navy/60 text-sm">
                  Redirecting to reset password page...
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-navy/10">
              <div className="text-center space-y-3">
                <Link
                  to="/auth"
                  className="flex items-center justify-center text-navy/60 hover:text-navy transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
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

export default ForgotPassword; 
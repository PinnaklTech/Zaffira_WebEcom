
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import Loading from '@/components/Loading';
import { toast } from '@/hooks/use-toast';

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Dispatch logout action
        dispatch(logout());
        
        // Show success message
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account.",
        });

        // Redirect to home page after a brief delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (error) {
        toast({
          title: "Logout failed",
          description: "There was an issue signing you out.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-gold/10 flex items-center justify-center px-4">
      <div className="text-center">
        <Loading message="Signing you out..." />
        <p className="text-navy/60 mt-4">Please wait while we sign you out...</p>
      </div>
    </div>
  );
};

export default Logout;

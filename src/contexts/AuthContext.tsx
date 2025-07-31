
import React, { createContext, useContext } from 'react';
import { User, Profile, AuthContextType } from '@/types/auth';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { login, register, logout } from '@/store/slices/authSlice';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Bridge AuthContext to Redux state
  const { user, profile, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const signUp = async (email: string, password: string, firstName: string, lastName: string, username: string) => {
    try {
      const result = await dispatch(register({
        name: `${firstName} ${lastName}`,
        email,
        password
      })).unwrap();
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error || 'Registration failed' } };
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      const result = await dispatch(login({
        email: emailOrUsername,
        password
      })).unwrap();
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error || 'Login failed' } };
    }
  };

  const signInAdmin = async (emailOrUsername: string, password: string) => {
    try {
      const result = await dispatch(login({
        email: emailOrUsername,
        password
      })).unwrap();
      
      const isAdminUser = result.user?.role === 'admin';
      return { error: null, isAdmin: isAdminUser };
    } catch (error: any) {
      return { error: { message: error || 'Admin login failed' }, isAdmin: false };
    }
  };

  const signOut = async () => {
    dispatch(logout());
  };

  const isAdmin = user?.role === 'admin' || profile?.role === 'admin' || false;

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInAdmin,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

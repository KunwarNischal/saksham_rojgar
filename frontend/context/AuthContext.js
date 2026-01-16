"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken, removeAuthToken, getStoredUser, setStoredUser } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (storedUser && token) {
      setUser(storedUser);
    } else {
      // Clear any partial data
      removeAuthToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response;
      
      setAuthToken(token);
      setStoredUser(userData);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response;
      
      setAuthToken(token);
      setStoredUser(newUser);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Clear all auth data immediately
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
    }
    
    // Clear state
    setUser(null);
    
    // Force full page reload to /login with logout parameter to clear all cached state
    if (typeof window !== 'undefined') {
      window.location.replace('/login?logout=true');
    }
  };

  const updateUser = (updatedUser) => {
    setStoredUser(updatedUser);
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

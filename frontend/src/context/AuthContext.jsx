import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('mlm_token');
      if (token) {
        try {
          const profile = await api.user.getProfile();
          if (profile.success) {
            setUser(profile.data);
          } else {
            localStorage.removeItem('mlm_token');
          }
        } catch (error) {
          console.error('Re-authentication failed:', error);
          localStorage.removeItem('mlm_token');
        }
      }
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (loginId, password) => {
    setLoading(true);
    try {
      const response = await api.auth.login(loginId, password);
      if (response.success) {
        localStorage.setItem('mlm_token', response.data.token || response.data.accessToken);
        setUser(response.data);
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.auth.register(userData);
      if (response.success) {
        // Automatically log in on registration
        localStorage.setItem('mlm_token', response.data.token || response.data.accessToken);
        setUser(response.data);
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mlm_token');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await api.user.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

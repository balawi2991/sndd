import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api/auth.api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth and validate
    const checkAuth = async () => {
      const savedUser = authAPI.getSavedUser();
      
      if (savedUser && authAPI.isAuthenticated()) {
        // Verify token is still valid
        const response = await authAPI.getCurrentUser();
        
        if (response.success && response.data) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear auth
          authAPI.clearAuth();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string, remember = false) => {
    const response = await authAPI.login({ email, password });
    
    if (response.success && response.data) {
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      setIsAuthenticated(true);
      
      authAPI.saveTokens(accessToken, refreshToken);
      authAPI.saveUser(user);
    } else {
      throw new Error(response.error?.message || 'Login failed');
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await authAPI.register({ name, email, password });
    
    if (response.success && response.data) {
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      setIsAuthenticated(true);
      
      authAPI.saveTokens(accessToken, refreshToken);
      authAPI.saveUser(user);
    } else {
      throw new Error(response.error?.message || 'Registration failed');
    }
  };

  const signOut = () => {
    authAPI.logout().catch(console.error);
    authAPI.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string) => {
    console.log('Resetting password for:', email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
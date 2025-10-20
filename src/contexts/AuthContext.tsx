import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth
    const token = localStorage.getItem('mintchat_token');
    const storedUser = localStorage.getItem('mintchat_user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = async (email: string, password: string, remember = false) => {
    try {
      const { data } = await authAPI.signIn(email, password);
      
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      };
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Always save token and user for session persistence
      localStorage.setItem('mintchat_token', data.token);
      localStorage.setItem('mintchat_user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Sign in failed');
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { data } = await authAPI.signUp(name, email, password);
      
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      };
      
      setUser(user);
      setIsAuthenticated(true);
      
      localStorage.setItem('mintchat_token', data.token);
      localStorage.setItem('mintchat_user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Sign up failed');
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mintchat_user');
    localStorage.removeItem('mintchat_token');
  };

  const resetPassword = async (email: string) => {
    try {
      await authAPI.resetPassword(email);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
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
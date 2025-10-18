import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const storedUser = localStorage.getItem('mintchat_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = async (email: string, password: string, remember = false) => {
    console.log('Signing in:', { email, remember });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    if (remember) {
      localStorage.setItem('mintchat_user', JSON.stringify(mockUser));
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    console.log('Signing up:', { name, email });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: '1',
      name,
      email,
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('mintchat_user', JSON.stringify(mockUser));
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mintchat_user');
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
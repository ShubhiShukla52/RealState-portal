import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * User interface ready for future authentication integration (e.g. Supabase, Firebase, or custom backend).
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: 'user' | 'agent' | 'admin';
  createdAt?: string;
}

/**
 * AuthContextType defining the contract for EstateX authentication.
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  isAuthenticated: false,
  signIn: async () => {
    // Planned for future backend / Supabase integration
    console.info('signIn placeholder: real authentication will be integrated in future steps.');
  },
  signUp: async () => {
    // Planned for future backend / Supabase integration
    console.info('signUp placeholder: real authentication will be integrated in future steps.');
  },
  signOut: async () => {
    // Planned for future backend / Supabase integration
    console.info('signOut placeholder: real authentication will be integrated in future steps.');
  },
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Minimal AuthProvider foundation.
 * Ready for future authentication providers without fake credentials or mock logins.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user] = useState<User | null>(null);
  const [loading] = useState<boolean>(false);

  const signIn = async () => {
    // Ready for future integration
  };

  const signUp = async () => {
    // Ready for future integration
  };

  const signOut = async () => {
    // Ready for future integration
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to safely consume authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

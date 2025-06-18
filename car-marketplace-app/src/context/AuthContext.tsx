// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    // setIsLoading(true); // Optional: set loading specific to this action
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting currentUser and global isLoading
    } catch (error) {
      // Let the calling screen handle the error display
      // setIsLoading(false); // Reset if action-specific loading was true
      throw error; // Re-throw the error to be caught by the UI component
    }
  };

  const signup = async (email: string, pass: string) => {
    // setIsLoading(true); // Optional: set loading specific to this action
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting currentUser and global isLoading
    } catch (error) {
      // setIsLoading(false); // Reset if action-specific loading was true
      throw error; // Re-throw the error to be caught by the UI component
    }
  };

  const logout = async () => {
    // setIsLoading(true); // isLoading is already true from onAuthStateChanged perspective
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
      // Re-throw or handle as needed, though signout rarely fails critically
      throw error;
    }
    // No finally setIsLoading(false) here, onAuthStateChanged handles it
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

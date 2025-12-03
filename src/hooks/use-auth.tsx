
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string, role: string, phone: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function ensures we don't try to use Firebase until it's initialized on the client.
    const initializeAuth = async () => {
      // isSupported() is a good check for client-side environment.
      // We also check if auth.onAuthStateChanged is a function, which it won't be for the dummy object.
      if (typeof window !== 'undefined' && typeof auth.onAuthStateChanged === 'function') {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      } else {
        // If we're on the server or Firebase isn't ready, we're not authenticated.
        setUser(null);
        setLoading(false);
      }
    };
    
    initializeAuth();
    
  }, []);

  const signIn = (email: string, pass: string) => {
    // Use auth directly from firebase import to ensure it's the initialized one
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, displayName: string, role: string, phone: string) => {
    // Use auth directly from firebase import
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    await updateProfile(user, { displayName });

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: displayName,
      email: user.email,
      role: role,
      phone: phone,
      createdAt: serverTimestamp(),
    });

    return userCredential;
  };

  const signOut = () => {
    // Use auth directly from firebase import
    return firebaseSignOut(auth);
  };
  
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

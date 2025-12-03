
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { UserProvider } from './auth/use-user';

interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  firestore,
}: FirebaseProviderProps) {
  const value = { firebaseApp, auth, firestore };
  return (
    <FirebaseContext.Provider value={value}>
        <UserProvider>{children}</UserProvider>
    </FirebaseContext.Provider>
  );
}

// Hook to use the firebase app instance
export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
}

// Hook to use the auth instance
export function useAuth() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

// Hook to use the firestore instance
export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}

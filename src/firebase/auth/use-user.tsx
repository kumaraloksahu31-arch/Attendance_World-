
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase/provider';

interface UserProfileData {
  displayName: string;
  role: string;
  phone: string;
}

export interface AuthResult {
  error: string | null;
}

const handleAuthError = (error: any): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email address is already in use by another account.';
      case 'auth/weak-password':
        return 'The password is too weak. Please choose a stronger password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed before completion.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in cancelled. Please try again.';
      default:
        return `An unexpected error occurred: ${error.message}`;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

interface UserContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<AuthResult>;
  signUp: (email: string, pass: string, profileData: UserProfileData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<AuthResult>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signInWithEmail = useCallback(async (email: string, pass: string): Promise<AuthResult> => {
    if (!auth) return { error: 'Authentication service is not available.' };
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { error: null };
    } catch (e) {
      return { error: handleAuthError(e) };
    }
  }, [auth]);

  const signUp = useCallback(async (email: string, pass: string, profileData: UserProfileData): Promise<AuthResult> => {
    if (!auth || !firestore) return { error: 'Authentication service is not available.' };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      await updateProfile(user, { displayName: profileData.displayName });

      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        displayName: profileData.displayName,
        email: user.email,
        role: profileData.role,
        phone: profileData.phone,
        createdAt: serverTimestamp(),
      });
      return { error: null };
    } catch (e) {
      return { error: handleAuthError(e) };
    }
  }, [auth, firestore]);

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!auth || !firestore) return { error: 'Authentication service is not available.' };
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          role: 'student', // Default role for Google Sign-In
          phone: user.phoneNumber || '',
          createdAt: serverTimestamp(),
        });
      }
      return { error: null };
    } catch (e) {
      return { error: handleAuthError(e) };
    }
  }, [auth, firestore]);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, [auth]);

  const value = {
    user,
    loading,
    signInWithEmail,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

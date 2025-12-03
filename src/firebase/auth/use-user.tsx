
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
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
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase/provider';

interface UserProfileData {
    displayName: string;
    role: string;
    phone: string;
}

interface UserContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, profileData: UserProfileData) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const authInstance = useAuth();
  const firestoreInstance = useFirestore();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authInstance) {
        setLoading(false);
        return;
    };
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [authInstance]);

  const signInWithEmail = useCallback(
    async (email: string, pass: string) => {
      if (!authInstance) throw new Error("Auth not initialized");
      return signInWithEmailAndPassword(authInstance, email, pass);
    },
    [authInstance]
  );

  const signUp = useCallback(
    async (email: string, pass: string, profileData: UserProfileData) => {
      if (!authInstance || !firestoreInstance) throw new Error("Firebase not initialized");
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, pass);
      const user = userCredential.user;
      await updateProfile(user, { displayName: profileData.displayName });

      await setDoc(doc(firestoreInstance, "users", user.uid), {
        uid: user.uid,
        displayName: profileData.displayName,
        email: user.email,
        role: profileData.role,
        phone: profileData.phone,
        createdAt: serverTimestamp(),
      });

      return userCredential;
    },
    [authInstance, firestoreInstance]
  );

  const signInWithGoogle = useCallback(async () => {
    if (!authInstance || !firestoreInstance) throw new Error("Firebase not initialized");
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(authInstance, provider);
    const user = userCredential.user;

    const userDocRef = doc(firestoreInstance, 'users', user.uid);
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

    return userCredential;
  }, [authInstance, firestoreInstance]);

  const signOut = useCallback(() => {
    if (!authInstance) throw new Error("Auth not initialized");
    return firebaseSignOut(authInstance);
  }, [authInstance]);

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

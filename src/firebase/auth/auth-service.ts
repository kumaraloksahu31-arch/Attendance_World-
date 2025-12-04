
'use server';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firebase App and services
function getFirebaseServices() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { auth, firestore, app };
}

export interface AuthResult {
  error: string | null;
}

interface UserProfileData {
  displayName: string;
  role: string;
  phone: string;
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

export const signInWithEmail = async (email: string, pass: string): Promise<AuthResult> => {
  try {
    const { auth } = getFirebaseServices();
    await signInWithEmailAndPassword(auth, email, pass);
    return { error: null };
  } catch (e) {
    return { error: handleAuthError(e) };
  }
};

export const signUp = async (email: string, pass: string, profileData: UserProfileData): Promise<AuthResult> => {
  try {
    const { auth, firestore } = getFirebaseServices();
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
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const { auth, firestore } = getFirebaseServices();
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
};


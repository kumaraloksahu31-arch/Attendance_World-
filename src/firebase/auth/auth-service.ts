
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

export const signInWithEmail = async (auth: Auth, email: string, pass: string): Promise<AuthResult> => {
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    return { error: null };
  } catch (e) {
    return { error: handleAuthError(e) };
  }
};

export const signUp = async (auth: Auth, firestore: Firestore, email: string, pass: string, profileData: UserProfileData): Promise<AuthResult> => {
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
};

export const signInWithGoogle = async (auth: Auth, firestore: Firestore): Promise<AuthResult> => {
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
};

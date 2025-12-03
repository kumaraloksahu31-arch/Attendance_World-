
'use client';

import { getApps, initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import { FirebaseProvider, useFirebaseApp, useAuth, useFirestore } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

// This function should only be called on the client.
function initializeFirebase() {
  // Check if we are on the client side.
  if (typeof window === 'undefined') {
    // On the server, return null for all services.
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
    } as unknown as {
        firebaseApp: FirebaseApp;
        auth: Auth;
        firestore: Firestore;
    };
  }

  // On the client, initialize Firebase if it hasn't been already.
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return {
    firebaseApp: app,
    auth,
    firestore,
  };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
  useUser,
  useCollection,
  useDoc,
};

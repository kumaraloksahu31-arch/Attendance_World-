
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { getApps, initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

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

/**
 * Ensures that Firebase is initialized only once on the client.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    // initializeFirebase() is client-only. It will not run on the server.
    // We can be sure that `window` is defined here.
    const firebaseInstances = initializeFirebase();
    setFirebase(firebaseInstances);
  }, []);

  // While the Firebase app is initializing, we can show a loader or nothing.
  if (!firebase) {
    return null;
  }

  // Once initialized, we can render the FirebaseProvider with the instances.
  return (
    <FirebaseProvider
      firebaseApp={firebase.firebaseApp}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}

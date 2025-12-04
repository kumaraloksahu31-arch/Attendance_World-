
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { getApps, initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

interface FirebaseInstances {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * Ensures that Firebase is initialized only once on the client.
 * It will render its children only after Firebase has been fully initialized.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This effect runs only on the client.
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    
    setInstances({ firebaseApp: app, auth, firestore });
  }, []);

  // While the Firebase app is initializing, we render nothing.
  // This prevents child components from trying to use Firebase services
  // before they are ready.
  if (!instances) {
    return null; 
  }

  // Once initialized, we render the FirebaseProvider with the instances.
  return (
    <FirebaseProvider
      firebaseApp={instances.firebaseApp}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}

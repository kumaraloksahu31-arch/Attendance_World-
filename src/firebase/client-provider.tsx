
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

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

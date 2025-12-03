
'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  type DocumentData,
  type DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

interface UseDocReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDoc<T extends DocumentData>(
  ref: DocumentReference<DocumentData> | null
): UseDocReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setData({
              id: docSnap.id,
              ...docData,
              createdAt: docData.createdAt?.toDate(),
              updatedAt: docData.updatedAt?.toDate(),
          } as T);
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching document: ", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]); // Re-run effect if reference object changes

  return { data, loading, error };
}

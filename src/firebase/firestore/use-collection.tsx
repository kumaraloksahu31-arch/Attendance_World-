
'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  type DocumentData,
  type Query,
  type Firestore,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

interface UseCollectionReturn<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<T[] | null>>;
}

export function useCollection<T extends DocumentData>(
  q: Query<DocumentData> | null
): UseCollectionReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      setData(null);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => {
            const docData = doc.data();
            return {
            id: doc.id,
            ...docData,
            createdAt: docData.createdAt?.toDate(),
            updatedAt: docData.updatedAt?.toDate(),
          } as T;
        });
        setData(documents);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching collection: ", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]); // Re-run effect if query object changes

  return { data, loading, error, setData };
}
